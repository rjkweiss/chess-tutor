import { describe, expect, test } from "vitest";
import { Board } from "../Board";

describe('Check detection', () => {
    test('when white king is in check from rook', () => {
        const board = new Board(false);

        // place white king and black rook on same file
        board.placePiece('e4', 'king', 'white');
        board.placePiece('e8', 'rook', 'black');

        // white king should be in check
        expect(board.isKingInCheck('white')).toBe(true);

        // black king should not be in check
        expect(board.isKingInCheck('black')).toBe(false);
    });

    test('when king is in check from bishop', () => {
        const board = new Board(false);

        // place white king, then black bishop on its diagonal
        board.placePiece('e4', 'king', 'white');
        board.placePiece('h7', 'bishop', 'black');

        expect(board.isKingInCheck('white')).toBe(true);
    });

    test('detects when king is in check from queen', () => {
        const board = new Board(false);

        // place white king, black queen on the same file
        board.placePiece('e4', 'king', 'white');
        board.placePiece('e1', 'queen', 'black');

        expect(board.isKingInCheck('white')).toBe(true);
    });

    test('detects when king is in check from knight', () => {
        const board = new Board(false);

        // place white king, and attacking black knight
        board.placePiece('e4', 'king', 'white');
        board.placePiece('d6', 'knight', 'black');

        expect(board.isKingInCheck('white')).toBe(true);
    });

    test('detects when king is in check from pawn', () => {
        const board = new Board(false);

        board.placePiece('e4', 'king', 'white');
        board.placePiece('d5', 'pawn', 'black');

        expect(board.isKingInCheck('white')).toBe(true);
    });

    test('king is not in check when no threats', () => {
        const board = new Board(false);

        board.placePiece('e4', 'king', 'white');
        board.placePiece('d6', 'rook', 'black'); // Not attacking
        board.placePiece('c3', 'bishop', 'black'); // not attacking

        expect(board.isKingInCheck('white')).toBe(false);
    });

    test('king is not in check when piece is blocked', () => {
        const board = new Board(false);

        board.placePiece('e4', 'king', 'white');
        board.placePiece('e8', 'rook', 'black');
        board.placePiece('e6', 'pawn', 'white'); // Blocking the rook

        // Rook is blocked, so king is safe
        expect(board.isKingInCheck('white')).toBe(false);
    });

    test('detects check in starting position after moves', () => {
        const board = new Board(); // Full starting position

        // Initially, no king is in check
        expect(board.isKingInCheck('white')).toBe(false);
        expect(board.isKingInCheck('black')).toBe(false);
    });

    test('can detect square under attack', () => {
        const board = new Board(false);

        board.placePiece('e1', 'rook', 'black');

        // Rook attacks entire e-file and 1st rank
        expect(board.isSquareUnderAttack('e4', 'black')).toBe(true);
        expect(board.isSquareUnderAttack('a1', 'black')).toBe(true);

        // Other squares not under attack
        expect(board.isSquareUnderAttack('d2', 'black')).toBe(false);
    });
});
