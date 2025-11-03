import type { Board } from "../Board";
import type { Color, Square } from "../types";
import { fileToIndex, rankToIndex, isValidSquare, toSquare } from "../utils";
import { Piece } from "./Piece";

export class King extends Piece {
    constructor(color: Color, position: Square) {
        super(color, position);
    }

    protected getDirections(): [number, number][] {
        return [
            [-1, 0],   // up
            [1, 0],   // down
            [0, 1],  // right
            [0, -1], // left
            [-1, -1], // up-left
            [1, 1],  // down-right
            [-1, 1], // up-right
            [1, -1] // down-left
        ];
    }

    protected canSlide(): boolean {
        return false;
    }

    /**
     * override getLegalMoves to include castling
     */
    getLegalMoves(board: Board, includeCastling: boolean = true): Square[] {
        // get normal moves from base class
        const baseMoves = super.getLegalMoves(board);


        // add castling moves if conditions are met
        if (includeCastling) {
            const castlingMoves = this.getCastlingMoves(board);
            return [...baseMoves, ...castlingMoves];
        }
        return baseMoves;
    }

    /**
     * Get squares this king attacks (for attack detection only)
     * Doesn't filter out attacked squares (prevents recursion)
     */
    getAttackSquares(board: Board): Square[] {
        // return super.getLegalMoves(board);
        const squares: Square[] = [];

        const currentFile = fileToIndex(this.position[0]);
        const currentRank = rankToIndex(this.position[1]);

        const directions = [
            [-1, 0], [1, 0], [0, 1], [0, -1],
            [-1, -1], [1, 1], [-1, 1], [1, -1]
        ];

        for (const [fileDir, rankDir] of directions) {
            const file = currentFile + fileDir;
            const rank = currentRank + rankDir;

            if (isValidSquare(file, rank)) {
                const targetSquare =  toSquare(file, rank);
                const pieceAtTarget = board.getPieceAt(targetSquare);

                if (!pieceAtTarget || pieceAtTarget.color !== this.color) {
                    squares.push(targetSquare);
                }
            }
        }

        return squares;
    }

    /**
     * Get available castling moves
     */
    private getCastlingMoves(board: Board): Square[] {
        const moves: Square[] = [];

        // can't castle if king has moved
        const kingPiece = board.getPieceAt(this.position);
        if (!kingPiece || kingPiece.hasMoved) return moves;

        // can't castle if in check
        if (board.isKingInCheck(this.color)) return moves;

        const currentFile = fileToIndex(this.position[0]);
        const currentRank = rankToIndex(this.position[1]);
        const opponentColor = this.color === 'white' ? 'black' : 'white';

        // kingside castling (0 - 0)
        const kingsideRookFile = 7
        const kingsideRookSquare = toSquare(kingsideRookFile, currentRank);
        const kingsideRook = board.getPieceAt(kingsideRookSquare);

        if (kingsideRook &&
            kingsideRook.type === 'rook' &&
            kingsideRook.color === this.color &&
            !kingsideRook.hasMoved) {

            // check squares between king and rook are empty
            const squareBetween = [
                toSquare(currentFile + 1, currentRank),
                toSquare(currentFile + 2, currentRank)
            ];

            const pathClear = squareBetween.every(sq => !board.getPieceAt(sq));

            if (pathClear) {
                // check king doesn't move through check
                const squaresToCheck = [
                    this.position,
                    squareBetween[0],
                    squareBetween[1]
                ];

                const noCheckOnPath = squaresToCheck.every(sq =>
                    !board.isSquareUnderAttack(sq, opponentColor)
                );

                if (noCheckOnPath) {
                    moves.push(squareBetween[1]);
                }
            }
        }

        // queen side castling 0-0-0
        const queensideRookFile = 0;
        const queensideRookSquare = toSquare(queensideRookFile, currentRank);
        const queensideRook = board.getPieceAt(queensideRookSquare);

        if (queensideRook &&
            queensideRook.type == 'rook' &&
            queensideRook.color === this.color &&
            !queensideRook.hasMoved) {

            // squares between king and rook (b, c, d files)
            const squaresBetween = [
                toSquare(currentFile - 1, currentRank),
                toSquare(currentFile - 2, currentRank),
                toSquare(currentFile - 3, currentRank)
            ];

            const pathClear = squaresBetween.every(sq => !board.getPieceAt(sq));

            if (pathClear) {
                // king only checks e, d, c
                const squaresToCheck = [
                    this.position,
                    squaresBetween[0],
                    squaresBetween[1]
                ];

                const noCheckOnPath = squaresToCheck.every(sq =>
                    !board.isSquareUnderAttack(sq, opponentColor)
                );

                if (noCheckOnPath) {
                    moves.push(squaresBetween[1]);
                }
            }
        }

        return moves;
    }

    /**
     * check if a move is a castling move
     */
    isCastlingMove(targetSquare: Square): boolean {
        const currentFile = fileToIndex(this.position[0]);
        const targetFile = fileToIndex(targetSquare[0]);
        const fileDistance = Math.abs(targetFile - currentFile);

        return fileDistance === 2;
    }
}
