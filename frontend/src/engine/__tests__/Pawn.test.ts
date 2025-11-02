import { describe, expect, test } from "vitest";
import { Pawn } from "../pieces/Pawn";
import { Board } from "../Board";

describe('Pawn', () => {
    describe('getLegalMove', () => {
        test('white moves forward 1 square (upwards)', () => {
            const board = new Board(false);

            const pawn = new Pawn('white', 'e4');
            const legalMoves = pawn.getLegalMoves(board);

             // Can move forward 1
            expect(legalMoves).toContain('e5'); // moved forward

            // Cannot move backward, sideways, or diagonally without capture
            expect(legalMoves).not.toContain('e3');
            expect(legalMoves).not.toContain('d4');
            expect(legalMoves).not.toContain('f4');
            expect(legalMoves).not.toContain('d5');
            expect(legalMoves).not.toContain('f5');

            // Should have only 1 move
            expect(legalMoves).toHaveLength(1);
        });

        test('black moves forward 1 square (downwards)', () => {
            const board = new Board(false);

            const pawn = new Pawn('black', 'e5');
            const legalMoves = pawn.getLegalMoves(board);

            // can move forward 1
            expect(legalMoves).toContain('e4');

            // cannot move backward, sideways, or diagonally without capture
            expect(legalMoves).not.toContain('e6');
            expect(legalMoves).not.toContain('d5');
            expect(legalMoves).not.toContain('f5');
            expect(legalMoves).not.toContain('d4');
            expect(legalMoves).not.toContain('f4');

            // should have only 1 move
            expect(legalMoves).toHaveLength(1);
        });

        test('can move 2 squares forward on first move', () => {
            const board = new Board(false);

            const whitePawn = new Pawn('white', 'e2');
            const whiteMoves = whitePawn.getLegalMoves(board);

            // can move 1 or 2 squares for first move
            expect(whiteMoves).toContain('e3');
            expect(whiteMoves).toContain('e4');
            expect(whiteMoves).toHaveLength(2);

            const blackPawn = new Pawn('black', 'e7');
            const blackMoves = blackPawn.getLegalMoves(board);

            // can also move 1 or 2 squares for first move
            expect(blackMoves).toContain('e6');
            expect(blackMoves).toContain('e5');
            expect(blackMoves).toHaveLength(2);


        });

        test('pawn blocked by piece in front', () => {
            const board = new Board(false);

            const pawn = new Pawn('white', 'e2');

            // block with friendly knight
            board.placePiece('e3', 'knight', 'white');

            const legalMoves = pawn.getLegalMoves(board);

            // piece blocked, cannot move
            expect(legalMoves).not.toContain('e3');
            expect(legalMoves).not.toContain('e4');
            expect(legalMoves).toHaveLength(0);
        });

        test('pawn blocked from moving 2 squares on first move', () => {
            const board = new Board(false);

            const pawn = new Pawn('white', 'e2');

            // block 2nd square only
            board.placePiece('e4', 'knight', 'white');

            const legalMoves = pawn.getLegalMoves(board);

            // should still move one step
            expect(legalMoves).toContain('e3');
            expect(legalMoves).not.toContain('e4');
            expect(legalMoves).toHaveLength(1);
        });

        test('captures diagonally', () => {
            const board = new Board(false);

            const pawn = new Pawn('white', 'e4');

            // place enemy pieces on diagonal
            board.placePiece('d5', 'pawn', 'black');
            board.placePiece('f5', 'pawn', 'black');

            const legalMoves = pawn.getLegalMoves(board);

            // can move forward
            expect(legalMoves).toContain('e5');

            // can capture diagonally
            expect(legalMoves).toContain('d5');
            expect(legalMoves).toContain('f5');

            // should have 3 items
            expect(legalMoves).toHaveLength(3);
        });

        test('cannot capture forward', () => {
            const board = new Board(false);

            const pawn = new Pawn('white', 'e4');

            // place enemy piece in front of it
            board.placePiece('e5', 'pawn', 'black');

            const legalMoves = pawn.getLegalMoves(board);

            // cannot move forward -- blocked
            expect(legalMoves).not.toContain('e5');

            // shouldn't have any legal moves
            expect(legalMoves).toHaveLength(0);
        });

        test('cannot captures friendly pieces diagonally', () => {
            const board = new Board(false);

            const pawn = new Pawn('white', 'e4');

            // place friendly pieces in the diagonals
            board.placePiece('d5', 'knight', 'white');
            board.placePiece('f5', 'knight', 'white');

            const legalMoves = pawn.getLegalMoves(board);

            // should be able to move forward
            expect(legalMoves).toContain('e5');

            // cannot capture friendly pieces
            expect(legalMoves).not.toContain('d5');
            expect(legalMoves).not.toContain('f5');

            // should only have 1 valid move
            expect(legalMoves).toHaveLength(1);
        });
    });
});
