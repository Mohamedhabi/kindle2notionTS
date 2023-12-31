import { Client } from '@notionhq/client';
import { Book } from '../models/book.js';
import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints.js';
import { createBookTemplate } from '../templates/bookTemplate.js';

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

  public async syncBooks(parsedBooks: Book[], existingBooksList: any[]): Promise<any> {
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
	
		  return { title: element.title, author: element.author, child_id: lastChildId };
		})
	  );

	return finalResult
  }

}

export default NotionSyncController;
