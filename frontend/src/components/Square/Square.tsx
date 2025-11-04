import type { Square as SquareType, Piece as PieceType } from "../../engine/types";
import { Piece } from "../Piece/Piece";
import './Square.css';


interface SquareProps {
    square: SquareType;
    piece: PieceType | null;
    isSelected: boolean;
    isLegalMove: boolean;
    onClick: () => void;
}

export const Square = ({ square, piece, isSelected, isLegalMove, onClick }: SquareProps) => {
    // determine square color (white or black)
    const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = parseInt(square[1]) - 1;
    const isLight = (file + rank) % 2 === 0;

    const squareClass = `
        square ${isLight ? 'light': 'dark'}
        ${isSelected ? 'selected': ''} ${isLegalMove ? 'legal-move': ''}
    `;


    return (
        <div className={squareClass} onClick={onClick}>
            {piece && <Piece piece={piece} />}
            {isLegalMove && <div className="legal-move-indicator" />}
        </div>
    );
};
