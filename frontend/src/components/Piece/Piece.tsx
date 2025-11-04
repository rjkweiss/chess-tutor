import type { Piece as PieceType } from "../../engine/types";
import './Piece.css';

interface PieceProps {
    piece: PieceType;
}

// Unicode chess symbols
const PIECE_SYMBOLS = {
    white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙',
    },
    black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟',
    },
};

export const Piece = ({ piece }: PieceProps) => {
    const symbol = PIECE_SYMBOLS[piece.color][piece.type];

    return (
        <div className={`piece ${piece.color}`}>
            {symbol}
        </div>
    );
};
