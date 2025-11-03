import { describe, expect, test } from "vitest";
import { Board } from "../Board";
import { King } from "../pieces/King";

describe('King', () => {
    describe('getLegalMoves', () => {
        test('can move 1 square in all 8 directions on empty board', () => {
            // initialize empty board
            const board = new Board(false);

            // place white board on 'd4'
            const king = new King('white', 'd4');

            // get legal moves
            const legalMoves = king.getLegalMoves(board);

            // can only move one square
            expect(legalMoves).toContain('c4');
            expect(legalMoves).not.toContain('b4');

            expect(legalMoves).toContain('e4');
            expect(legalMoves).not.toContain('f4');

            expect(legalMoves).toContain('d5');
            expect(legalMoves).not.toContain('d6');

            expect(legalMoves).toContain('d3');
            expect(legalMoves).not.toContain('d2');

            expect(legalMoves).toContain('c5');
            expect(legalMoves).not.toContain('b6');

            expect(legalMoves).toContain('e3');
            expect(legalMoves).not.toContain('f2');

            expect(legalMoves).toContain('c3');
            expect(legalMoves).not.toContain('b2');

            expect(legalMoves).toContain('e5');
            expect(legalMoves).not.toContain('f6');



            expect(legalMoves).toHaveLength(8);
        });

        test('cannot jump over friendly pieces', () => {
            // initialize empty board
            const board = new Board(false);

            // place white board on 'd4'
            const king = new King('white', 'd4');

            // place friendly pieces
            board.placePiece('d5', 'pawn', 'white');
            board.placePiece('e4', 'pawn', 'white');
            board.placePiece('c3', 'pawn', 'white');

            const legalMoves = king.getLegalMoves(board);

            // check that we do not have the blocked spaces
            expect(legalMoves).not.toContain('d5');
            expect(legalMoves).not.toContain('e4');
            expect(legalMoves).not.toContain('c3');

            // check that it contains the other ones
            expect(legalMoves).toContain('c5');
            expect(legalMoves).toContain('c4');
            expect(legalMoves).toContain('d3');
            expect(legalMoves).toContain('e3');
            expect(legalMoves).toContain('e5');

            // only 5 legal moves since 3 are blocked
            expect(legalMoves).toHaveLength(5);
        });

        test('can capture enemy pieces', () => {
            // initialize empty board
            const board = new Board(false);

            // place white board on 'd4'
            const king = new King('white', 'd4');

            // place friendly pieces
            board.placePiece('d5', 'pawn', 'black');
            board.placePiece('e4', 'pawn', 'black');
            board.placePiece('c3', 'pawn', 'black');

            const legalMoves = king.getLegalMoves(board);

            expect(legalMoves).toContain('c4');
            expect(legalMoves).toContain('e4');
            expect(legalMoves).toContain('d5');
            expect(legalMoves).toContain('d3');
            expect(legalMoves).toContain('c5');
            expect(legalMoves).toContain('e3');
            expect(legalMoves).toContain('e5');
            expect(legalMoves).toContain('c3');

            // legal moves 8 -- we can capture enemy pieces
            expect(legalMoves).toHaveLength(8);
        });
    });

});
