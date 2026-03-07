import * as THREE from 'three';

import fragmentShader from './shaders/fragment.glsl?raw';
import vertexShader from './shaders/vertex.glsl?raw';

const floor_geometry = new THREE.BoxGeometry(1000, 10, 1000);


const shad = new THREE.ShaderMaterial({
    uniforms: {
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight )},
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
});

export const floor_mesh = new THREE.Mesh(floor_geometry, shad);
floor_mesh.position.y -= 50;

