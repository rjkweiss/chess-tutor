import type { Piece, Square, Color, PieceType } from "./types";

export class Board {
    private squares: Map<Square, Piece>;

    constructor(initialize: boolean = true) {
        this.squares = new Map();
        if (initialize) {
            this.initializeBoard();
        }
    }

    private initializeBoard():void {
        // white pieces back ranks
        this.setupBackRank('white', '1');
        this.setUpPawns('white', '2');

        // set up black pieces
        this.setupBackRank('black', '8');
        this.setUpPawns('black', '7');
    }

    private setupBackRank(color: Color, rank: string): void {
        // Rooks in the corner
        this.setPiece(`a${rank}`, 'rook', color);
        this.setPiece(`h${rank}`, 'rook', color);

        // knights next to rooks
        this.setPiece(`b${rank}`, 'knight', color);
        this.setPiece(`g${rank}`, 'knight', color);

        // bishops next to bishops
        this.setPiece(`c${rank}`, 'bishop', color);
        this.setPiece(`f${rank}`, 'bishop', color);

        // set queen & king
        this.setPiece(`d${rank}`, 'queen', color);
        this.setPiece(`e${rank}`, 'king', color);
    }

    private setUpPawns(color: Color, rank: string): void {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

        for (const file of files) {
            this.setPiece(`${file}${rank}`, 'pawn', color);
        }
    }

    private setPiece(position: Square, type: PieceType, color: Color): void {
        this.squares.set(position, {
            type,
            color,
            position,
            hasMoved: false
        });
    }

    placePiece(square: Square, type: PieceType, color: Color): void {
        this.setPiece(square, type, color);
    }

    getPieceAt(square: Square): Piece | null {
        return this.squares.get(square) ?? null;
    }
}
