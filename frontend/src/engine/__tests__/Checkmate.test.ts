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

  test('NOT checkmate if another piece can capture the attacker', () => {
    const board = new Board(false);

    // Black king in check from white queen
    board.placePiece('h1', 'king', 'white');
    board.placePiece('g1', 'pawn', 'white');
    board.placePiece('g2', 'pawn', 'white');

    // Black rook gives check
    board.placePiece('h8', 'rook', 'black');

    // White bishop can capture the rook! (diagonal from f6 to h8)
    board.placePiece('f6', 'bishop', 'white');

    // King is in check
    expect(board.isKingInCheck('white')).toBe(true);

    // King cannot escape (no safe squares)
    // BUT rook can capture queen = NOT checkmate!
    expect(board.isCheckmate('white')).toBe(false);

  });

  test('NOT checkmate if another piece can block the attack', () => {
    const board = new Board(false);

    // White king in check from black rook
    board.placePiece('e1', 'king', 'white');
    board.placePiece('d1', 'pawn', 'white');
    board.placePiece('f1', 'pawn', 'white');
    board.placePiece('d2', 'pawn', 'white');
    board.placePiece('f2', 'pawn', 'white');

    // black rook is checking king on e-file
    board.placePiece('e8', 'rook', 'black');

    // White bishop can block on e4
    board.placePiece('c2', 'bishop', 'white');

    expect(board.isKingInCheck('white')).toBe(true);

    // Bishop can move to e4 and block = NOT checkmate!
    expect(board.isCheckmate('white')).toBe(false);
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
  test('detects stalemate when only piece is blocked (not pinned)', () => {
    const board = new Board(false);

    // White king trapped
    board.placePiece('a1', 'king', 'white');
    board.placePiece('a2', 'pawn', 'white');    // Blocked pawn

    // Black pieces control everything
    board.placePiece('a3', 'pawn', 'black');    // Blocks white pawn
    board.placePiece('c2', 'king', 'black');    // Controls b1, b2

    // Not in check
    expect(board.isKingInCheck('white')).toBe(false);

    // Pawn has NO pseudo-legal moves (blocked)
    // King has no legal moves
    // This IS stalemate!
    expect(board.isStalemate('white')).toBe(true);
  });
});
