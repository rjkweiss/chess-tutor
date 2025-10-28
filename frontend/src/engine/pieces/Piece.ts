import type { Color, Square } from "../types";
import type { Board } from "../Board";
import { fileToIndex, isValidSquare, rankToIndex, toSquare } from "../utils";

export abstract class Piece {
    constructor(
        public color: Color,
        public position: Square
    ){}

    // Each piece defines its own directions
    protected abstract getDirections():[number, number][];

    // shared method for getting legal moves
    getLegalMoves(board: Board): Square[] {
        const moves: Square[] = [];
        const currentFile = fileToIndex(this.position[0]);
        const currentRank = rankToIndex(this.position[1]);
        const directions = this.getDirections();

        for (const [fileDir, rankDir] of directions) {
            let file = currentFile + fileDir
            let rank = currentRank + rankDir

            while (isValidSquare(file, rank)) {
                const targetSquare = toSquare(file, rank);
                const pieceAtTarget = board.getPieceAt(targetSquare);

                if (pieceAtTarget) {
                    // blocking by friendly piece
                    if (pieceAtTarget.color === this.color) {
                        break;
                    } else {
                        // can capture piece but can't move beyond square
                        moves.push(targetSquare);
                        break;
                    }
                } else {
                    // empty square, piece can move here
                    moves.push(targetSquare);
                }

                file += fileDir;
                rank += rankDir;
            }
        }

        return moves;
    }
}
