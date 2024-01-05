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

	static copy(original: Book): Book {
		return new Book(
		  original.title,
		  original.author,
		  original.publisher,
		  original.publicationYear,
		  [...original.highlights],
		  [...original.soloNotes]
		);
	}

	integrateNotesInHighlights(): void {
		this.soloNotes.map((note) => {
			const highlight = this.highlights.find((highlight) => 
                highlight.location.start <= note.location.start && highlight.location.end >= note.location.start
			);

			if (highlight) {
				highlight.note = note
			} else {
				this.highlights.push(new Highlight(
					"",
					note.timestamp,
					note.location,
					note.page,
					note
				));
			}
		});

		this.soloNotes = [];
	}

	updateHighlitIds(): void {
        this.highlights.forEach((highlight) => {highlight.updateIds(this.title)})
		this.soloNotes.forEach((highlight) => {highlight.updateIds(this.title)})
    }

	identifyBook(): string {
		return `${this.title}-${this.author}`;
	}
}
