import { describe, expect, test } from "vitest";
import { Board } from "../Board";
import { King } from "../pieces/King";


describe('Castling', () => {
    test('white king can castle kingside when conditions are met', () => {
        const board = new Board(false);

        // place king and rook in starting positions
        board.placePiece('e1', 'king', 'white');
        board.placePiece('h1', 'rook', 'white');

        const king = new King('white', 'e1');
        const legalMoves = king.getLegalMoves(board);

        expect(legalMoves).toContain('g1');
    });

    test('white king can castle queenside when conditions are met', () => {
        const board = new Board(false);

        board.placePiece('e1', 'king', 'white');
        board.placePiece('a1', 'rook', 'white');

        const king = new King('white', 'e1');
        const legalMoves = king.getLegalMoves(board);

        expect(legalMoves).toContain('c1');
    });

    test('black king can castle kingside when conditions are met', () => {
        const board = new Board(false);

        board.placePiece('e8', 'king', 'black');
        board.placePiece('h8', 'rook', 'black');

        const king = new King('black', 'e8');
        const legalMoves = king.getLegalMoves(board);

        expect(legalMoves).toContain('g8');
    });

    test('cannot castle if king has moved', () => {
        const board = new Board(false);

        board.placePiece('e1', 'king', 'white');
        board.placePiece('h1', 'rook', 'white');

        // simulate king having moved
        board.movePiece('e1', 'e2');
        board.movePiece('e2', 'e1'); // moved back but hasMoved = True

        const king = new King('white', 'e1');
        const legalMoves = king.getLegalMoves(board);

        // cannot castle
        expect(legalMoves).not.toContain('g1');
        expect(legalMoves).not.toContain('c1');
    });

    test('cannot castle if rook has moved', () => {
        const board = new Board(false);

        board.placePiece('e1', 'king', 'white');
        board.placePiece('h1', 'rook', 'white');

        // simulate king having moved
        board.movePiece('h1', 'h2');
        board.movePiece('h2', 'h1'); // moved back but hasMoved = True

        const king = new King('white', 'e1');
        const legalMoves = king.getLegalMoves(board);

        // cannot castle
        expect(legalMoves).not.toContain('g1');
    });

    test('cannot castle if pieces are between king and rook', () => {
        const board = new Board(false);

        board.placePiece('e1', 'king', 'white');
        board.placePiece('h1', 'rook', 'white');
        board.placePiece('f1', 'bishop', 'white'); // blocking

        const king = new King('white', 'e1');
        const legalMoves = king.getLegalMoves(board);

        expect(legalMoves).not.toContain('g1');
    });

    test('cannot castle if king is in check', () => {
        const board = new Board(false);

        board.placePiece('e1', 'king', 'white');
        board.placePiece('h1', 'rook', 'white');
        board.placePiece('e8', 'rook', 'black'); // puts king in check

        const king = new King('white', 'e1');
        const legalMoves = king.getLegalMoves(board);

        expect(legalMoves).not.toContain('g1');
    });

    test('cannot castle if king moves through check', () => {
        const board = new Board(false);

        board.placePiece('e1', 'king', 'white');
        board.placePiece('h1', 'rook', 'white');
        board.placePiece('f8', 'rook', 'black'); // attacks f1 (king passed through)

        const king = new King('white', 'e1');
        const legalMoves = king.getLegalMoves(board);

        expect(legalMoves).not.toContain('g1');
    });

    test('cannot castle if king ends in check', () => {
        const board = new Board(false);

        board.placePiece('e1', 'king', 'white');
        board.placePiece('h1', 'rook', 'white');
        board.placePiece('g8', 'rook', 'black'); // attacking g1

        const king = new King('white', 'e1');
        const legalMoves = king.getLegalMoves(board);

        expect(legalMoves).not.toContain('g1');
    });

    test('can detect castling move', () => {
        const king = new King('white', 'e1');

        expect(king.isCastlingMove('g1')).toBe(true); // Kingside
        expect(king.isCastlingMove('c1')).toBe(true); // Queenside
        expect(king.isCastlingMove('f1')).toBe(false); // Normal move
        expect(king.isCastlingMove('d1')).toBe(false); // Normal move
    });
});
