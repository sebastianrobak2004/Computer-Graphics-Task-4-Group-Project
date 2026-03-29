import * as THREE from 'three';
import { scene, timer } from './sceneManager.js';
import fragmentShader from './shaders/fragment.glsl?raw';
import vertexShader from './shaders/vertex.glsl?raw';

export const setupFloor = () => {
	const floorGeometry = new THREE.BoxGeometry(1000, 10, 1000);

	const floorShader = new THREE.ShaderMaterial({
		uniforms: {
			u_resolution: {
				value: new THREE.Vector2(window.innerWidth, window.innerHeight),
			},
			u_time: { value: timer.getElapsed() },
			uLightDir: { value: new THREE.Vector3(0.5, 1.0, 0.5) },
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
	});

	const floorMesh = new THREE.Mesh(floorGeometry, floorShader);
	floorMesh.position.y -= 50;
	floorMesh.rotation.z += 0 * Math.PI;

	scene.add(floorMesh);

	const updateFloorShaders = () => {
		floorShader.uniforms.u_time.value = timer.getElapsed();
	};

	return updateFloorShaders;
};
