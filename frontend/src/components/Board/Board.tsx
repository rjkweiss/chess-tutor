import { useState } from "react";
import { Board as ChessBoard } from "../../engine/Board";
import { Square as SquareComponent } from "../Square/Square";
import type { Square as SquareType } from "../../engine/types";
import './Board.css';

export const Board = () => {
    // initialize chess engine
    const [board] = useState(() => new ChessBoard());
    const [selectedSquare, setSelectedSquare] = useState<SquareType | null>(null);
    const [legalMoves, setLegalMoves] = useState<SquareType[]>([]);

    // generate all 64 squares
    const squares: SquareType[] = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']; // top - bottom

    for (const rank of ranks) {
        for (const file of files) {
            squares.push(`${file}${rank}` as SquareType);
        }
    }

    const handleSquareClick = (square: SquareType) => {
        const piece = board.getPieceAt(square);

        // If no piece selected yet, select this piece
        if (!selectedSquare) {
            if (piece) {
                setSelectedSquare(square);

                // TODO: Get legal moves for this piece
                setLegalMoves([]);
            }
        } else {
            // piece already selected
            // TODO: Try to move to this square
            console.log(`Move from ${selectedSquare} to ${square}`);

            // deselect
            setSelectedSquare(null);
            setLegalMoves([]);
        }
    };

    return (
        <div className="board-container">
            <div className="chess-board">
                {squares.map((square) => {
                    const piece = board.getPieceAt(square);
                    const isSelected = square === selectedSquare;
                    const isLegalMove = legalMoves.includes(square);

                    return (
                        <SquareComponent
                            key={square}
                            square={square}
                            piece={piece}
                            isSelected={isSelected}
                            isLegalMove={isLegalMove}
                            onClick={() => handleSquareClick(square)}
                        />
                    );
                })}
            </div>
        </div>
    );
};
