import * as THREE from 'three';
import { scene } from './sceneManager';
import { floorHeight } from './floor';

export const ringGeometryOuterRadius = 120;

export const setupMovementPathRing = () => {
	const ringWidth = 3; // Just for visual clarity - should be 1
	const ringGeometryThetaSegments = 14;
	const ringGeometryPhiSegments = 1;

	const ringGeometry = new THREE.RingGeometry(
		ringGeometryOuterRadius - ringWidth,
		ringGeometryOuterRadius,
		ringGeometryThetaSegments,
		ringGeometryPhiSegments,
	);
	const ringMaterial = new THREE.MeshBasicMaterial({
		color: new THREE.Color(1, 0.5, 1),
		wireframe: true,
	});

	const movementPathRing = new THREE.Mesh(ringGeometry, ringMaterial);

	movementPathRing.rotation.x = Math.PI / 2;
	movementPathRing.position.y = floorHeight;

	scene.add(movementPathRing);
};
