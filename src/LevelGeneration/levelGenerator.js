import * as THREE from 'three';
import { scene, timer } from '../sceneManager.js';

import { generateMask } from './ringSegmentMask.js';
import { levelShad } from './ringShader.js';

const epsilon = 0.1;
const ringDivisions = 8;

let levelSpeed = 0.7;

export let level;
export let levelUpdate = () => {}; // Will be set by startLevelGeneration

export function setLevelSpeed(speed) {
	levelSpeed = speed;
}

export const startLevelGeneration = () => {
	level = new THREE.Group();

	const ring = createRingMesh(ringDivisions);
	const scaleVec = new THREE.Vector3();

	const MAX_RINGS = 20;
	const MAX_SCALE = 1024;

	let derivedRadius = 1;
	let currentLevel = null;

	ring.scale.set(epsilon, epsilon, 1);
	level.scale.set(1, 1, 1);
	level.position.set(0, 0, 0);

	level.rotateX(Math.PI / 2);
	level.position.y -= 35;

	scene.add(level);

	levelUpdate = () => {
		const delta = timer.getDelta();
		const growth = levelSpeed * delta;
		const multiplier = 1 + growth;
		derivedRadius *= multiplier;

		if (derivedRadius >= 2) {
			const cur = ring.clone();

			currentLevel = generateMask(ringDivisions, currentLevel);

			const segments = [...cur.children];
			segments.forEach((segment, i) => {
				if (currentLevel[i]) {
					cur.remove(segment);
				}
			});
			const adjustment = 2 / derivedRadius;

			level.add(cur);
			const inverseScale = 1 / level.scale.x;
			cur.scale.x = epsilon * adjustment * inverseScale;
			cur.scale.y = epsilon * adjustment * inverseScale;

			derivedRadius -= 1;
			if (level.children.length > MAX_RINGS) {
				level.remove(level.children[0]);
			}
		}
		scaleVec.set(multiplier, multiplier, 1);
		level.scale.multiply(scaleVec);

		if (level.scale.x > MAX_SCALE) {
			const scaleDown = level.scale.x;

			level.children.forEach((child) => {
				child.scale.multiply(new THREE.Vector3(scaleDown, scaleDown, 1));
			});

			level.scale.set(1, 1, 1);
		}
	};
};

const createRingMesh = (Divisions) => {
	const angleIncrement = (2 * Math.PI) / Divisions;
	const segmentGeometries = [];

	for (let i = 1; i <= Divisions; i++) {
		segmentGeometries.push(
			createDonutSlice({
				startAngle: angleIncrement * i,
				endAngle: angleIncrement * (i + 1),
			}),
		);
	}

	const ring = new THREE.Group();
	segmentGeometries.forEach((segment) => {
		const mesh = new THREE.Mesh(segment, levelShad);
		ring.add(mesh);
	});
	return ring;
};

const createDonutSlice = ({
	innerRadius = 1,
	outerRadius = 2,
	startAngle = 0,
	endAngle = Math.PI / 4,
	depth = 0.1,
} = {}) => {
	const shape = new THREE.Shape();
	shape.absarc(0, 0, outerRadius, startAngle, endAngle, false);
	shape.absarc(0, 0, innerRadius, endAngle, startAngle, true);
	shape.closePath();

	return new THREE.ExtrudeGeometry(shape, {
		depth,
		bevelEnabled: false,
		steps: 1,
	});
};
