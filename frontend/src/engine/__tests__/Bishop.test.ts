import { describe, expect, test } from "vitest";
import { Bishop } from "../pieces/Bishop";
import { Board } from "../Board";

describe('Bishop', () => {
    describe('getLegalMoves', () => {
        test('can move on main diagonal on empty board', () => {
            const board = new Board(false);

            // place white bishop e4
            const bishop = new Bishop('white', 'e4');
            const legalMoves = bishop.getLegalMoves(board);

            // can move a8, b7, c6, d5, f3, g2, h1
            expect(legalMoves).toContain('a8');
            expect(legalMoves).toContain('b7');
            expect(legalMoves).toContain('c6');
            expect(legalMoves).toContain('d5');
            expect(legalMoves).toContain('f3');
            expect(legalMoves).toContain('g2');
            expect(legalMoves).toContain('h1');

            // should not move horizontally  or vertically
            expect(legalMoves).not.toContain('d4');
            expect(legalMoves).not.toContain('f4');
            expect(legalMoves).not.toContain('e5');
            expect(legalMoves).not.toContain('e3');

        });

        test('can move on secondary diagonal on empty board', () => {
            const board = new Board(false);

            // place white bishop e4
            const bishop = new Bishop('white', 'e4');
            const legalMoves = bishop.getLegalMoves(board);

            // can move h7,g6,f5,d3,c2,b1
            expect(legalMoves).toContain('h7');
            expect(legalMoves).toContain('g6');
            expect(legalMoves).toContain('f5');
            expect(legalMoves).toContain('d3');
            expect(legalMoves).toContain('c2');
            expect(legalMoves).toContain('b1');

            // legal moves should have 13 items (7 moves on main diagonal + 6 on secondary diagonal)
            expect(legalMoves).toHaveLength(13);
        });

        test('cannot jump over friendly pieces', () => {
            const board = new Board(false);

            // place white bishop e4
            const bishop = new Bishop('white', 'e4');

            // set up friendly pieces on diagonal
            board.placePiece('c6', 'pawn', 'white');
            board.placePiece('g2', 'pawn', 'white');
            board.placePiece('g6', 'pawn', 'white');
            board.placePiece('c2', 'pawn', 'white');

            // get legal moves
            const legalMoves = bishop.getLegalMoves(board);

            // can move up to d5 (stopped by c6)
            expect(legalMoves).toContain('d5');
            expect(legalMoves).not.toContain('c6');
            expect(legalMoves).not.toContain('b7');


            // can move up to f3 (stopped by g2)
            expect(legalMoves).toContain('f3');
            expect(legalMoves).not.toContain('g2');
            expect(legalMoves).not.toContain('h1');

            // can move up to f5 (blocked by g6)
            expect(legalMoves).toContain('f5');
            expect(legalMoves).not.toContain('g6');
            expect(legalMoves).not.toContain('h7');

            // can move up to d3 (blocked by c2)
            expect(legalMoves).toContain('d3');
            expect(legalMoves).not.toContain('c2');
            expect(legalMoves).not.toContain('b1');

            // legal moves should have only 4 moves, d5, f5, f3, d3
            expect(legalMoves).toHaveLength(4);
        });

        test('can capture enemy pieces', () => {
            const board = new Board(false);

            // place white bishop e4
            const bishop = new Bishop('white', 'e4');

            // set up friendly pieces on diagonal
            board.placePiece('c6', 'pawn', 'black');
            board.placePiece('g2', 'pawn', 'black');
            board.placePiece('g6', 'pawn', 'black');
            board.placePiece('c2', 'pawn', 'black');

            // get legal moves
            const legalMoves = bishop.getLegalMoves(board);

            expect(legalMoves).toContain('d5');
            expect(legalMoves).toContain('c6');
            expect(legalMoves).not.toContain('b7');
            expect(legalMoves).not.toContain('a8');

            expect(legalMoves).toContain('f3');
            expect(legalMoves).toContain('g2');
            expect(legalMoves).not.toContain('h1');

            expect(legalMoves).toContain('f5');
            expect(legalMoves).toContain('g6');
            expect(legalMoves).not.toContain('h7');

            expect(legalMoves).toContain('d3');
            expect(legalMoves).toContain('c2');
            expect(legalMoves).not.toContain('b1');

            expect(legalMoves).toHaveLength(8);
        });
    });
});
