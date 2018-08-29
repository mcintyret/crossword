export type ClueDirection = "across" | "down";

export interface Clue {
    direction: ClueDirection;
    number: number;
    question: string;
    answer: string;
    startX: number;
    startY: number;
}

export interface Crossword {
    clues: Clue[];
    size: number; // Assume square for now
}