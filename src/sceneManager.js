import * as THREE from 'three';
import { setupFloor } from './floor';
import { move_camera } from './main';
import { startLevelGeneration } from './LevelGeneration/levelGenerator';

export let camera;
export let scene;
export let renderer;
export let sunlight;
export let timer;

const updateFunctions = [];

const setupCamera = () => {
	// Camera constants
	const cameraFOV = 90;
	const aspectRatio = window.innerWidth / window.innerHeight;
	const cameraNearPlane = 0.1;
	const cameraFarPlane = 10000;

	camera = new THREE.PerspectiveCamera(
		cameraFOV,
		aspectRatio,
		cameraNearPlane,
		cameraFarPlane,
	);

	camera.position.set(0, 0, -10);
	camera.lookAt(0, -1, 1);
};

const setupScene = () => {
	scene = new THREE.Scene();
};

const setupRenderer = () => {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
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

export function registerFunctionForSetup(func) {
    if(typeof func !== 'function'){
        console.error('Pushed Non-function to function list', func, typeof func);
    }


	updateFunctions.push(func);
}

function update() {
	timer.update();
	renderer.render(scene, camera);
	move_camera();

	// Execute any functions registered outside of the sceneManager
	for (const fn of updateFunctions) {
        if(typeof fn !== 'function'){
            console.error("Not a function", fn);
            throw Error("updateFunctions contains non function");
        }
        fn();
		
            
	}
}

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
    startLevelGeneration();

	renderer.setAnimationLoop(update);
}
