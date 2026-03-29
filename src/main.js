import * as THREE from 'three';
import { camera, doSetup } from './sceneManager.js';
import { movementState } from './controls.js';

doSetup();

const SPEED = 10;
export function move_camera() {
	if (movementState.isMovingForward) {
		camera.position.z += SPEED;
	}

	if (movementState.isMovingBackward) {
		camera.position.z -= SPEED;
	}

	if (movementState.isMovingLeft) {
		camera.position.x += SPEED;
	}

	if (movementState.isMovingRight) {
		camera.position.x -= SPEED;
	}

	if (movementState.isFalling) {
	}

	if (movementState.isTurningRight) {
	}

	if (movementState.isTurningLeft) {
	}
}
