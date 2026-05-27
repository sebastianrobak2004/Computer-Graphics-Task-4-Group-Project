import * as THREE from 'three';
import { scene, timer } from './sceneManager.js';
import fragmentShader from './shaders/fragment.glsl?raw';
import vertexShader from './shaders/vertex.glsl?raw';
import rockTex from './textures/rocky_normal.jpg';

export const floorHeight = -36;
export let updateFloorShaders = () => {};

const loader = new THREE.TextureLoader();


export const setupFloor = () => {

    const floorGeometry = new THREE.CircleGeometry(1000, 50);

    const floorShader = new THREE.ShaderMaterial({
        uniforms: {
            u_resolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight),
            },
            u_time: { value: timer.getElapsed() },
            uLightDir: { value: new THREE.Vector3(0.5, 1.0, 0.5) },

            u_rockMap: { value: null },
        },
        vertexShader,
        fragmentShader,
    });
    loader.load(rockTex, (tex) => {

        console.log("texture loaded");

        tex.colorSpace = THREE.NoColorSpace;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;

        floorShader.uniforms.u_rockMap.value = tex;
    });

    const floorMesh = new THREE.Mesh(floorGeometry, floorShader);

    

    floorMesh.position.y = floorHeight;
    floorMesh.rotation.x = -0.5 * Math.PI;

    scene.add(floorMesh);

    updateFloorShaders = () => {
        floorShader.uniforms.u_time.value = timer.getElapsed();
    };
};
