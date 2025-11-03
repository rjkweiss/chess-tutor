
import type { Color, Square } from "../types";
import { Piece } from "./Piece";

export class Bishop extends Piece {
    constructor(color: Color, position: Square) {
        super(color, position);
    }

    protected getDirections(): [number, number][] {
        return [
            [-1, -1], // up-left
            [1, 1], // down-right
            [-1, 1], // up-right
            [1, -1] // down-left
        ];
    }

}
