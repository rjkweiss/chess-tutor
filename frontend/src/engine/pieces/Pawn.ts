import type { Board } from "../Board";
import type { Color, Square } from "../types";
import { fileToIndex, rankToIndex, isValidSquare, toSquare } from "../utils";

export class Pawn {
    constructor(
        public color: Color,
        public position: Square
    ) {}

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
            }
        }

        return moves;
    }
}
