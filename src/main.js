import * as THREE from 'three';
import { scene, camera, renderer } from './scene_manager.js';
import { floor_mesh } from './floor.js';
import { camera_controls } from './controls.js';


scene.add(floor_mesh);

camera.position.set(0,0,-10);
camera.lookAt(0,-10,1);


function animate() {
    requestAnimationFrame( animate );

    
    renderer.render(scene, camera);
};

function move_camera() {
    if(camera_controls.foward){
        console.log("foward");
    };

    if(camera_controls.backward){
        console.log("b");
    };

    if(camera_controls.left){

    };

    if(camera_controls.right){
        
    };

    if(camera_controls.rise){

    };

    if(camera_controls.fall){

    };

    if(camera_controls.look_right){

    };

    if(camera_controls.look_left){

    };
    
};

animate();

