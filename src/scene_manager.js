import * as THREE from 'three';

export const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera( 90 , window.innerWidth/window.innerHeight , 0.1 , 1000 );
camera.lookAt(0,0,1);

export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);

export const sun_light = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( sun_light );

export const timer = new THREE.Timer();
timer.connect( document );

document.body.appendChild(renderer.domElement);




function OnResize(){
    var width = window.innerWidth;
    var height = window.innerHeight;

    renderer.setSize(width,height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();

    renderer.render(scene,camera);

}
window.addEventListener('resize', OnResize);

