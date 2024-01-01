import { Client } from '@notionhq/client';
import { Book } from '../models/book.js';
import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints.js';
import { createBookTemplate } from '../templates/bookTemplate.js';
import { createHighlightTemplate } from '../templates/highlightTemplates.js';

class NotionSyncController {    
	private notion: Client;
	private books_db_id: string;
	private highlights_db_id: string;

	constructor(NOTION_API_KEY, books_db_id, highlights_db_id) {
		this.notion = new Client({ auth: NOTION_API_KEY });
		this.books_db_id = books_db_id
		this.highlights_db_id = highlights_db_id
	}

	public filterBooks(parsedBooks: Book[], existingBooksList: any[]): any {
		const existingBooks = existingBooksList.map((result: DatabaseObjectResponse) => {
			const id = result.id

			const titleProp = result.properties?.Title['title']
			const title = (titleProp.length === 0? "": titleProp[0]['text']['content'])

			const authorProp = result.properties?.Author['rich_text']
			const author = (authorProp.length === 0? "": authorProp[0]['text']['content'])

			return { title, author, id };
		});


		const nonExistingBooks = parsedBooks.filter((parsedBook) => {
			return !existingBooks.some(
				(existingBook) =>
					existingBook.title === parsedBook.title &&
					existingBook.author === parsedBook.author
			);
		});

		return {existingBooks, nonExistingBooks}
	}

	public filterHighlights(parsedBooks: Book[], existingHighlightsList: any[]): any {
		const existingHighlights = existingHighlightsList.reduce((accumulator, result: DatabaseObjectResponse) => {
			const id = result.id;
			const idHighlightProp = result.properties?.Id['rich_text'];
			const idHighlight = idHighlightProp.length === 0 ? "" : idHighlightProp[0]['text']['content'];
		  
			accumulator[idHighlight] = id;
		  
			return accumulator;
		}, {} as Record<string, string>);		  

		const booksWithNonExistingHighlights: Book[] = parsedBooks.map((book) => {
			const copiedBook = Book.copy(book);

			copiedBook.highlights = copiedBook.highlights.filter((highlight) => {
				return ! existingHighlights.hasOwnProperty(highlight.id);
			})

			copiedBook.soloNotes = copiedBook.soloNotes.filter((highlight) => {
				return ! existingHighlights.hasOwnProperty(highlight.id);
			})

			return copiedBook
		});
		
		return {existingHighlights, booksWithNonExistingHighlights}
	}

	public async getNotionHighlights(): Promise<any[]> {
		const highlightsList: any[] = [];
		let cursor: string | undefined = undefined;
		do {
			const response = await this.notion.databases.query({
				database_id: this.highlights_db_id,
				start_cursor: cursor,
				page_size: 100,
			});
			
			highlightsList.push(...response.results);
			cursor = response.next_cursor;
		} while (cursor);

		return highlightsList
	}


	public async syncHighlights(parsedBooks: Book[], booksHighlightIds: any): Promise<any> {
		const existingHighlightsList = await this.getNotionHighlights();
		const { existingHighlights, booksWithNonExistingHighlights } = this.filterHighlights(parsedBooks, existingHighlightsList);
		
		booksWithNonExistingHighlights.forEach(async (book) => {
			const { id, child_id} = booksHighlightIds[book.identifyBook()]
			const synchedBlocks = await Promise.all(
				book.highlights.map(async (highlight) => {
					const contentArray = highlight.content.match(/.{1,2000}/g) || [highlight.content]; // decompose content to blocks of max size 2000
					const psps = createHighlightTemplate(
						this.highlights_db_id, 
						highlight.id,
						id,
						contentArray,
						highlight.timestamp,
						highlight.location,
						highlight.page,
						highlight.notes
					)

					const { children, ...newPsps } = psps;

					const highlightPage = await this.notion.pages.create(newPsps);

					const synchedBlock = await this.notion.blocks.children.append({
						block_id: highlightPage.id,
						children: children
					});
					return {
						type: "synced_block",
						synced_block: {
							synced_from: {
								block_id: synchedBlock.results[0].id
							}
						}
					}
				}
			));
			
			const response___ = await this.notion.blocks.children.append({
				block_id: child_id,
				children: synchedBlocks
			});
			
		});

	}

	public async getNotionBooks(): Promise<any[]> {
		const booksList: any[] = [];
		let cursor_books: string | undefined = undefined;

		do {
			const response = await this.notion.databases.query({
				database_id: this.books_db_id,
				start_cursor: cursor_books,
				page_size: 100,
			});

			booksList.push(...response.results);
			cursor_books = response.next_cursor;
		} while (cursor_books);

		return booksList
	}

	public async syncBooks(parsedBooks: Book[]): Promise<any> {
		const existingBooksList = await this.getNotionBooks()
		const { existingBooks, nonExistingBooks } = this.filterBooks(parsedBooks, existingBooksList);

		const createPagePromises = nonExistingBooks.map(async (book) => {
			const page = await this.notion.pages.create(createBookTemplate(this.books_db_id, book.title, book.author));
			return { title: book.title, author: book.author, id: page.id };
		});

		let results;

		try {
			results = await Promise.all(createPagePromises);
			console.log('All pages created successfully.');
		} catch (error) {
			console.error('Error creating pages:', error);
		}

		const allBooks = [...existingBooks, ...results];

		const finalResult = await Promise.all(
			allBooks.map(async (element) => {
				const response_child = await this.notion.blocks.children.list({
					block_id: element.id,
				});
				const lastChildId = response_child.results[response_child.results.length - 1]?.id;

				return { [`${element.title}-${element.author}`]: { id: element.id, child_id: lastChildId } };
			})
		);

		return finalResult.reduce((acc, obj) => ({ ...acc, ...obj }), {});
	}

}

export default NotionSyncController;
