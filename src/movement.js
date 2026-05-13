import * as THREE from 'three';
import { movementState } from './controls';
import { player } from './player';
import { camera } from './sceneManager';
import { ringGeometryOuterRadius } from './ring';

// Constants
const SPEED = 0.003;

let playerAngle = 0;

export function move() {
	if (movementState.isMovingLeft) {
		playerAngle += SPEED;
	}

	if (movementState.isMovingRight) {
		playerAngle -= SPEED;
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
