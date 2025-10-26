import { describe, test, expect } from "vitest";
import { Board } from '../Board';

describe('Board', () => {
    test('Initializes with correct starting position', () => {
        const board = new Board();

        // Test White pieces
        const whiteKing = board.getPieceAt('e1');
        expect(whiteKing).not.toBeNull();
        expect(whiteKing?.type).toBe('king');
        expect(whiteKing?.color).toBe('white');

        const whiteQueen = board.getPieceAt('d1');
        expect(whiteQueen).not.toBeNull();
        expect(whiteQueen?.type).toBe('queen');
        expect(whiteQueen?.color).toBe('white');

        // Test Black pieces
        const blackKing = board.getPieceAt('e8');
        expect(blackKing).not.toBeNull();
        expect(blackKing?.type).toBe('king');
        expect(blackKing?.color).toBe('black');

        const blackQueen = board.getPieceAt('d8');
        expect(blackQueen).not.toBeNull();
        expect(blackQueen?.type).toBe('queen');
        expect(blackQueen?.color).toBe('black');

        // Test Empty Squares
        const emptySquare = board.getPieceAt('e4');
        expect(emptySquare).toBeNull();
    });
});
