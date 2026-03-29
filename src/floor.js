import * as THREE from 'three';

import fragmentShader from './shaders/fragment.glsl?raw';
import vertexShader from './shaders/vertex.glsl?raw';

import { timer } from './scene_manager.js';


const floor_geometry = new THREE.BoxGeometry(1000, 10, 1000,);

const wire_mat = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
});

const shad = new THREE.ShaderMaterial({
    uniforms: {
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight )},
        u_time: { value: timer.getElapsed() },
        uLightDir: { value: new THREE.Vector3(0.5, 1.0, 0.5 ) },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
});

export const floor_mesh = new THREE.Mesh(floor_geometry, shad);
floor_mesh.position.y -= 50;
floor_mesh.rotation.z += 0 * Math.PI;
console.log(floor_mesh.geometry.attributes.uv);

export function update_shaders(){
    shad.uniforms.u_time.value = timer.getElapsed();
};

