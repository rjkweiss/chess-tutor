import { describe, expect, test } from "vitest";
import { Knight } from "../pieces/Knight";
import { Board } from "../Board";

describe('Knight', () => {
    describe('getLegalMoves', () => {
        test('can move in L shape on empty board', () => {
            const board = new Board(false);

            const knight = new Knight('white', 'd4');
            const legalMoves = knight.getLegalMoves(board);

            // All 8 L-shaped moves

            // left1
            expect(legalMoves).toContain('c6');
            expect(legalMoves).toContain('c2');

            // left 2
            expect(legalMoves).toContain('b5');
            expect(legalMoves).toContain('b3');

            // right 1
            expect(legalMoves).toContain('e6');
            expect(legalMoves).toContain('e2');

            // right 2
            expect(legalMoves).toContain('f5');
            expect(legalMoves).toContain('f3');

            // should have exactly 8 items
            expect(legalMoves).toHaveLength(8);

            // should NOT move like other pieces
            expect(legalMoves).not.toContain('d5'); // king
            expect(legalMoves).not.toContain('c5'); // bishop
            expect(legalMoves).not.toContain('e4'); // horizontal
        });

        test('can jump over pieces', () => {
            const board = new Board(false);

            const knight = new Knight('white', 'd4');

            // Completely surround knight with pieces
            board.placePiece('d5', 'pawn', 'white'); // Above
            board.placePiece('e5', 'pawn', 'white'); // Diagonal
            board.placePiece('e4', 'pawn', 'white'); // Right
            board.placePiece('e3', 'pawn', 'white'); // Diagonal
            board.placePiece('d3', 'pawn', 'white'); // Below
            board.placePiece('c3', 'pawn', 'white'); // Diagonal
            board.placePiece('c4', 'pawn', 'white'); // Left
            board.placePiece('c5', 'pawn', 'white'); // Diagonal

            const legalMoves = knight.getLegalMoves(board);

            // Knight can still jump to all L-shaped squares!
            expect(legalMoves).toContain('c6');
            expect(legalMoves).toContain('e6');
            expect(legalMoves).toContain('f5');
            expect(legalMoves).toContain('f3');
            expect(legalMoves).toContain('e2');
            expect(legalMoves).toContain('c2');
            expect(legalMoves).toContain('b3');
            expect(legalMoves).toContain('b5');

            // All 8 moves still available despite being surrounded!
            expect(legalMoves).toHaveLength(8);
        });

        test('cannot move to squares with friendly squares', () => {
            const board = new Board(false);

            const knight = new Knight('white', 'd4');

            // Place friendly pieces on some L-shaped targets
            board.placePiece('c6', 'pawn', 'white');
            board.placePiece('e6', 'pawn', 'white');
            board.placePiece('f5', 'pawn', 'white');

            const legalMoves = knight.getLegalMoves(board);

            // Cannot move to friendly pieces
            expect(legalMoves).not.toContain('c6');
            expect(legalMoves).not.toContain('e6');
            expect(legalMoves).not.toContain('f5');

            // Can still move to other L-shaped squares
            expect(legalMoves).toContain('f3');
            expect(legalMoves).toContain('e2');
            expect(legalMoves).toContain('c2');
            expect(legalMoves).toContain('b3');
            expect(legalMoves).toContain('b5');

            // Should have 5 moves (8 - 3 blocked)
            expect(legalMoves).toHaveLength(5);
        });

        test('can capture enemy pieces', () => {
            const board = new Board(false);

            const knight = new Knight('white', 'd4');

            // Place enemy pieces on some L-shaped targets
            board.placePiece('c6', 'pawn', 'black');
            board.placePiece('e6', 'pawn', 'black');
            board.placePiece('f5', 'queen', 'black'); // High value target!

            const legalMoves = knight.getLegalMoves(board);

            // Can capture enemy pieces
            expect(legalMoves).toContain('c6');
            expect(legalMoves).toContain('e6');
            expect(legalMoves).toContain('f5');

            // Can still move to empty squares
            expect(legalMoves).toContain('f3');
            expect(legalMoves).toContain('e2');
            expect(legalMoves).toContain('c2');
            expect(legalMoves).toContain('b3');
            expect(legalMoves).toContain('b5');

            // Should have all 8 moves
            expect(legalMoves).toHaveLength(8);
        });
    });
});
