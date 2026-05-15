import * as THREE from 'three';
import { collisionMain } from './collision';
import { setupFloor, updateFloorShaders } from './floor';
import { initializeGame, manageGame } from './gameManager';
import {
	levelUpdate,
	startLevelGeneration,
} from './LevelGeneration/levelGenerator';
import { doMove } from './movement';
import { setupPlayer } from './player';
import { ringGeometryOuterRadius, setupMovementPathRing } from './ring';
import postProcessingFragment from './shaders/postFrag.glsl?raw';

export let camera;
export let scene;
export let renderer;
export let sunlight;
export let timer;

// post processing
export let renderTarget;
export let postCamera;
export let postScene;
export let postMaterial;
export let postQuad;

let isScenePaused = false;

const setupCamera = () => {
	// Camera constants
	const cameraFOV = 90;
	const aspectRatio = window.innerWidth / window.innerHeight;
	const cameraNearPlane = 0.1;
	const cameraFarPlane = 100000;

	camera = new THREE.PerspectiveCamera(
		cameraFOV,
		aspectRatio,
		cameraNearPlane,
		cameraFarPlane,
	);

	camera.position.set(0, 0, ringGeometryOuterRadius);
	camera.lookAt(0, -1, 1);
};

const setupScene = () => {
	scene = new THREE.Scene();
};

const setupRenderer = () => {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	const SSAA = 2.0;

	renderTarget = new THREE.WebGLRenderTarget(
		window.innerHeight * SSAA,
		window.outerHeight * SSAA,
	);
	renderTarget.texture.minFilter = THREE.LinearFilter;
	renderTarget.texture.magFilter = THREE.LinearFilter;
	renderTarget.texture.generateMipmaps = false;
};

const setupSunlight = () => {
	sunlight = new THREE.DirectionalLight(0xffffff, 0.5);
	scene.add(sunlight);
};

const setupTimer = () => {
	timer = new THREE.Timer();
	timer.connect(document);
};

const setupResizeFunction = () => {
	function OnResize() {
		var width = window.innerWidth;
		var height = window.innerHeight;

		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.render(scene, camera);
	}

	window.addEventListener('resize', OnResize);
};

const setupPostProcessing = () => {
	postScene = new THREE.Scene();
	postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

	postMaterial = new THREE.ShaderMaterial({
		uniforms: {
			tDiffuse: { value: renderTarget.texture },
			u_texel: {
				value: new THREE.Vector2(1 / window.innerWidth, 1 / window.innerHeight),
			},
			u_shape: {
				value: new THREE.Vector2(window.innerWidth, window.innerHeight),
			},
		},

		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		generateMipmaps: true,

		vertexShader: `
			varying vec2 vUv;
			void main() {
				vUv = uv;
				gl_Position = vec4(position, 1.0);
			}
		`,
		fragmentShader: postProcessingFragment,
	});

	postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial);

	postScene.add(postQuad);
};

function update() {
	if (!isScenePaused) {
		timer.update();

		doMove();
		collisionMain();
		levelUpdate();
		updateFloorShaders();
	}

	renderer.setRenderTarget(renderTarget);
	renderer.render(scene, camera);
	renderer.setRenderTarget(null);

	renderer.render(postScene, postCamera);

	manageGame();
}

export function doSetup() {
	// Scene setup
	setupCamera();
	setupScene();
	setupRenderer();
	setupSunlight();
	setupTimer();
	setupResizeFunction();
	setupPostProcessing();

	// Geometry setup
	setupFloor();
	setupMovementPathRing();
	startLevelGeneration();
	setupPlayer();

	initializeGame();

	renderer.setAnimationLoop(update);
}

export function pauseScene() {
	isScenePaused = true;
}

export function resumeScene() {
	isScenePaused = false;
}

export function isSceneRunning() {
	return !isScenePaused;
}
