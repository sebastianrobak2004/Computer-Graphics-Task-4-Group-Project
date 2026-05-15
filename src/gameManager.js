import { isHit, resetCollision } from './collision';
import { pauseScene, resumeScene, scene } from './sceneManager';
import { level, startLevelGeneration } from './LevelGeneration/levelGenerator';
import { player } from './player';
import { ringGeometryOuterRadius } from './ring';

export const GameState = {
	MENU: 'menu',
	PLAYING: 'playing',
	GAMEOVER: 'gameover',
};

// Game data tracking
export const gameData = {
	score: 0,
	startTime: null,
	currentTime: 0,
	elapsedSeconds: 0,
};

let currentGameState = GameState.PLAYING;
let gameOverTime = null;

// Initialize game
export function initializeGame() {
	currentGameState = GameState.PLAYING;
	gameData.score = 0;
	gameData.startTime = Date.now();
	gameData.currentTime = 0;
	gameData.elapsedSeconds = 0;
	gameOverTime = null;
}

// State management
export function getCurrentGameState() {
	return currentGameState;
}

export function setState(newState) {
	if (currentGameState === newState) return;

	currentGameState = newState;

	if (newState === GameState.GAMEOVER) {
		gameOverTime = Date.now();
		pauseScene();
		showGameOverOverlay();
	} else if (newState === GameState.PLAYING) {
		resumeScene();
		hideGameOverOverlay();
	}
}

// Update game time and check collisions
export function manageGame() {
	if (currentGameState === GameState.PLAYING) {
		// Update elapsed time
		gameData.currentTime = Date.now() - gameData.startTime;
		gameData.elapsedSeconds = Math.floor(gameData.currentTime / 1000);

		// Check for collision (game over)
		if (isHit) {
			setState(GameState.GAMEOVER);
		}
	}
}

// Scoring system
export function addScore(points) {
	if (currentGameState === GameState.PLAYING) {
		gameData.score += points;
	}
}

// UI Overlay management
function showGameOverOverlay() {
	const overlay = document.getElementById('gameOverOverlay');
	if (!overlay) return;

	// Update game data display
	document.getElementById('finalScore').textContent = gameData.score;
	document.getElementById('survivalTime').textContent = gameData.elapsedSeconds;

	overlay.classList.add('active');
}

function hideGameOverOverlay() {
	const overlay = document.getElementById('gameOverOverlay');
	if (overlay) {
		overlay.classList.remove('active');
	}
}

// Restart game
export function restartGame() {
	// Clear old level from scene
	if (level && level.parent) {
		scene.remove(level);
	}

	// Regenerate level
	startLevelGeneration();

	// Reset collision state
	resetCollision();

	// Reset player position
	if (player) {
		player.position.set(0, 0, ringGeometryOuterRadius);
	}

	// Reset game state and data
	initializeGame();
	hideGameOverOverlay();
	resumeScene();
	setState(GameState.PLAYING);
}
