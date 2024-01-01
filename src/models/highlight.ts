import crypto from 'crypto';

export class Highlight {
	content: string;
	timestamp: string;
	location: { start: number; end: number | null } | null;
	page: { start: number; end: number | null } | null;
	notes: Highlight[] | null;
	id: string | null;
	notesIds: string[] | null;
  
	constructor(
		content: string,
		timestamp: string,
		location: { start: number; end: number | null } | null = null,
		page: { start: number; end: number | null } | null = null,
		notes: Highlight[] | null = []
	) {
		this.content = content;
		this.location = location;
		this.page = page;
		this.timestamp = timestamp;
		this.notes = notes;
		this.id = null;
		this.notesIds = [];
	}
	

	private calculateHash(content: string): string {
		return crypto.createHash('md5').update(content).digest('hex');
	}
  
    public updateIds(book_title: string): void {
      	this.id = this.calculateHash(book_title + this.content);
    	this.notesIds = this.notes.map((note) => {
				return this.calculateHash(note.content);
		})
    }
  }
  