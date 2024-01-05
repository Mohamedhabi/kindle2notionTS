import crypto from 'crypto';

export class Highlight {
	content: string;
	timestamp: string;
	location: { start: number; end: number | null } | null;
	page: { start: number; end: number | null } | null;
	note: Highlight | null;
	id: string | null;
	noteId: string | null;
  
	constructor(
		content: string,
		timestamp: string,
		location: { start: number; end: number | null } | null = null,
		page: { start: number; end: number | null } | null = null,
		note: Highlight | null = null
	) {
		this.content = content;
		this.location = location;
		this.page = page;
		this.timestamp = timestamp;
		this.note = note;
		this.id = null;
		this.noteId = null;
	}
	

	private calculateHash(content: string): string {
		return crypto.createHash('md5').update(content).digest('hex');
	}
  
    public updateIds(book_title: string): void {
      	this.id = this.calculateHash(book_title + this.location.start + this.content);
		if(this.note){
			this.noteId = this.calculateHash(book_title + this.location.start +this.note.content);
		}
    }
  }
  