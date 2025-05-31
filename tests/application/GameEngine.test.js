import { test, describe } from 'node:test';
import assert from 'node:assert';
import { GameEngine } from '../../src/application/GameEngine.js';
import { Position } from '../../src/domain/Position.js';
import { Player, GameState } from '../../src/domain/Player.js';

describe('GameEngine', () => {
    test('should start with Player X', () => {
        const engine = new GameEngine();
        
        assert.strictEqual(engine.getCurrentPlayer(), Player.X);
        assert.strictEqual(engine.getGameState(), GameState.PLAYING);
    });

    test('should switch player after valid move', () => {
        const engine = new GameEngine();
        const position = new Position(1, 1);
        
        const result = engine.makeMove(position);
        
        assert.ok(result);
        assert.strictEqual(engine.getCurrentPlayer(), Player.O);
    });

    test('should not switch player after invalid move', () => {
        const engine = new GameEngine();
        const position = new Position(1, 1);
        engine.makeMove(position);
        
        const result = engine.makeMove(position); // Same position
        
        assert.ok(!result);
        assert.strictEqual(engine.getCurrentPlayer(), Player.O);
    });

    test('should detect horizontal win for Player X', () => {
        const engine = new GameEngine();
        
        // Player X wins top row
        engine.makeMove(new Position(0, 0)); // X
        engine.makeMove(new Position(1, 0)); // O
        engine.makeMove(new Position(0, 1)); // X
        engine.makeMove(new Position(1, 1)); // O
        engine.makeMove(new Position(0, 2)); // X - wins
        
        assert.strictEqual(engine.getGameState(), GameState.PLAYER_X_WON);
    });

    test('should detect vertical win for Player O', () => {
        const engine = new GameEngine();
        
        // Player O wins first column
        engine.makeMove(new Position(0, 1)); // X
        engine.makeMove(new Position(0, 0)); // O
        engine.makeMove(new Position(1, 1)); // X
        engine.makeMove(new Position(1, 0)); // O
        engine.makeMove(new Position(0, 2)); // X
        engine.makeMove(new Position(2, 0)); // O - wins
        
        assert.strictEqual(engine.getGameState(), GameState.PLAYER_O_WON);
    });

    test('should detect diagonal win for Player X', () => {
        const engine = new GameEngine();
        
        // Player X wins main diagonal
        engine.makeMove(new Position(0, 0)); // X
        engine.makeMove(new Position(0, 1)); // O
        engine.makeMove(new Position(1, 1)); // X
        engine.makeMove(new Position(0, 2)); // O
        engine.makeMove(new Position(2, 2)); // X - wins
        
        assert.strictEqual(engine.getGameState(), GameState.PLAYER_X_WON);
    });

    test('should detect anti-diagonal win', () => {
        const engine = new GameEngine();
        
        // Player X wins anti-diagonal
        engine.makeMove(new Position(0, 2)); // X
        engine.makeMove(new Position(0, 0)); // O
        engine.makeMove(new Position(1, 1)); // X
        engine.makeMove(new Position(0, 1)); // O
        engine.makeMove(new Position(2, 0)); // X - wins
        
        assert.strictEqual(engine.getGameState(), GameState.PLAYER_X_WON);
    });

    test('should detect draw', () => {
        const engine = new GameEngine();
        
        // Create a draw scenario
        engine.makeMove(new Position(0, 0)); // X
        engine.makeMove(new Position(0, 1)); // O
        engine.makeMove(new Position(0, 2)); // X
        engine.makeMove(new Position(1, 0)); // O
        engine.makeMove(new Position(1, 1)); // X
        engine.makeMove(new Position(2, 0)); // O
        engine.makeMove(new Position(1, 2)); // X
        engine.makeMove(new Position(2, 2)); // O
        engine.makeMove(new Position(2, 1)); // X
        
        assert.strictEqual(engine.getGameState(), GameState.DRAW);
    });

    test('should not allow moves after game ends', () => {
        const engine = new GameEngine();
        
        // Player X wins
        engine.makeMove(new Position(0, 0)); // X
        engine.makeMove(new Position(1, 0)); // O
        engine.makeMove(new Position(0, 1)); // X
        engine.makeMove(new Position(1, 1)); // O
        engine.makeMove(new Position(0, 2)); // X - wins
        
        const result = engine.makeMove(new Position(2, 2));
        
        assert.ok(!result);
        assert.strictEqual(engine.getGameState(), GameState.PLAYER_X_WON);
    });

    test('should reset game to initial state', () => {
        const engine = new GameEngine();
        engine.makeMove(new Position(1, 1));
        
        engine.resetGame();
        
        assert.strictEqual(engine.getCurrentPlayer(), Player.X);
        assert.strictEqual(engine.getGameState(), GameState.PLAYING);
        assert.strictEqual(engine.getPlayerAt(new Position(1, 1)), null);
    });

    test('should return player at position', () => {
        const engine = new GameEngine();
        const position = new Position(1, 1);
        engine.makeMove(position);
        
        assert.strictEqual(engine.getPlayerAt(position), Player.X);
    });
});
