import type { Square } from "./types";

/**
 * Convert file letter to number (a = 0, b=1, ..., h=7)
 */
export function fileToIndex(file: string): number {
    return file.charCodeAt(0) - 'a'.charCodeAt(0);
}

/**
 * Convert number to file letter (0=a, 1=b, ..., 7=h)
 */
export function indexToFile(index: number): string {
    return String.fromCharCode('a'.charCodeAt(0) + index);
}

/**
 * Convert rank to number (1=0, 2=1, ..., 8=7)
 */
export function rankToIndex(rank: string): number {
    return parseInt(rank) - 1;
}

/**
 * Convert number to rank (0=1, 1=2, ..., 7=8)
 */
export function indexToRank(index: number): string {
    return (index + 1).toString();
}

/**
 * Check if coordinates are within board bounds
 */
export function isValidSquare(file: number, rank: number): boolean {
    return file >= 0 && file <= 7 && rank >= 0&& rank <= 7;
}

/**
 * Create square notation from file and rank indices
 */
export function toSquare(fileIndex: number, rankIndex: number): Square {
    return indexToFile(fileIndex) + indexToRank(rankIndex);
}
