import type { Color, Square } from "../types";
import { Piece } from "./Piece";

export class Queen extends Piece {
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
}
