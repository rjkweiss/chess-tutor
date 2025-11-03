import type { Color, Square } from "../types";
import { Board } from "../Board";
import { fileToIndex, isValidSquare, rankToIndex, toSquare } from "../utils";

export class Knight {
    constructor(
        public color: Color,
        public position: Square
    ){}

    getLegalMoves(board: Board): Square[] {
        const moves: Square[] = [];

        // parse current square
        const currentFile = fileToIndex(this.position[0]);
        const currentRank = rankToIndex(this.position[1]);

        const knightMoves: [number, number][] = [
            [2, 1],   // Right 2, down 1
            [2, -1],  // Right 2, up 1
            [-2, 1],  // Left 2, down 1
            [-2, -1], // Left 2, up 1
            [1, 2],   // Right 1, down 2
            [1, -2],  // Right 1, up 2
            [-1, 2],  // Left 1, down 2
            [-1, -2]  // Left 1, up 2
        ];

        for (const [fileOffset, rankOffset] of knightMoves) {
            const targetFile = currentFile + fileOffset;
            const targetRank = currentRank + rankOffset;

            // check if it's valid square
            if (isValidSquare(targetFile, targetRank)) {
                const targetSquare = toSquare(targetFile, targetRank);
                const pieceAtTarget = board.getPieceAt(targetSquare);

                // can move if target square is empty or enemy piece
                if (!pieceAtTarget || pieceAtTarget.color !== this.color) {
                    moves.push(targetSquare);
                }
            }
        }

        return moves;
    }
}
