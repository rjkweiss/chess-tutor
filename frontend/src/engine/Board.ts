import type { Piece, Square, Color, PieceType } from "./types";

import { Rook } from "./pieces/Rook";
import { Bishop } from "./pieces/Bishop";
import { Queen } from "./pieces/Queen";
import { King } from "./pieces/King";
import { Knight } from "./pieces/Knight";
import { Pawn } from "./pieces/Pawn";

export class Board {
    private squares: Map<Square, Piece>;
    private lastMove: { from: Square; to: Square; piece: Piece } | null = null;

    constructor(initialize: boolean = true) {
        this.squares = new Map();
        if (initialize) {
            this.initializeBoard();
        }
    }

    private initializeBoard(): void {
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

    isSquareUnderAttack(square: Square, byColor: Color): boolean {
        for (const [pieceSquare, piece] of this.squares.entries()) {
            if (piece.color === byColor) {
                // get legal moves for this piece
                const legalMoves = this.getPieceLegalMoves(pieceSquare);

                //  check if piece can attack the target square
                if (legalMoves.includes(square)) return true;
            }
        }

        return false;
    }

    private getPieceLegalMoves(square: Square): Square[] {
        const piece = this.getPieceAt(square);
        if (!piece) return [];

        // instantiate appropriate class
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
                return pieceInstance.getAttackSquares(this);
            case 'knight':
                pieceInstance = new Knight(piece.color, square);
                break;
            case 'pawn':
                pieceInstance = new Pawn(piece.color, square);
                break;
            default:
                return [];
        }

        return pieceInstance.getLegalMoves(this);
    }

    /**
     * Find all pieces of a given color that are attacking a specific square
     */
    private getAttackersOfSquare(square: Square, attackingColor: Color): Square[] {
        const attackers: Square[] = []

        for (const [pieceSquare, piece] of this.squares.entries()) {
            if (piece.color === attackingColor) {
                const legalMoves = this.getPieceLegalMoves(pieceSquare);
                if (legalMoves.includes(square)) {
                    attackers.push(pieceSquare);
                }
            }
        }

        return attackers;
    }

    /**
     * Test if a move is legal (doesn't leave own king in check)
     */
    isMoveLegal(from: Square, to: Square, color: Color): boolean {
        // save current state
        const movingPiece = this.getPieceAt(from);
        const capturedPiece = this.getPieceAt(to);

        if (!movingPiece) return false;

        // make temporary move
        this.squares.delete(from);
        this.squares.set(to, {...movingPiece, position: to});

        // is king stil in check after this move?
        const stillInCheck = this.isKingInCheck(color);

        // restore
        this.squares.set(from, movingPiece);
        if (capturedPiece) {
            this.squares.set(to, capturedPiece);
        } else {
            this.squares.delete(to);
        }

        return !stillInCheck
    }

    /**
     * Get all squares between two positions (for sliding pieces)
     * Returns empty array if pieces are not on same line or not a sliding attack
     */
    private getSquaresBetween(from: Square, to: Square): Square[] {
        const fromFile = from.charCodeAt(0) - 'a'.charCodeAt(0);
        const fromRank = parseInt(from[1]) - 1;

        const toFile = to.charCodeAt(0) - 'a'.charCodeAt(0);
        const toRank = parseInt(to[1]) - 1;

        const fileDiff = toFile - fromFile;
        const rankDiff = toRank - fromRank;

        // Not on same line (not horizontal, vertical or diagonal)
        if (fileDiff !== 0 && rankDiff !== 0 && Math.abs(fileDiff) !== Math.abs(rankDiff)) {
            return [];
        }

        // determine direction
        const fileDir = fileDiff === 0 ? 0 : fileDiff > 0 ? 1 : -1;
        const rankDir = rankDiff === 0 ? 0 : rankDiff > 0 ? 1 : -1;

        const between: Square[] = [];
        let file = fromFile + fileDir;
        let rank = fromRank + rankDir;

        // Collect all squares between (not including from and to)
        while (file !== toFile || rank !== toRank) {
            const fileChar = String.fromCharCode('a'.charCodeAt(0) + file);
            const rankChar = (rank + 1).toString();
            between.push(`${fileChar}${rankChar}` as Square);

            file += fileDir;
            rank += rankDir;
        }

        return between;
    }

