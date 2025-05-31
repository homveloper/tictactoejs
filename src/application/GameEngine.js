import { GameBoard } from '../domain/GameBoard.js';
import { Position } from '../domain/Position.js';
import { Player, GameState } from '../domain/Player.js';

/**
 * GameEngine - Application Service
 * 틱택토 게임의 비즈니스 로직을 담당
 */
export class GameEngine {
    constructor() {
        this._gameBoard = new GameBoard();
        this._currentPlayer = Player.X;
        this._gameState = GameState.PLAYING;
    }

    /**
     * 움직임을 수행
     * @param {Position} position - 움직임을 수행할 위치
     * @returns {boolean} 성공하면 true, 실패하면 false
     */
    makeMove(position) {
        if (this._gameState !== GameState.PLAYING) {
            return false;
        }

        if (!this._gameBoard.placePlayer(position, this._currentPlayer)) {
            return false;
        }

        this._checkGameState();
        
        if (this._gameState === GameState.PLAYING) {
            this._switchPlayer();
        }

        return true;
    }

    /**
     * 현재 플레이어 반환
     * @returns {string} 현재 플레이어
     */
    getCurrentPlayer() {
        return this._currentPlayer;
    }

    /**
     * 현재 게임 상태 반환
     * @returns {string} 현재 게임 상태
     */
    getGameState() {
        return this._gameState;
    }

    /**
     * 지정된 위치의 플레이어 반환
     * @param {Position} position - 확인할 위치
     * @returns {string|null} 해당 위치의 플레이어 또는 null
     */
    getPlayerAt(position) {
        return this._gameBoard.getPlayer(position);
    }

    /**
     * 게임을 초기 상태로 리셋
     */
    resetGame() {
        this._gameBoard.clear();
        this._currentPlayer = Player.X;
        this._gameState = GameState.PLAYING;
    }

    /**
     * 게임 보드의 모든 위치 정보 반환
     * @returns {Array} 위치와 플레이어 정보가 담긴 배열
     */
    getBoardPositions() {
        return this._gameBoard.getAllPositions();
    }

    /**
     * 플레이어 전환
     */
    _switchPlayer() {
        this._currentPlayer = this._currentPlayer === Player.X ? Player.O : Player.X;
    }

    /**
     * 게임 상태 확인 (승리 또는 무승부)
     */
    _checkGameState() {
        const winner = this._checkForWinner();
        if (winner) {
            this._gameState = winner === Player.X ? GameState.PLAYER_X_WON : GameState.PLAYER_O_WON;
            return;
        }

        if (this._gameBoard.isFull()) {
            this._gameState = GameState.DRAW;
        }
    }

    /**
     * 승리 조건 확인
     * @returns {string|null} 승리한 플레이어 또는 null
     */
    _checkForWinner() {
        // 가로 확인
        for (let row = 0; row < 3; row++) {
            const player = this._gameBoard.getPlayer(new Position(row, 0));
            if (player && 
                player === this._gameBoard.getPlayer(new Position(row, 1)) &&
                player === this._gameBoard.getPlayer(new Position(row, 2))) {
                return player;
            }
        }

        // 세로 확인
        for (let col = 0; col < 3; col++) {
            const player = this._gameBoard.getPlayer(new Position(0, col));
            if (player && 
                player === this._gameBoard.getPlayer(new Position(1, col)) &&
                player === this._gameBoard.getPlayer(new Position(2, col))) {
                return player;
            }
        }

        // 주 대각선 확인
        const centerPlayer = this._gameBoard.getPlayer(new Position(1, 1));
        if (centerPlayer &&
            centerPlayer === this._gameBoard.getPlayer(new Position(0, 0)) &&
            centerPlayer === this._gameBoard.getPlayer(new Position(2, 2))) {
            return centerPlayer;
        }

        // 반 대각선 확인
        if (centerPlayer &&
            centerPlayer === this._gameBoard.getPlayer(new Position(0, 2)) &&
            centerPlayer === this._gameBoard.getPlayer(new Position(2, 0))) {
            return centerPlayer;
        }

        return null;
    }
}
