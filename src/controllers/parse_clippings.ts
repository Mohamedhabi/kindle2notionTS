import { Book } from '../models/book.js';
import { Highlight } from '../models/highlight.js';

export function parseClippings(inputData: string): Book[] {
    const books: Book[] = [];
    let currentBook: Book | null = null;
    const outliers = /\uFEFF/gmu;

    inputData.split("\r\n==========\r\n").forEach((section) => {
        if (section.trim() !== "") {
            const sectionFiltered = section.replace(outliers, "");
            const lines = sectionFiltered.split('\n');

            // Extract book details from the first line
            const bookDetails = lines[0].match(/(.+) \((.+)\)/);
            if (bookDetails) {
                const [title, author] = [bookDetails[1], bookDetails[2]];

                // Check if the book already exists in the array
                const existingBook = books.find((book) => book.title === title && book.author === author);

                if (existingBook) {
                    // If the book already exists, use it
                    currentBook = existingBook;
                } else {
                    // If the book doesn't exist, create a new one
                    books.push(new Book(title, author, "", 0, [], []));
                }
            }

            // Extract highlights and notes
            if (currentBook) {
                const regex = /Your (Highlight|Note) [^|]*?(?:[\s]+page (\d+)\s*(?:-\s*(\d+))? \|)?(?:[\s]+Location (\d+)\s*(?:-\s*(\d+))? \|)?[\s]+Added on[\s]+(.+)/
                const highlightMatch = lines[1].match(regex);
                if (highlightMatch) {
                    const [, , pageStart, pageEnd, locationStart, locationEnd, ] = highlightMatch.map(Number);
                    const highlight = new Highlight(
                        lines.slice(3, lines.length).join('\n'),
                        highlightMatch[6],
                        { start: locationStart, end: locationEnd },
                        { start: pageStart, end: pageEnd },
                      );
                      
                    if (highlightMatch[1] === 'Note') {
                        currentBook.soloNotes.push(highlight);
                    } else {
                        currentBook.highlights.push(highlight);
                    }
                } else {
                    console.log("Parsing Error")
                }
            }
        }
    });
    // For each note put it inside its corresponding highlight
    books.forEach((book) => {
        book.integrateNotesInHighlights()
        book.updateHighlitIds()
    })
    return books;
}
