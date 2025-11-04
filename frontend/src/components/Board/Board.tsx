import { useState } from "react";
import { Board as ChessBoard } from "../../engine/Board";
import { Rook } from "../../engine/pieces/Rook";
import { Bishop } from "../../engine/pieces/Bishop";
import { Queen } from "../../engine/pieces/Queen";
import { King } from "../../engine/pieces/King";
import { Knight } from "../../engine/pieces/Knight";
import { Pawn } from "../../engine/pieces/Pawn";
import { Square as SquareComponent } from "../Square/Square";
import type { Square as SquareType } from "../../engine/types";
import './Board.css';

export const Board = () => {
    // initialize chess engine
    const [board, setBoard] = useState(() => new ChessBoard());
    const [moveCount, setMoveCount] = useState(0); // Track moves for re-render
    const [selectedSquare, setSelectedSquare] = useState<SquareType | null>(null);
    const [legalMoves, setLegalMoves] = useState<SquareType[]>([]);

    // helper to get legal moves for a piece
    const getLegalMovesForPiece = (square: SquareType): SquareType[] => {
        const piece = board.getPieceAt(square);
        if (!piece) return [];

        // instantiate the piece to get its legal moves
        let pieceInstance;

        switch (piece.type) {
            case 'rook':
                pieceInstance = new Rook(piece.color, square);
                break;
            case 'bishop':
                pieceInstance = new Bishop(piece.color, square);
                break;
            case 'queen':
                pieceInstance = new Queen(piece.color, square);
                break;
            case 'king':
                pieceInstance = new King(piece.color, square);
                break;
            case 'knight':
                pieceInstance = new Knight(piece.color, square);
                break;
            case 'pawn':
                pieceInstance = new Pawn(piece.color, square);
                break;
            default:
                return [];
        }

        return pieceInstance.getLegalMoves(board);
    };

    const handleSquareClick = (square: SquareType) => {
        const piece = board.getPieceAt(square);

        // If no piece selected yet, select this piece
        if (!selectedSquare) {
            if (piece) {
                setSelectedSquare(square);
                const moves = getLegalMovesForPiece(square);
                setLegalMoves(moves);
            }
        } else {
            // piece already selected
            if (legalMoves.includes(square)) {
                // make a move
                board.movePiece(selectedSquare, square);

                // Force re-render by creating new board reference
                setMoveCount(moveCount + 1);

                // deselect
                setSelectedSquare(null);
                setLegalMoves([]);
            } else if (piece && piece.color === board.getPieceAt(selectedSquare)?.color) {
                // clicked on another piece of same color - switch selection
                setSelectedSquare(square);
                const moves = getLegalMovesForPiece(square);
                setLegalMoves(moves);
            } else {
                // clicked on invalid square - deselect
                setSelectedSquare(null);
                setLegalMoves([]);
            }
        }
    };

    // generate all 64 squares
    const squares: SquareType[] = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']; // top - bottom

    for (const rank of ranks) {
        for (const file of files) {
            squares.push(`${file}${rank}` as SquareType);
        }
    }

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
