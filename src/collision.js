import { level } from './LevelGeneration/levelGenerator';
import * as THREE from 'three';
import { player } from './player';

const raycaster = new THREE.Raycaster();
const rayDirection = new THREE.Vector3();

export function collisionMain() {
	const rayOrigin = player.position.clone();

	// Using a ray cast directly downwards to detect collision
	rayDirection.set(0, -1, 0);
	raycaster.set(rayOrigin, rayDirection);

	const segments = [];
	level.traverse((child) => {
		if (child.isMesh) {
			segments.push(child);
		}
	});

	const intersections = raycaster.intersectObjects(segments, true); // Make sure to check recursively

	// If there is a collision
	if (intersections.length > 0) {
		const closestHit = intersections[0];
		const distance = closestHit.distance;

		// End game
	}
}
