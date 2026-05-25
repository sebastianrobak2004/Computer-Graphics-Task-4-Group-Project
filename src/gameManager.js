import { isHit, resetCollision } from './collision';
import { pauseScene, resumeScene, scene } from './sceneManager';
import {
	level,
	startLevelGeneration,
	setLevelSpeed,
} from './LevelGeneration/levelGenerator';
import { player } from './player';
import { ringGeometryOuterRadius } from './ring';

export const GameState = {
	MENU: 'menu',
	PLAYING: 'playing',
	GAMEOVER: 'gameover',
};

const MAX_STAMINA = 100;
const STAMINA_DEPLETION_PER_FRAME = 1;
const STAMINA_RECOVERY_PER_FRAME = 0.5;
const STAMINA_RECOVERY_THRESHOLD = 25; // 25% of max stamina

export const gameData = {
	score: 0,
	startTime: null,
	currentTime: 0,
	elapsedSeconds: 0,
	currentStamina: MAX_STAMINA,
	isSprintingActive: false,
	canSprint: true,
};

let currentGameState = GameState.PLAYING;
let gameOverTime = null;

export function initializeGame() {
	gameData.score = 0;
	gameData.startTime = Date.now();
	gameData.currentTime = 0;
	gameData.elapsedSeconds = 0;
	gameData.currentStamina = MAX_STAMINA;
	gameData.isSprintingActive = false;
	gameData.canSprint = true;
	gameOverTime = null;
}

export function getCurrentGameState() {
	return currentGameState;
}

export function setState(newState) {
	if (currentGameState === newState) return;

	currentGameState = newState;

	if (newState === GameState.MENU) {
		pauseScene();
		hideGameOverOverlay();
		showMainMenuOverlay();
		hideStaminaBar();
		setLevelSpeed(1.5);
		if (level && level.parent) {
			scene.remove(level);
		}
	} else if (newState === GameState.GAMEOVER) {
		gameOverTime = Date.now();
		pauseScene();
		hideMainMenuOverlay();
		showGameOverOverlay();
		hideStaminaBar();
	} else if (newState === GameState.PLAYING) {
		resumeScene();
		hideGameOverOverlay();
		hideMainMenuOverlay();
		showStaminaBar();
		setLevelSpeed(1.2);
	}
}

export function manageGame() {
	if (currentGameState === GameState.PLAYING) {
		// Update elapsed time
		gameData.currentTime = Date.now() - gameData.startTime;
		gameData.elapsedSeconds = Math.floor(gameData.currentTime / 1000);

		updateStamina();

		updateStaminaBar();

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

function showGameOverOverlay() {
	const overlay = document.getElementById('gameOverOverlay');
	if (!overlay) return;

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

function showMainMenuOverlay() {
	const overlay = document.getElementById('mainMenuOverlay');
	if (overlay) {
		overlay.classList.add('active');
	}
}

function hideMainMenuOverlay() {
	const overlay = document.getElementById('mainMenuOverlay');
	if (overlay) {
		overlay.classList.remove('active');
	}
}

function showStaminaBar() {
	const staminaBar = document.getElementById('staminaBar');
	if (staminaBar) {
		staminaBar.classList.remove('hidden');
	}
}

function hideStaminaBar() {
	const staminaBar = document.getElementById('staminaBar');
	if (staminaBar) {
		staminaBar.classList.add('hidden');
	}
}

export function restartGame() {
	if (level && level.parent) {
		scene.remove(level);
	}

	startLevelGeneration();

	resetCollision();
	if (player) {
		player.position.set(0, 0, ringGeometryOuterRadius);
	}

	initializeGame();
	hideGameOverOverlay();
	showStaminaBar();
	resumeScene();
	setState(GameState.PLAYING);
}

export function startGame() {
	if (currentGameState !== GameState.MENU) return;

	startLevelGeneration();

	resetCollision();
	if (player) {
		player.position.set(0, 0, ringGeometryOuterRadius);
	}

	initializeGame();
	setState(GameState.PLAYING);
}

export function returnToMenu() {
	if (level && level.parent) {
		scene.remove(level);
	}

	gameData.score = 0;
	gameData.elapsedSeconds = 0;
	setState(GameState.MENU);
}

export function updateStamina() {
	if (currentGameState !== GameState.PLAYING) return;

	if (gameData.isSprintingActive) {
		gameData.currentStamina -= STAMINA_DEPLETION_PER_FRAME;
		if (gameData.currentStamina <= 0) {
			gameData.currentStamina = 0;
			gameData.isSprintingActive = false;
		}
	} else {
		gameData.currentStamina += STAMINA_RECOVERY_PER_FRAME;
		if (gameData.currentStamina > MAX_STAMINA) {
			gameData.currentStamina = MAX_STAMINA;
		}
	}

	gameData.canSprint = gameData.currentStamina >= STAMINA_RECOVERY_THRESHOLD;
}

export function startSprint() {
	if (gameData.canSprint && !gameData.isSprintingActive) {
		gameData.isSprintingActive = true;
	}
}

export function stopSprint() {
	gameData.isSprintingActive = false;
}

export function updateStaminaBar() {
	const staminaBarFill = document.getElementById('staminaBarFill');
	if (staminaBarFill) {
		const percentage = (gameData.currentStamina / MAX_STAMINA) * 100;
		staminaBarFill.style.width = percentage + '%';

		if (percentage > 50) {
			staminaBarFill.style.backgroundColor = '#4ade80'; // green
		} else if (percentage > 25) {
			staminaBarFill.style.backgroundColor = '#fbbf24'; // yellow
		} else {
			staminaBarFill.style.backgroundColor = '#f87171'; // red
		}
	}
}
