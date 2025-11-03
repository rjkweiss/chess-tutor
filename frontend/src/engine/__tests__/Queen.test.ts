import { describe, expect, test } from "vitest";
import { Queen } from "../pieces/Queen";
import { Board } from "../Board";


describe('Queen', () => {
    describe('getLegalMoves', () => {
        test('can move horizontally on empty board', () => {
            const board = new Board(false);

            // place white queen on 'd4'
            const queen = new Queen('white', 'd4');
            const legalMoves = queen.getLegalMoves(board);

            expect(legalMoves).toContain('a4');
            expect(legalMoves).toContain('b4');
            expect(legalMoves).toContain('c4');
            expect(legalMoves).toContain('e4');
            expect(legalMoves).toContain('f4');
            expect(legalMoves).toContain('g4');
            expect(legalMoves).toContain('h4');
        });

        test('can move vertically on empty board', () => {
            const board = new Board(false);

            // place white queen on 'd4'
            const queen = new Queen('white', 'd4');
            const legalMoves = queen.getLegalMoves(board);

            expect(legalMoves).toContain('d8');
            expect(legalMoves).toContain('d7');
            expect(legalMoves).toContain('d6');
            expect(legalMoves).toContain('d5');
            expect(legalMoves).toContain('d3');
            expect(legalMoves).toContain('d2');
            expect(legalMoves).toContain('d1');
        });

        test('can move on main diagonal on empty board', () => {
            const board = new Board(false);

            // place white queen on 'd4'
            const queen = new Queen('white', 'd4');
            const legalMoves = queen.getLegalMoves(board);

            expect(legalMoves).toContain('a7');
            expect(legalMoves).toContain('b6');
            expect(legalMoves).toContain('c5');
            expect(legalMoves).toContain('e3');
            expect(legalMoves).toContain('f2');
            expect(legalMoves).toContain('g1');
        });

        test('can move on secondary diagonal on empty board', () => {
            const board = new Board(false);

            // place white queen on 'd4'
            const queen = new Queen('white', 'd4');
            const legalMoves = queen.getLegalMoves(board);

            expect(legalMoves).toContain('h8');
            expect(legalMoves).toContain('g7');
            expect(legalMoves).toContain('f6');
            expect(legalMoves).toContain('e5');
            expect(legalMoves).toContain('c3');
            expect(legalMoves).toContain('b2');
            expect(legalMoves).toContain('a1');

            // length should be 7 horizontal + 7 vertical + 6 main diag + 7 secondary diagonal
            expect(legalMoves).toHaveLength(27);
        });

        test('cannot jump over friendly pieces', () => {
            const board = new Board(false);

            // place white queen on 'd4'
            const queen = new Queen('white', 'd4');

            // place friendly pieces
            // blocks horizontal
            board.placePiece('b4', 'pawn', 'white');
            board.placePiece('f4', 'pawn', 'white');
            // blocks vertical
            board.placePiece('d6', 'pawn', 'white');
            board.placePiece('d2', 'pawn', 'white');
            // blocks main diagonal
            board.placePiece('b6', 'pawn', 'white');
            board.placePiece('f2', 'pawn', 'white');
            // blocks secondary diagonal
            board.placePiece('f6', 'pawn', 'white');
            board.placePiece('b2', 'pawn', 'white');

            // get legal moves
            const legalMoves = queen.getLegalMoves(board);

            // horizontal
            expect(legalMoves).toContain('c4');
            expect(legalMoves).not.toContain('b4');
            expect(legalMoves).not.toContain('a4');

            expect(legalMoves).toContain('e4');
            expect(legalMoves).not.toContain('f4');
            expect(legalMoves).not.toContain('g4');
            expect(legalMoves).not.toContain('h4');

            // vertical
            expect(legalMoves).toContain('d5');
            expect(legalMoves).not.toContain('d6');
            expect(legalMoves).not.toContain('d7');
            expect(legalMoves).not.toContain('d8');

            expect(legalMoves).toContain('d3');
            expect(legalMoves).not.toContain('d2');
            expect(legalMoves).not.toContain('d1');

            // main diagonal
            expect(legalMoves).toContain('c5');
            expect(legalMoves).not.toContain('b6');
            expect(legalMoves).not.toContain('a7');

            expect(legalMoves).toContain('e3');
            expect(legalMoves).not.toContain('f2');
            expect(legalMoves).not.toContain('g1');


            // secondary diagonal
            expect(legalMoves).toContain('e5');
            expect(legalMoves).not.toContain('f6');
            expect(legalMoves).not.toContain('g7');
            expect(legalMoves).not.toContain('h8');

            expect(legalMoves).toContain('c3');
            expect(legalMoves).not.toContain('b2');
            expect(legalMoves).not.toContain('a1');

            // legal moves should have only 8 items
            expect(legalMoves).toHaveLength(8);

        });

        test('can capture enemy pieces', () => {
            const board = new Board(false);

            // place white queen on 'd4'
            const queen = new Queen('white', 'd4');

            // enemy on horizontal
            board.placePiece('b4', 'pawn', 'black');
            board.placePiece('f4', 'pawn', 'black');
            // enemy on vertical
            board.placePiece('d6', 'pawn', 'black');
            board.placePiece('d2', 'pawn', 'black');
            // enemy on main diagonal
            board.placePiece('b6', 'pawn', 'black');
            board.placePiece('f2', 'pawn', 'black');
            // enemy on secondary diagonal
            board.placePiece('f6', 'pawn', 'black');
            board.placePiece('b2', 'pawn', 'black');

            // get legal moves
            const legalMoves = queen.getLegalMoves(board);

            // horizontal
            expect(legalMoves).toContain('c4');
            expect(legalMoves).toContain('b4');
            expect(legalMoves).not.toContain('a4');

            expect(legalMoves).toContain('e4');
            expect(legalMoves).toContain('f4');
            expect(legalMoves).not.toContain('g4');
            expect(legalMoves).not.toContain('h4');

            // vertical
            expect(legalMoves).toContain('d5');
            expect(legalMoves).toContain('d6');
            expect(legalMoves).not.toContain('d7');
            expect(legalMoves).not.toContain('d8');

            expect(legalMoves).toContain('d3');
            expect(legalMoves).toContain('d2');
            expect(legalMoves).not.toContain('d1');

            // main diagonal
            expect(legalMoves).toContain('c5');
            expect(legalMoves).toContain('b6');
            expect(legalMoves).not.toContain('a7');

            expect(legalMoves).toContain('e3');
            expect(legalMoves).toContain('f2');
            expect(legalMoves).not.toContain('g1');

            // secondary diagonal
            expect(legalMoves).toContain('e5');
            expect(legalMoves).toContain('f6');
            expect(legalMoves).not.toContain('g7');
            expect(legalMoves).not.toContain('h8');

            expect(legalMoves).toContain('c3');
            expect(legalMoves).toContain('b2');
            expect(legalMoves).not.toContain('a1');

            // legal moves should have -- 16 moves
            expect(legalMoves).toHaveLength(16);

        });
    });
});
