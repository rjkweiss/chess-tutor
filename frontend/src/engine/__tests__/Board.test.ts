import { describe, test, expect } from "vitest";
import { Board } from '../Board';

describe('Board', () => {
    describe('Initialization', () => {

        test('sets up all white pieces', () => {
            const board = new Board();

            const whiteKing = board.getPieceAt('e1');
            expect(whiteKing).not.toBeNull();
            expect(whiteKing?.type).toBe('king');
            expect(whiteKing?.color).toBe('white');

            const whiteQueen = board.getPieceAt('d1');
            expect(whiteQueen).not.toBeNull();
            expect(whiteQueen?.type).toBe('queen');
            expect(whiteQueen?.color).toBe('white');

            const whiteBishopLeft = board.getPieceAt('c1');
            expect(whiteBishopLeft).not.toBeNull();
            expect(whiteBishopLeft?.type).toBe('bishop');
            expect(whiteBishopLeft?.color).toBe('white');

            const whiteBishopRight = board.getPieceAt('f1');
            expect(whiteBishopRight).not.toBeNull();
            expect(whiteBishopRight?.type).toBe('bishop');
            expect(whiteBishopRight?.color).toBe('white');

            const whiteKnightLeft = board.getPieceAt('b1');
            expect(whiteKnightLeft).not.toBeNull();
            expect(whiteKnightLeft?.type).toBe('knight');
            expect(whiteKnightLeft?.color).toBe('white');

            const whiteKnightRight = board.getPieceAt('g1');
            expect(whiteKnightRight).not.toBeNull();
            expect(whiteKnightRight?.type).toBe('knight');
            expect(whiteKnightRight?.color).toBe('white');

            const whiteRookLeft = board.getPieceAt('a1');
            expect(whiteRookLeft).not.toBeNull();
            expect(whiteRookLeft?.type).toBe('rook');
            expect(whiteRookLeft?.color).toBe('white');

            const whiteRookRight = board.getPieceAt('h1');
            expect(whiteRookRight).not.toBeNull();
            expect(whiteRookRight?.type).toBe('rook');
            expect(whiteRookRight?.color).toBe('white');
        });

        test('sets up all black pieces', () => {
            const board = new Board();

            const blackKing = board.getPieceAt('e8');
            expect(blackKing).not.toBeNull();
            expect(blackKing?.type).toBe('king');
            expect(blackKing?.color).toBe('black');

            const blackQueen = board.getPieceAt('d8');
            expect(blackQueen).not.toBeNull();
            expect(blackQueen?.type).toBe('queen');
            expect(blackQueen?.color).toBe('black');

            const blackBishopLeft = board.getPieceAt('f8');
            expect(blackBishopLeft).not.toBeNull();
            expect(blackBishopLeft?.type).toBe('bishop');
            expect(blackBishopLeft?.color).toBe('black');

            const blackBishopRight = board.getPieceAt('c8');
            expect(blackBishopRight).not.toBeNull();
            expect(blackBishopRight?.type).toBe('bishop');
            expect(blackBishopRight?.color).toBe('black');

            const blackKnightLeft = board.getPieceAt('g8');
            expect(blackKnightLeft).not.toBeNull();
            expect(blackKnightLeft?.type).toBe('knight');
            expect(blackKnightLeft?.color).toBe('black');

            const blackKnightRight = board.getPieceAt('b8');
            expect(blackKnightRight).not.toBeNull();
            expect(blackKnightRight?.type).toBe('knight');
            expect(blackKnightRight?.color).toBe('black');

            const blackRookLeft = board.getPieceAt('h8');
            expect(blackRookLeft).not.toBeNull();
            expect(blackRookLeft?.type).toBe('rook');
            expect(blackRookLeft?.color).toBe('black');

            const blackRookRight = board.getPieceAt('a8');
            expect(blackRookRight).not.toBeNull();
            expect(blackRookRight?.type).toBe('rook');
            expect(blackRookRight?.color).toBe('black');
        });

        test('sets up pawns on correct ranks', () => {
            const board = new Board();

            const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];

            // set up white pawns
            for (const col of cols) {
                const square = `${col}2`;
                const pawn = board.getPieceAt(square);
                expect(pawn).not.toBeNull();
                expect(pawn?.type).toBe('pawn');
                expect(pawn?.color).toBe('white');
                expect(pawn?.position).toBe(square);
            }

            // set up black pawns
            for (const col of cols) {
                const square = `${col}7`;
                const pawn = board.getPieceAt(square);
                expect(pawn).not.toBeNull();
                expect(pawn?.type).toBe('pawn');
                expect(pawn?.color).toBe('black');
                expect(pawn?.position).toBe(square);
            }
        });

        test('leaves center squares empty', () => {
            const board = new Board();
            const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];
            const emptyRanks = [3, 4, 5, 6];

            for (const col of cols) {
                for (const rank of emptyRanks) {
                    const square = `${col}${rank}`;
                    const piece = board.getPieceAt(square);
                    expect(piece).toBeNull();
                }
            }
        });
    });

});
