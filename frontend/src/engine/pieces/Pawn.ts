import type { Board } from "../Board";
import type { Color, Square } from "../types";
import { fileToIndex, rankToIndex, isValidSquare, toSquare } from "../utils";

export class Pawn {
    constructor(
        public color: Color,
        public position: Square
    ) {}

    isPromotionMove(targetSquare: Square): boolean {
        const targetRank = rankToIndex(targetSquare[1]);
        const promotionRank = this.color === 'white' ? 7 : 0;
        return targetRank === promotionRank;
    }

    /**
     * Check if a move is an en passant capture
     */

    isEnPassantMove(targetSquare: Square, board: Board): boolean {
        const lastMove = board.getLastMove()
        if (!lastMove) return false;

        // last move must have been a pawn
        if (lastMove.piece.type !== 'pawn') return false;

        // last move must have been opponent's pawn
        if (lastMove.piece.color === this.color) return false;

        // pawn must have moved 2 squares
        const fromRank = rankToIndex(lastMove.from[1])
        const toRank = rankToIndex(lastMove.to[1]);

        const rankDiff = Math.abs(toRank - fromRank);

        if (rankDiff !== 2) return false;

        // Enemy pawn must be beside our pawn (same rank)
        const currentFile = fileToIndex(this.position[0]);
        const currentRank = rankToIndex(this.position[1]);

        const enemyFile = fileToIndex(lastMove.to[0]);
        const enemyRank = rankToIndex(lastMove.to[1]);

        const isSameRank = currentRank === enemyRank;
        const isAdjacentFile = Math.abs(currentFile - enemyFile) === 1;

        if (!isSameRank || !isAdjacentFile) return false;

        // Target square must be the square the enemy pawn skipped over
        const direction = this.color === 'white' ? 1 : -1
        const enPassantSquare = toSquare(enemyFile, currentRank + direction);

        return targetSquare === enPassantSquare;
    }

    getLegalMoves(board: Board): Square[] {
        const moves: Square[] = [];

        // parse current position
        const currentFile = fileToIndex(this.position[0]);
        const currentRank = rankToIndex(this.position[1]);

        // direction depends on color
        const direction = this.color === 'white' ? 1 : -1;

        // check if pawn is on starting rank
        const startingRank = this.color === 'white' ? 1 : 6;
        const isFirstMove = currentRank === startingRank;

        // forward movement
        const forwardFile = currentFile;
        const forwardRank = currentRank + direction;

        if (isValidSquare(forwardFile, forwardRank)) {
            const forwardSquare = toSquare(forwardFile, forwardRank);
            const pieceAhead = board.getPieceAt(forwardSquare);

            // can move to empty square
            if (!pieceAhead) {
                moves.push(forwardSquare);

                // move 2 squares on first move
                if (isFirstMove) {
                    const doubleForwardRank = currentRank + (direction * 2);

                    if (isValidSquare(forwardFile, doubleForwardRank)) {
                        const doubleForwardSquare = toSquare(forwardFile, doubleForwardRank);
                        const pieceTwoAhead = board.getPieceAt(doubleForwardSquare);

                        if (!pieceTwoAhead) {
                            moves.push(doubleForwardSquare);
                        }
                    }
                }
            }
        }

        // can capture diagonally
        const captureOffsets = [-1, 1]

        for (const fileOffset of captureOffsets) {
            const captureFile = currentFile + fileOffset;
            const captureRank = currentRank + direction;

            if (isValidSquare(captureFile, captureRank)) {
                const captureSquare = toSquare(captureFile, captureRank);
                const pieceAtCapture = board.getPieceAt(captureSquare);

                // it can capture if there is an enemy piece
                if (pieceAtCapture && pieceAtCapture.color != this.color) {
                    moves.push(captureSquare);
                }

                // En Passant Capture
                else if (!pieceAtCapture && this.isEnPassantMove(captureSquare, board)) {
                    moves.push(captureSquare);
                }
            }
        }

        return moves;
    }
}
