import { Highlight } from "./highlight.js";

export class Book {
	title: string;
	author: string;
	publisher: string;
	publicationYear: number;
	highlights: Highlight[] = [];
	soloNotes: Highlight[] = [];

	constructor(title: string, author: string, publisher: string, publicationYear: number, highlights: Highlight[], soloNotes: Highlight[]) {
		this.title = title;
		this.author = author;
		this.publisher = publisher;
		this.publicationYear = publicationYear;
		this.highlights = highlights;
		this.soloNotes = soloNotes;
	}

	integrateNotesInHighlights(): void {
		var newSoloNotes: Highlight[] = [];

		this.soloNotes.map((note) => {
			const highlight = this.highlights.find((highlight) => 
                highlight.location.start <= note.location.start && highlight.location.end >= note.location.start
			);

			if (highlight) {
				highlight.notes = highlight.notes ? [...highlight.notes, note] : [note];
			} else {
				newSoloNotes.push(note);
			}
		});

		this.soloNotes = newSoloNotes;
	}
}
