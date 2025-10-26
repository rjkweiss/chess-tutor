import type { Piece, Square } from "./types";

export class Board {
    private squares: Map<Square, Piece>;

    constructor() {
        this.squares = new Map();
        this.initializeBoard();
    }

    private initializeBoard():void {
        // white pieces (king, queen)
        this.squares.set('e1', {
            type: 'king',
            color: 'white',
            position: 'e1',
            hasMoved: false
        });
        this.squares.set('d1', {
            type: 'queen',
            color: 'white',
            position: 'd1',
            hasMoved: false
        });

        // black pieces (king, queen)
        this.squares.set('e8', {
            type: 'king',
            color: 'black',
            position: 'e8',
            hasMoved: false
        });
        this.squares.set('d8', {
            type: 'queen',
            color: 'black',
            position: 'd8',
            hasMoved: false
        });
    }

    getPieceAt(square: Square): Piece | null {
        return this.squares.get(square) ?? null;
    }
}
