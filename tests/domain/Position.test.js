import { test, describe } from 'node:test';
import assert from 'node:assert';
import { Position } from '../../src/domain/Position.js';

describe('Position', () => {
    test('should create position with valid coordinates', () => {
        const position = new Position(1, 2);
        
        assert.strictEqual(position.row, 1);
        assert.strictEqual(position.column, 2);
    });

    test('should throw error when row is invalid', () => {
        assert.throws(() => new Position(-1, 0), Error);
        assert.throws(() => new Position(3, 0), Error);
    });

    test('should throw error when column is invalid', () => {
        assert.throws(() => new Position(0, -1), Error);
        assert.throws(() => new Position(0, 3), Error);
    });

    test('should be equal when coordinates are same', () => {
        const pos1 = new Position(1, 1);
        const pos2 = new Position(1, 1);
        
        assert.ok(pos1.equals(pos2));
    });

    test('should not be equal when coordinates are different', () => {
        const pos1 = new Position(1, 1);
        const pos2 = new Position(1, 2);
        
        assert.ok(!pos1.equals(pos2));
    });

    test('should convert to string representation', () => {
        const position = new Position(1, 2);
        
        assert.strictEqual(position.toString(), '1,2');
    });
});
