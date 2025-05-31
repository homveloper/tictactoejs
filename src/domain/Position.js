/**
 * Position Value Object
 * 틱택토 게임에서 격자 위치를 나타내는 불변 객체
 */
export class Position {
    constructor(row, column) {
        if (!Number.isInteger(row) || row < 0 || row > 2) {
            throw new Error('Row must be between 0 and 2');
        }
        
        if (!Number.isInteger(column) || column < 0 || column > 2) {
            throw new Error('Column must be between 0 and 2');
        }

        this._row = row;
        this._column = column;
        
        // 불변성을 보장하기 위해 freeze
        Object.freeze(this);
    }

    get row() {
        return this._row;
    }

    get column() {
        return this._column;
    }

    equals(other) {
        return other instanceof Position && 
               this._row === other._row && 
               this._column === other._column;
    }

    toString() {
        return `${this._row},${this._column}`;
    }
}
