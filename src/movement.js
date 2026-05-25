import * as THREE from 'three';
import { movementState } from './controls';
import { player } from './player';
import { camera } from './sceneManager';
import { ringGeometryOuterRadius } from './ring';
import { gameData, startSprint, stopSprint } from './gameManager';

// Constants
const SPEED = 0.03;
const SPRINT_SPEED_MULTIPLIER = 1.5;

let playerAngle = 0;

export function doMove() {
	if (movementState.isSprintingPressed) {
		startSprint();
	} else {
		stopSprint();
	}

	let effectiveSpeed = SPEED;
	if (gameData.isSprintingActive) {
		effectiveSpeed = SPEED * SPRINT_SPEED_MULTIPLIER;
	}

	if (movementState.isMovingLeft) {
		playerAngle += effectiveSpeed;
	}

	if (movementState.isMovingRight) {
		playerAngle -= effectiveSpeed;
	}

	const newPos = new THREE.Vector3(
		ringGeometryOuterRadius * Math.cos(playerAngle),
		-21,
		ringGeometryOuterRadius * Math.sin(playerAngle),
	);

	camera.position.x = newPos.x;
	camera.position.y = newPos.y;
	camera.position.z = newPos.z;

	if (player) {
		player.position.x = newPos.x;
		player.position.y = newPos.y;
		player.position.z = newPos.z;
	}

	camera.lookAt(0, -25, 0);
}
