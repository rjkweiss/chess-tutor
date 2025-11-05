import { describe, expect, test } from "vitest";
import { Board } from "../Board";

describe('Checkmate Detection - Simple', () => {
    test('detects checkmate when king is trapped in corner', () => {
        const board = new Board(false);

        // simplest possible checkmate
        board.placePiece('h1', 'king', 'white');
        board.placePiece('g1', 'pawn', 'white');   // Blocks escape
        board.placePiece('g2', 'pawn', 'white');   // Blocks escape
        board.placePiece('h8', 'rook', 'black');   // Gives check on 1st rank

        // Verify setup
        expect(board.isKingInCheck('white')).toBe(true);

        // This should be checkmate
        expect(board.isCheckmate('white')).toBe(true);
    });

    test('NOT checkmate if king can escape', () => {
        const board = new Board(false);

        board.placePiece('e4', 'king', 'white');
        board.placePiece('e8', 'rook', 'black');   // Gives check but king can move

        expect(board.isKingInCheck('white')).toBe(true);
        expect(board.isCheckmate('white')).toBe(false);
    });

    test('detects two rook checkmate', () => {
        const board = new Board(false);

        // King on edge, trapped by two rooks
        board.placePiece('h8', 'king', 'black');
        board.placePiece('g7', 'rook', 'white');  // Controls 7th rank
        board.placePiece('g8', 'rook', 'white');  // Gives check on h-file

        expect(board.isKingInCheck('black')).toBe(true);
        expect(board.isCheckmate('black')).toBe(true);
    });
});

describe('Stalemate Detection - Simple', () => {
    test('detects stalemate when king has no moves but not in check', () => {
      const board = new Board(false);

      // King trapped in corner but NOT in check
      board.placePiece('a8', 'king', 'black');
      board.placePiece('b6', 'king', 'white');   // Controls a7, b7, b8
      board.placePiece('c7', 'queen', 'white');  // Controls b8 (but doesn't give check to a8)

      expect(board.isKingInCheck('black')).toBe(false);
      expect(board.isStalemate('black')).toBe(true);
    });

    test('NOT stalemate if king has legal moves', () => {
      const board = new Board(false);

      board.placePiece('e4', 'king', 'white');
      board.placePiece('e8', 'queen', 'black');

      expect(board.isStalemate('white')).toBe(false);
    });

    test('NOT stalemate if in check (would be checkmate)', () => {
      const board = new Board(false);

      board.placePiece('h1', 'king', 'white');
      board.placePiece('g1', 'pawn', 'white');
      board.placePiece('g2', 'pawn', 'white');
      board.placePiece('h8', 'rook', 'black');

      expect(board.isKingInCheck('white')).toBe(true);
      expect(board.isStalemate('white')).toBe(false);
    });
  });
