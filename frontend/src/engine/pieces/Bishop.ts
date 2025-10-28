import type { Board } from "../Board";
import type { Color, Square } from "../types";
import { fileToIndex, rankToIndex, isValidSquare, toSquare } from "../utils";

export class Bishop {
    constructor(
        public color: Color,
        public position: Square
    ){}

    getLegalMoves(board: Board): Square[] {
        const moves: Square[] = [];

        // parse current position
        const currentFile = fileToIndex(this.position[0]);
        const currentRank = rankToIndex(this.position[1]);

        // directions that bishop can move
        const directions = [[-1, -1], [1, 1], [-1, 1], [1, -1]];

        for (const [fileDir, rankDir] of directions) {
            let file = currentFile + fileDir
            let rank = currentRank + rankDir

            while (isValidSquare(file, rank)) {
                const targetSquare = toSquare(file, rank);
                const pieceAtTarget = board.getPieceAt(targetSquare);

                // target square is occupied
                if (pieceAtTarget) {
                    // blocked by friendly pieces
                    if (pieceAtTarget.color === this.color) {
                        // blocked
                        break;
                    } else {
                        // can capture but not move past
                        moves.push(targetSquare);
                        break;
                    }
                } else {
                    // empty square, can move
                    moves.push(targetSquare);
                }

                file += fileDir
                rank += rankDir
            }

        }

        return moves;
    }
}
