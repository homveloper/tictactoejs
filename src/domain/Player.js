/**
 * Player enum
 * 틱택토 게임의 플레이어를 나타냄
 */
export const Player = Object.freeze({
    X: 'X',
    O: 'O'
});

/**
 * GameState enum
 * 게임의 현재 상태를 나타냄
 */
export const GameState = Object.freeze({
    PLAYING: 'PLAYING',
    PLAYER_X_WON: 'PLAYER_X_WON',
    PLAYER_O_WON: 'PLAYER_O_WON',
    DRAW: 'DRAW'
});
