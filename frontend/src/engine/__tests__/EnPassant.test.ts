import { describe, expect, test } from "vitest";
import { Board } from "../Board";
import { Pawn } from "../pieces/Pawn";

describe('En Passant', () => {
    test('white pawn can capture en passant after black pawn moves 2 squares', () => {
        const board = new Board(false);

        // white pawn on e5
        board.placePiece('e5', 'pawn', 'white');

        // black pawn starts on d7, moves to d5 (2 squares)
        board.placePiece('d7', 'pawn', 'black');
        board.movePiece('d7', 'd5');

        const whitePawn = new Pawn('white', 'e5');
        const legalMoves = whitePawn.getLegalMoves(board);

        // can capture en passant (move to d6)
        expect(legalMoves).toContain('d6');

        // check if it's an en passant mov e
        expect(whitePawn.isEnPassantMove('d6', board)).toBe(true);
    });

    test('black pawn can capture en passant after white pawn moves 2 squares', () => {
        const board = new Board(false);

        // black pawn on e4
        board.placePiece('e4', 'pawn', 'black');

        // white pawn moves from d2 to d4 (2 squares)
        board.placePiece('d2', 'pawn', 'white');
        board.movePiece('d2', 'd4');

        const blackPawn = new Pawn('black', 'e4');
        const legalMoves = blackPawn.getLegalMoves(board);

        // can capture en passant (move to d3)
        expect(legalMoves).toContain('d3');
        expect(blackPawn.isEnPassantMove('d3', board)).toBe(true);
    });

    test('cannot capture en passant if enemy pawn only moved 1 square', () => {
        const board = new Board(false);

        board.placePiece('e5', 'pawn', 'white');

        // black pawn moves only 1 square (from d6 to d5)
        board.placePiece('d6', 'pawn', 'black');
        board.movePiece('d6', 'd5');

        const whitePawn = new Pawn('white', 'e5');
        const legalMoves = whitePawn.getLegalMoves(board);

        // cannot capture en passant
        expect(legalMoves).not.toContain('d6');
        expect(whitePawn.isEnPassantMove('d6', board)).toBe(false);
    });

    test('cannot capture en passant if not the immediate next move', () => {
        const board = new Board(false);

        board.placePiece('e5', 'pawn', 'white');
        board.placePiece('d7', 'pawn', 'black');

        // black pawn moves 2 squares
        board.movePiece('d7', 'd5');

        // But then another move happens simulated
        board.placePiece('a1', 'rook', 'white');
        board.movePiece('a1', 'a2'); // en passant opportunity lost

        const whitePawn = new Pawn('white', 'e5');
        const legalMoves = whitePawn.getLegalMoves(board);

        // En Passant opportunity
        expect(legalMoves).not.toContain('d6');
    });

    test('en passant works on both sides of pawn', () => {
        let board = new Board(false);

        // white pawn on e5
        board.placePiece('e5', 'pawn', 'white');

        // black pawn on left side moves 2 square
        board.placePiece('d7', 'pawn', 'black');
        board.movePiece('d7', 'd5');

        let whitePawn = new Pawn('white', 'e5');
        let legalMoves = whitePawn.getLegalMoves(board);
        expect(legalMoves).toContain('d6'); // can capture left

        // reset and try right side
        board = new Board(false);
        board.placePiece('e5', 'pawn', 'white');
        board.placePiece('f7', 'pawn', 'black');
        board.movePiece('f7', 'f5');

        whitePawn = new Pawn('white', 'e5');
        legalMoves = whitePawn.getLegalMoves(board);
        expect(legalMoves).toContain('f6');
    });
});