    /**
     * Check if any piece can block or capture to get out of check
     */
    private canBlockOrCaptureCheck(color: Color): boolean {
        const kingSquare = this.findKing(color);

        if (!kingSquare) return false;

        const opponentColor = color === 'white' ? 'black' : 'white';
        const attackers = this.getAttackersOfSquare(kingSquare, opponentColor);

        // if more than one attacker, can only escape -- can't block or capture
        if (attackers.length > 1) return false;

        // get first attacker
        const attackerSquare = attackers[0];

        // get squares between attacker and king
        const blockableSquares = this.getSquaresBetween(attackerSquare, kingSquare);

        // for each friendly piece (except king) -- check if we can block or capture attacking pieces
        for (const [square, piece] of this.squares.entries()) {
            if (piece.color === color && piece.type !== 'king') {
                const moves = this.getPieceLegalMoves(square);

                for (const targetSquare of moves) {
                    // can we capture attacker
                    if (targetSquare === attackerSquare) {
                        // is this capture legal?
                        if (this.isMoveLegal(square, targetSquare, color)) return true;
                    }

                    // can we block attacker? (only works for sliding pieces)
                    if (blockableSquares.includes(targetSquare)) {
                        if (this.isMoveLegal(square, targetSquare, color)) return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Check if a king of a specified color is in check
     */
    isKingInCheck(color: Color): boolean {
        const kingSquare = this.findKing(color);

        if (!kingSquare) return false;

        // check if king's square is under attack
        const opponentColor = color === 'white' ? 'black' : 'white';
        return this.isSquareUnderAttack(kingSquare, opponentColor);
    }

    private findKing(color: Color): Square | null {
        for (const [square, piece] of this.squares.entries()) {
            if (piece.type === "king" && piece.color === color) {
                return square;
            }
        }
        return null;
    }

    /**
     * Get all legal moves for the King(squares it can safely move to)
     */
    private getKingEscapeSquares(color: Color): Square[] {
        const kingSquare = this.findKing(color);
        if (!kingSquare) return [];

        const king = this.getPieceAt(kingSquare);
        if (!king) return [];

        // Get King's pseudo legal moves (adjacent squares)
        const kingInstance = new King(king.color, kingSquare);
        const potentialMoves = kingInstance.getLegalMoves(this, false);


        // filter to only safe squares
        const opponentColor = color === 'white' ? 'black' : 'white';
        const safeMoves: Square[] = [];

        for (const targetSquare of potentialMoves) {
            // Temporarily move the king to test if square is safe
            const originalPiece = this.getPieceAt(kingSquare);
            const capturedPiece = this.getPieceAt(targetSquare);

            // make temporary move
            this.squares.delete(kingSquare)
            this.squares.set(targetSquare, { ...originalPiece!, position: targetSquare });

            // Is king safe here?
            const isSafe = !this.isSquareUnderAttack(targetSquare, opponentColor);

            // undo move
            this.squares.set(kingSquare, originalPiece!);
            if (capturedPiece) {
                this.squares.set(targetSquare, capturedPiece)
            } else {
                this.squares.delete(targetSquare);
            }

            if (isSafe) {
                safeMoves.push(targetSquare);
            }
        }

        return safeMoves;
    }

    /**
     * Check if a King is in checkmate
     */
    isCheckmate(color: Color): boolean {
        // King must be in check first
        if (!this.isKingInCheck(color)) return false;

        // can the King escape?
        const kingEscapes = this.getKingEscapeSquares(color);
        if (kingEscapes.length > 0) return false;

        // can any piece block or capture the attacker?
        if (this.canBlockOrCaptureCheck(color)) return false;

        return true;
    }

    /**
     * Check if a King is in checkmate
     */
    isStalemate(color: Color): boolean {
        // must not be in check
        if (this.isKingInCheck(color)) return false;

        //king has no legal moves
        const kingEscapes = this.getKingEscapeSquares(color);
        if (kingEscapes.length > 0) return false;

        // check if any other pieces has truly legal moves
        for (const [square, piece] of this.squares.entries()) {
            if (piece.color === color && piece.type !== 'king') {
                const pseudoLegalMoves = this.getPieceLegalMoves(square);

                // check if every move can truly be legal
                for (const targetSquare of pseudoLegalMoves) {
                    if (this.isMoveLegal(square, targetSquare, color)) return false;
                }
            }
        }

        return true;
    }

    movePiece(from: Square, to: Square): void {
        const piece = this.getPieceAt(from);

        if (!piece) return;

        // store the last move fro en passant detection
        this.lastMove = {
            from,
            to,
            piece: { ...piece }
        };

        // update piece position and hasMove flag
        const updatedPiece: Piece = {
            ...piece,
            position: to,
            hasMoved: true
        }

        // remove from old square
        this.squares.delete(from);

        // place on new square
        this.squares.set(to, updatedPiece);
    }

    getLastMove() {
        return this.lastMove;
    }
}
