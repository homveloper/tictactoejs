import { test, describe } from 'node:test';
import assert from 'node:assert';
import { GameBoard } from '../../src/domain/GameBoard.js';
import { Position } from '../../src/domain/Position.js';
import { Player } from '../../src/domain/Player.js';

describe('GameBoard', () => {
    test('should create empty board', () => {
        const board = new GameBoard();
        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const position = new Position(row, col);
                assert.ok(board.isEmpty(position));
                assert.strictEqual(board.getPlayer(position), null);
            }
        }
    });

    test('should place player on empty position', () => {
        const board = new GameBoard();
        const position = new Position(1, 1);
        
        const result = board.placePlayer(position, Player.X);
        
        assert.ok(result);
        assert.strictEqual(board.getPlayer(position), Player.X);
        assert.ok(!board.isEmpty(position));
    });

    test('should not place player on occupied position', () => {
        const board = new GameBoard();
        const position = new Position(1, 1);
        board.placePlayer(position, Player.X);
        
        const result = board.placePlayer(position, Player.O);
        
        assert.ok(!result);
        assert.strictEqual(board.getPlayer(position), Player.X);
    });

    test('should detect when board is not full', () => {
        const board = new GameBoard();
        
        assert.ok(!board.isFull());
    });

    test('should detect when board is full', () => {
        const board = new GameBoard();
        
        // Fill the board
        board.placePlayer(new Position(0, 0), Player.X);
        board.placePlayer(new Position(0, 1), Player.O);
        board.placePlayer(new Position(0, 2), Player.X);
        board.placePlayer(new Position(1, 0), Player.O);
        board.placePlayer(new Position(1, 1), Player.X);
        board.placePlayer(new Position(1, 2), Player.O);
        board.placePlayer(new Position(2, 0), Player.X);
        board.placePlayer(new Position(2, 1), Player.O);
        board.placePlayer(new Position(2, 2), Player.X);
        
        assert.ok(board.isFull());
    });

    test('should clear all positions', () => {
        const board = new GameBoard();
        board.placePlayer(new Position(1, 1), Player.X);
        
        board.clear();
        
        assert.ok(board.isEmpty(new Position(1, 1)));
    });

    test('should get all positions', () => {
        const board = new GameBoard();
        board.placePlayer(new Position(0, 0), Player.X);
        board.placePlayer(new Position(1, 1), Player.O);
        
        const positions = board.getAllPositions();
        
        assert.strictEqual(positions.length, 9);
        assert.strictEqual(positions[0].player, Player.X);
        assert.strictEqual(positions[4].player, Player.O);
        assert.strictEqual(positions[8].player, null);
    });
});
