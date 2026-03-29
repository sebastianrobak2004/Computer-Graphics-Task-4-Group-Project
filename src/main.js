import * as THREE from 'three';
import { scene, camera, renderer, timer } from './scene_manager.js';
import { floor_mesh, update_shaders } from './floor.js';
import { movementState } from './controls.js';

scene.add(floor_mesh);

camera.position.set(0, 0, -10);
camera.lookAt(0, -1, 1);

const SPEED = 10;
function move_camera() {
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

// Register functions to be run on animation loop here
function update() {
	timer.update();
	update_shaders();

	requestAnimationFrame(animate);

	move_camera();

	renderer.render(scene, camera);
}

renderer.setAnimationLoop(update);
