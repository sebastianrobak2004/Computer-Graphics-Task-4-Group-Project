import * as THREE from 'three';
import { scene, camera, renderer } from './scene_manager.js';
import { floor_mesh } from './floor.js';
import { movementState } from './controls.js';

scene.add(floor_mesh);

camera.position.set(0, 0, -10);
camera.lookAt(0, -10, 1);

function animate() {
	requestAnimationFrame(animate);

	renderer.render(scene, camera);
}

function move_camera() {
	if (movementState.isMovingForward) {
		console.log('forward');
	}

	if (movementState.isMovingBackward) {
		console.log('backward');
	}

	if (camera_controls.isMovingLeft) {
	}

	if (camera_controls.isMovingRight) {
	}

	if (camera_controls.isRising) {
	}

	if (camera_controls.isFalling) {
	}

	if (camera_controls.isTurningRight) {
	}

	if (camera_controls.isTurningLeft) {
	}
}

animate();
