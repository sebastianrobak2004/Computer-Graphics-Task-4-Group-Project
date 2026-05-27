import * as THREE from 'three';
import { collisionMain } from './collision';
import { setupFloor, updateFloorShaders } from './floor';
import {
	initializeGame,
	manageGame,
	gameData,
	getCurrentGameState,
	GameState,
	setState,
} from './gameManager';
import {
	levelUpdate,
	startLevelGeneration,
} from './LevelGeneration/levelGenerator';
import { doMove } from './movement';
import { setupPlayer } from './player';
import { ringGeometryOuterRadius, setupMovementPathRing } from './ring';
import postProcessingFragment from './shaders/postFrag.glsl?raw';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { FXAAPass } from 'three/addons/postprocessing/FXAAPass.js';

const BASE_FOV = 90;
const SPRINT_FOV = 105;

export let camera;
export let scene;
export let timer;
let renderer;
let sunlight;

// post processing
let postCamera;
let postScene;
let postMaterial;
let postQuad;
let composer;

let isScenePaused = false;

export function doSetup() {
	// Scene setup
	setupCamera();
	setupScene();
	setupRenderer();
	setupSunlight();
	setupTimer();
	setupResizeFunction();

	// Geometry setup
	setupFloor();
	setupMovementPathRing();
	startLevelGeneration();
	setupPlayer();

	initializeGame();
	setState(GameState.MENU);

	renderer.setAnimationLoop(update);
}

function update() {
	if (!isScenePaused) {
		timer.update();

		if (getCurrentGameState() === GameState.PLAYING) {
			doMove();
			collisionMain();
			levelUpdate();
			updateFloorShaders();
		} else if (getCurrentGameState() === GameState.MENU) {
			// Update level generation even during menu for visual feedback
			levelUpdate();
			updateFloorShaders();
		}

		if (gameData.isSprintingActive) {
			camera.fov = lerp(camera.fov, SPRINT_FOV, 0.1);
		} else {
			camera.fov = lerp(camera.fov, BASE_FOV, 0.1);
		}
		camera.updateProjectionMatrix();
	}

	// Update camera position based on game state
	if (getCurrentGameState() === GameState.MENU) {
		// Position camera vertically over center of map
		camera.position.set(0, 50, 0);
		camera.lookAt(0, 0, 0);
	}

	composer.render();
	manageGame();
}

const setupCamera = () => {
	// Camera constants
	const aspectRatio = window.innerWidth / window.innerHeight;
	const cameraNearPlane = 0.1;
	const cameraFarPlane = 100000;

	camera = new THREE.PerspectiveCamera(
		BASE_FOV,
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

	renderer = new THREE.WebGLRenderer({
		antialias: false
	});

    renderer.setPixelRatio(2.0);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	composer = new EffectComposer(renderer);

	const renderPass = new RenderPass(scene, camera);

    const postPass = new ShaderPass(new THREE.ShaderMaterial({
        uniforms: {
            tDiffuse: { value: null },
            u_texel: {
                value: new THREE.Vector2(1 / window.innerWidth, 1 / window.innerHeight),
            },
            u_shape: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight),
            },
        },

        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position.xy, 0.0, 1.0);
            }
        `,

        fragmentShader: postProcessingFragment
    }));

    composer.addPass(renderPass);
    composer.addPass(postPass);
    const fxaaPass = new FXAAPass();
    composer.addPass(fxaaPass);
    
    composer.addPass(new OutputPass());


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


// Helper functions
export const pauseScene = () => (isScenePaused = true);
export const resumeScene = () => (isScenePaused = false);
export const isSceneRunning = () => !isScenePaused;

function lerp(a, b, t) {
    return a + (b - a) * t;
}
