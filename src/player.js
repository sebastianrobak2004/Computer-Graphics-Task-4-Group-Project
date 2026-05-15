import * as THREE from 'three';
import { camera, scene } from './sceneManager';
import { ringGeometryOuterRadius } from './ring';

export let player;

export const setupPlayer = () => {
	// Initialize player as an empty object
	player = new THREE.Object3D();

	player.position.set(0, 0, ringGeometryOuterRadius);

	setupPlayerCapsule();

	scene.add(player);
};

const setupPlayerCapsule = () => {
	const playerCapsuleRadius = 10;
	const playerCapsuleHeight = 10;
	const playerCapsuleCapSegments = 4;
	const playerCapsuleRadialSegments = 12;
	const playerCapsuleOpenEnded = 1;

	const playerGeometry = new THREE.CapsuleGeometry(
		playerCapsuleRadius,
		playerCapsuleHeight,
		playerCapsuleCapSegments,
		playerCapsuleRadialSegments,
		playerCapsuleOpenEnded,
	);
	const playerMaterial = new THREE.MeshBasicMaterial({
		color: new THREE.Color(1, 0.5, 1),
		wireframe: false,
	});

	const playerCapsule = new THREE.Mesh(playerGeometry, playerMaterial);

	player.add(playerCapsule);
};
