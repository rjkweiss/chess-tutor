export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type Color = 'white' | 'black';
export type Square = string;

export interface Piece {
    type: PieceType;
    color: Color;
    position: Square;
    hasMoved: boolean;
}
