import { GameEngine } from '../application/GameEngine.js';
import { Position } from '../domain/Position.js';
import { Player, GameState } from '../domain/Player.js';

/**
 * GameUI - Infrastructure Layer
 * HTML DOM과의 상호작용을 담당하는 UI 컨트롤러
 */
export class GameUI {
    constructor() {
        this._gameEngine = new GameEngine();
        this._statusElement = document.getElementById('status');
        this._gameBoardElement = document.getElementById('gameBoard');
        this._resetButton = document.getElementById('resetBtn');
        this._modal = document.getElementById('gameModal');
        this._modalTitle = document.getElementById('modalTitle');
        this._modalMessage = document.getElementById('modalMessage');
        this._modalNewGameBtn = document.getElementById('modalNewGame');
        this._modalCloseBtn = document.querySelector('.close');
        
        this._initializeBoard();
        this._bindEvents();
        this._updateUI();
        this._runTests();
    }

    /**
     * 게임 보드 초기화
     */
    _initializeBoard() {
        this._gameBoardElement.innerHTML = '';
        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const button = document.createElement('button');
                button.className = 'cell';
                button.dataset.row = row;
                button.dataset.col = col;
                button.addEventListener('click', (e) => this._handleCellClick(e));
                
                this._gameBoardElement.appendChild(button);
            }
        }
    }

    /**
     * 이벤트 리스너 바인딩
     */
    _bindEvents() {
        this._resetButton.addEventListener('click', () => this._resetGame());
        this._modalNewGameBtn.addEventListener('click', () => this._resetGame());
        this._modalCloseBtn.addEventListener('click', () => this._closeModal());
        
        // 모달 외부 클릭시 닫기
        this._modal.addEventListener('click', (e) => {
            if (e.target === this._modal) {
                this._closeModal();
            }
        });

        // ESC 키로 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this._modal.style.display === 'block') {
                this._closeModal();
            }
        });
    }

    /**
     * 셀 클릭 이벤트 처리
     */
    _handleCellClick(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        const position = new Position(row, col);

        if (this._gameEngine.makeMove(position)) {
            this._updateUI();
            
            if (this._gameEngine.getGameState() !== GameState.PLAYING) {
                setTimeout(() => this._showGameResult(), 500);
            }
        }
    }

    /**
     * UI 업데이트
     */
    _updateUI() {
        this._updateStatus();
        this._updateBoard();
    }

    /**
     * 상태 표시 업데이트
     */
    _updateStatus() {
        const gameState = this._gameEngine.getGameState();
        const currentPlayer = this._gameEngine.getCurrentPlayer();
        
        // 상태 클래스 제거
        this._statusElement.className = 'status';
        
        switch (gameState) {
            case GameState.PLAYING:
                this._statusElement.textContent = `Player ${currentPlayer}'s Turn`;
                this._statusElement.classList.add('playing');
                break;
            case GameState.PLAYER_X_WON:
                this._statusElement.textContent = 'Player X Wins! 🎉';
                this._statusElement.classList.add('x-won');
                break;
            case GameState.PLAYER_O_WON:
                this._statusElement.textContent = 'Player O Wins! 🎉';
                this._statusElement.classList.add('o-won');
                break;
            case GameState.DRAW:
                this._statusElement.textContent = "It's a Draw! 🤝";
                this._statusElement.classList.add('draw');
                break;
        }
    }

    /**
     * 게임 보드 업데이트
     */
    _updateBoard() {
        const positions = this._gameEngine.getBoardPositions();
        const cells = this._gameBoardElement.querySelectorAll('.cell');
        
        positions.forEach((positionData, index) => {
            const cell = cells[index];
            const player = positionData.player;
            
            // 셀 내용 및 스타일 업데이트
            cell.textContent = player || '';
            cell.className = 'cell';
            
            if (player) {
                cell.classList.add(player.toLowerCase());
                cell.disabled = true;
            } else {
                cell.disabled = this._gameEngine.getGameState() !== GameState.PLAYING;
            }
        });
    }

    /**
     * 게임 결과 모달 표시
     */
    _showGameResult() {
        const gameState = this._gameEngine.getGameState();
        
        switch (gameState) {
            case GameState.PLAYER_X_WON:
                this._modalTitle.textContent = 'Player X Wins! 🎉';
                this._modalMessage.textContent = 'Congratulations! Player X is the winner!';
                break;
            case GameState.PLAYER_O_WON:
                this._modalTitle.textContent = 'Player O Wins! 🎉';
                this._modalMessage.textContent = 'Congratulations! Player O is the winner!';
                break;
            case GameState.DRAW:
                this._modalTitle.textContent = "It's a Draw! 🤝";
                this._modalMessage.textContent = 'Great game! Both players played well!';
                break;
        }
        
        this._modal.style.display = 'block';
    }

    /**
     * 모달 닫기
     */
    _closeModal() {
        this._modal.style.display = 'none';
    }

    /**
     * 게임 리셋
     */
    _resetGame() {
        this._gameEngine.resetGame();
        this._updateUI();
        this._closeModal();
        
        // 모든 셀 활성화
        const cells = this._gameBoardElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.disabled = false;
            cell.classList.remove('winning');
        });
    }

    /**
     * 간단한 테스트 실행
     */
    async _runTests() {
        const testStatusElement = document.getElementById('testStatus');
        
        try {
            // 기본 동작 테스트
            const testEngine = new GameEngine();
            
            // 테스트 1: 초기 상태
            if (testEngine.getCurrentPlayer() !== Player.X || 
                testEngine.getGameState() !== GameState.PLAYING) {
                throw new Error('초기 상태 테스트 실패');
            }
            
            // 테스트 2: 움직임
            const position = new Position(1, 1);
            if (!testEngine.makeMove(position) || 
                testEngine.getCurrentPlayer() !== Player.O) {
                throw new Error('움직임 테스트 실패');
            }
            
            // 테스트 3: 중복 움직임
            if (testEngine.makeMove(position)) {
                throw new Error('중복 움직임 테스트 실패');
            }
            
            // 테스트 4: 리셋
            testEngine.resetGame();
            if (testEngine.getCurrentPlayer() !== Player.X || 
                testEngine.getPlayerAt(position) !== null) {
                throw new Error('리셋 테스트 실패');
            }
            
            testStatusElement.textContent = 'All tests passed! ✅';
            testStatusElement.className = 'success';
            
        } catch (error) {
            testStatusElement.textContent = `Tests failed: ${error.message} ❌`;
            testStatusElement.className = 'failure';
            console.error('Test error:', error);
        }
    }
}

// DOM이 로드되면 게임 UI 초기화
document.addEventListener('DOMContentLoaded', () => {
    new GameUI();
});
