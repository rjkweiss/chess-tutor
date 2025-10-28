import type { Color, Square } from "../types";
import { Board } from "../Board";
import { fileToIndex, rankToIndex, isValidSquare, toSquare } from "../utils";

export class Rook {
    constructor(
        public color: Color,
        public position: Square
    ){}

    getLegalMoves(board: Board): Square[] {
        const moves: Square[] = [];

        // Parse current position
        const currentFile = fileToIndex(this.position[0]); // 'd'
        const currentRank = rankToIndex(this.position[1]); // '4'

        // define four directions
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        // check each direction
        for (const [fileDir, rankDir] of directions) {
            let file = currentFile + fileDir;
            let rank = currentRank + rankDir;

            // keep moving until we reach board edge
            while (isValidSquare(file, rank)) {
                const targetSquare = toSquare(file, rank);
                const pieceAtTarget = board.getPieceAt(targetSquare);

                // handle blocking by friendly pieces
                if (pieceAtTarget) {
                    if (pieceAtTarget.color === this.color) {
                        // blocked by friendly piece
                        break;
                    } else {
                        // enemy piece -- can capture but can't go beyond
                        moves.push(targetSquare);
                        break;
                    }
                } else {
                    // empty square -- can move here
                    moves.push(targetSquare);
                }

                // move to next square in this direction
                file += fileDir;
                rank += rankDir;
            }
        }

        return moves;
    }
}
