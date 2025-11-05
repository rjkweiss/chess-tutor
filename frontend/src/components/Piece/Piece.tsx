import type { Piece as PieceType } from "../../engine/types";
import './Piece.css';

interface PieceProps {
    piece: PieceType;
}

const PIECE_IMAGES = {
    white: {
        king: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
        queen: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
        rook: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
        bishop: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
        knight: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
        pawn: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
    },
    black: {
        king: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
        queen: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
        rook: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
        bishop: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
        knight: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
        pawn: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
    },
};



export const Piece = ({ piece }: PieceProps) => {
    const imageUrl = PIECE_IMAGES[piece.color][piece.type];

    return (
        <img
            src={imageUrl}
            alt={`${piece.color} ${piece.type}`}
            className="piece-image"
            draggable={false}
        />
    );
};
