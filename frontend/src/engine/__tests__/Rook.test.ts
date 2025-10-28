
import { describe, test, expect } from "vitest";
import { Rook } from '../pieces/Rook'
import { Board } from "../Board";

describe('Rook', () => {
    describe('getLegalMove', () => {
        test('can move horizontally on empty board', () => {
            const board = new Board(false);

            const rook = new Rook('white', 'd4');
            const legalMoves = rook.getLegalMoves(board);

            // Rook on d4 should be able to move to a4, b4, c4, e4, f4, g4, h4
            expect(legalMoves).toContain('a4');
            expect(legalMoves).toContain('b4');
            expect(legalMoves).toContain('c4');
            expect(legalMoves).toContain('e4');
            expect(legalMoves).toContain('f4');
            expect(legalMoves).toContain('g4');
            expect(legalMoves).toContain('h4');

            // should NOT move diagonally
            expect(legalMoves).not.toContain('e5');
            expect(legalMoves).not.toContain('c3');
        });

        test('can move vertically on empty board', () => {
            const board = new Board(false);

            const rook = new Rook('white', 'd4');
            const legalMoves = rook.getLegalMoves(board);

            // should move vertically d1, d2, d3, d5, d6, d7, d8
            expect(legalMoves).toContain('d1');
            expect(legalMoves).toContain('d2');
            expect(legalMoves).toContain('d3');
            expect(legalMoves).toContain('d5');
            expect(legalMoves).toContain('d6');
            expect(legalMoves).toContain('d7');
            expect(legalMoves).toContain('d8');

            // should have 14 total moves (7 horizontal + 7 vertical)
            expect(legalMoves).toHaveLength(14);

        });

        test('cannot jump over friendly pieces', () => {
            const board = new Board(false);

            // place white rook on d4
            const rook = new Rook('white', 'd4');

            // place friendly pieces that block rook
            board.placePiece('d6', 'pawn', 'white');
            board.placePiece('d2', 'pawn', 'white');
            board.placePiece('f4', 'pawn', 'white');
            board.placePiece('b4', 'pawn', 'white');

            const legalMoves = rook.getLegalMoves(board);

            // can move up to d5 (stopped by d6)
            expect(legalMoves).toContain('d5');
            expect(legalMoves).not.toContain('d6');
            expect(legalMoves).not.toContain('d7');

            // Can move down to d3 (stopped by d2)
            expect(legalMoves).toContain('d3');
            expect(legalMoves).not.toContain('d2');
            expect(legalMoves).not.toContain('d1');

            // can move right to e4 (stopped by f4)
            expect(legalMoves).contain('e4');
            expect(legalMoves).not.toContain('f4');
            expect(legalMoves).not.toContain('g4');

            // can move left to c4 (stopped by b4)
            expect(legalMoves).contain('c4');
            expect(legalMoves).not.toContain('b4');
            expect(legalMoves).not.toContain('a4');

            // should have exactly 4 moves
            expect(legalMoves).toHaveLength(4);
        });

        test('can capture enemy pieces but not jump over them', () => {
            const board = new Board(false);

            // place white rook on d4
            const rook = new Rook('white', 'd4');

            // place enemy black pieces
            board.placePiece('d6', 'pawn', 'black');
            board.placePiece('d2', 'pawn', 'black');
            board.placePiece('f4', 'pawn', 'black');
            board.placePiece('b4', 'pawn', 'black');

            const legalMoves = rook.getLegalMoves(board);

            // CAN capture enemy pieces
            expect(legalMoves).toContain('d6');
            expect(legalMoves).toContain('d2');
            expect(legalMoves).toContain('f4');
            expect(legalMoves).toContain('b4');

            // But CANNOT go beyond them
            expect(legalMoves).not.toContain('d7');
            expect(legalMoves).not.toContain('d1');
            expect(legalMoves).not.toContain('g4');
            expect(legalMoves).not.toContain('a4');

            // should have 8 moves (d5, d6, d3, d2, e4, f4, c4, b4)
            expect(legalMoves).toHaveLength(8);
        });

    });
});
