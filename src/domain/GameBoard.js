import { Position } from './Position.js';

/**
 * GameBoard Entity
 * 틱택토 게임의 3x3 격자 보드를 관리
 */
export class GameBoard {
    constructor() {
        this._board = Array(3).fill(null).map(() => Array(3).fill(null));
    }

    /**
     * 지정된 위치에 플레이어를 배치
     * @param {Position} position - 배치할 위치
     * @param {string} player - 배치할 플레이어 (Player.X 또는 Player.O)
     * @returns {boolean} 성공적으로 배치되었으면 true, 실패하면 false
     */
    placePlayer(position, player) {
        if (!this.isEmpty(position)) {
            return false;
        }

        this._board[position.row][position.column] = player;
        return true;
    }

    /**
     * 지정된 위치의 플레이어를 반환
     * @param {Position} position - 확인할 위치
     * @returns {string|null} 해당 위치의 플레이어 또는 null
     */
    getPlayer(position) {
        return this._board[position.row][position.column];
    }

    /**
     * 지정된 위치가 비어있는지 확인
     * @param {Position} position - 확인할 위치
     * @returns {boolean} 비어있으면 true, 아니면 false
     */
    isEmpty(position) {
        return this._board[position.row][position.column] === null;
    }

    /**
     * 보드가 가득 찼는지 확인
     * @returns {boolean} 가득 찼으면 true, 아니면 false
     */
    isFull() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this._board[row][col] === null) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 보드의 모든 위치를 지움
     */
    clear() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                this._board[row][col] = null;
            }
        }
    }

    /**
     * 모든 위치와 플레이어 정보를 반환
     * @returns {Array} 위치와 플레이어 정보가 담긴 배열
     */
    getAllPositions() {
        const positions = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                positions.push({
                    position: new Position(row, col),
                    player: this._board[row][col]
                });
            }
        }
        return positions;
    }
}
