export interface Highlight {
    chapter: string;
    location: number;
    highlight: string;
    note?: string;
}

export interface BookHighlights {
    book: string;
    author: string;
    highlights: Highlight[];
}