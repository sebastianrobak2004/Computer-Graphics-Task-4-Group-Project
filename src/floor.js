import * as THREE from 'three';
import { registerFunctionForSetup, scene, timer, camera } from './sceneManager.js';
import fragmentShader from './shaders/fragment.glsl?raw';
import vertexShader from './shaders/vertex.glsl?raw';

export const floorHeight = -35.1;

export const setupFloor = () => {
	const floorGeometry = new THREE.CircleGeometry(1000, 50);

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
	floorMesh.position.y = floorHeight;
	floorMesh.rotation.x -= 0.5 * Math.PI;

	scene.add(floorMesh);

	const updateFloorShaders = () => {
		floorShader.uniforms.u_time.value = timer.getElapsed();
	};

	registerFunctionForSetup(updateFloorShaders);
};
