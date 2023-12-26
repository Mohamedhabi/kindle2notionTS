export interface Highlight {
    content: string;
    location?: { start: number; end: number | null };
    page?: { start: number; end: number | null };
    timestamp: string;
    notes: Highlight[] | null;
}