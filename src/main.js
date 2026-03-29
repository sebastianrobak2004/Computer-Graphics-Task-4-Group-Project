import * as THREE from 'three';
import { scene, camera, renderer, timer, doSetup } from './sceneManager.js';
import { floor_mesh, update_shaders } from './floor.js';
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
