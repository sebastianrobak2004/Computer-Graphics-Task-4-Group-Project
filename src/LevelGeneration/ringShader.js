import * as THREE from 'three';

import frag from './levelshaders/fragment.glsl?raw';
import vert from './levelshaders/vertex.glsl?raw';

import { timer } from '../sceneManager.js'; 


export const levelShad = new THREE.ShaderMaterial({
    uniforms: {
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight ).multiplyScalar(Math.min(window.devicePixelRatio, 2))},
        u_time: { value: 0.0 },
    },

    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    generateMipmaps: true,

    vertexShader: vert,
    fragmentShader: frag,
    
});


