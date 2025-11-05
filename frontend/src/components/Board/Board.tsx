import { useState } from "react";
import { Board as ChessBoard } from "../../engine/Board";
import { Rook } from "../../engine/pieces/Rook";
import { Bishop } from "../../engine/pieces/Bishop";
import { Queen } from "../../engine/pieces/Queen";
import { King } from "../../engine/pieces/King";
import { Knight } from "../../engine/pieces/Knight";
import { Pawn } from "../../engine/pieces/Pawn";
import { Square as SquareComponent } from "../Square/Square";
import type { Square as SquareType, Color } from "../../engine/types";
import './Board.css';

export const Board = () => {
    // initialize chess engine
    const [board, setBoard] = useState(() => new ChessBoard());
    const [moveCount, setMoveCount] = useState(0); // Track moves for re-render
    const [currentTurn, setCurrentTurn] = useState<Color>('white');
    const [selectedSquare, setSelectedSquare] = useState<SquareType | null>(null);
    const [legalMoves, setLegalMoves] = useState<SquareType[]>([]);
    const [gameStatus, setGameStatus] = useState<'active' | 'checkMate' | 'stalemate'>('active');
    const [winner, setWinner] = useState<Color | null>(null);

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
        // don't allow move is game is over
        if (gameStatus !== 'active') return;

        const piece = board.getPieceAt(square);

        // If no piece selected yet, select this piece
        if (!selectedSquare) {
            if (piece && piece.color === currentTurn) {
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

                // switch turns
                const nextTurn = currentTurn === 'white' ? 'black' : 'white';
                setCurrentTurn(nextTurn);

                // check for game-over condition
                if (board.isCheckmate(nextTurn)) {
                    setGameStatus('checkMate');
                    setWinner(currentTurn);
                } else if (board.isStalemate(nextTurn)) {
                    setGameStatus('stalemate');
                }

                // deselect
                setSelectedSquare(null);
                setLegalMoves([]);
            } else if (piece && piece.color === currentTurn) {
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

    const handleReset = () => {
        // create new board
        const newBoard = new ChessBoard();
        setBoard(newBoard);
        setMoveCount(0);
        setCurrentTurn('white');
        setSelectedSquare(null);
        setLegalMoves([]);
        setGameStatus('active');
        setWinner(null);
    };

    // check if either king is in check
    const isWhiteInCheck = board.isKingInCheck('white');
    const isBlackInCheck = board.isKingInCheck('black');

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
            <div className="game-info">
                {gameStatus === 'active' && (
                    <div className="turn-indicator">
                        <span className={`turn-text ${currentTurn == 'white' ? 'active' : ''}`}>
                            White
                        </span>
                        <span className="turn-divider">|</span>
                        <span className={`turn-text ${currentTurn === 'black' ? 'active' : ''}`}>
                            Black
                        </span>
                    </div>
                )}

                {gameStatus === 'checkMate' && (
                    <div className="game-over checkmate">
                        Checkmate! {winner === 'white' ? 'White' : 'Black'} Wins!
                    </div>
                )}

                {gameStatus === 'stalemate' && (
                    <div className="game-over stalemate">
                        Stalemate! Game is a Draw!
                    </div>
                )}

                {gameStatus === 'active' && isWhiteInCheck && currentTurn === 'white' && (
                    <div className="check-warning">White King in Check!</div>
                )}

                {gameStatus === 'active' && isBlackInCheck && currentTurn === 'black' && (
                    <div className="check-warning">Black King in Check!</div>
                )}

                {gameStatus !== 'active' && (
                    <button className="reset-button" onClick={handleReset}>
                        New Game
                    </button>
                )}
            </div>

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
