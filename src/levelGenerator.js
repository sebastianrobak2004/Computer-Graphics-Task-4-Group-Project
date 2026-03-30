import * as THREE from 'three';
import { registerFunctionForSetup, scene, timer } from './sceneManager.js';

const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false });
const epsilon = 0.01;

export const startLevelGeneration = () => {
    
    
       
   
    const ring = createRingMesh();
    const level = new THREE.Group();
    const maximumRings = 10;

    ring.scale.set(epsilon,epsilon,10);
    ring.rotateZ(Math.PI/2)


    scene.add(level);

    
    
    let radius = 1;
    

    const levelUpdate = () => {


        const delta = timer.getDelta();
        const m = (0.5 * delta )
        const mult = 1 + m;
        radius += m;

        if (radius > 2){
            const cur = ring.clone();
            const randL = decideSegments(8);

            cur.children.forEach((segment, i) => {
                if (randL[i]) {
                    cur.remove(segment);
                }
            });


            level.add(cur);
            radius = 1;
            if (level.children.length > maximumRings ){
                level.remove(level.children[0]);
            }
        }

        level.children.forEach( curRing =>{
            curRing.scale.multiply(new THREE.Vector3(mult, mult, 1));
        })

        
           
    }

    
    registerFunctionForSetup(levelUpdate);
}

function decideSegments(divisions){
    const list = Array.from({ length: divisions }, () => Math.random() < 0.99);
    return list
}
function createRingMesh({
    divisions = 8,

} = {} ){
    

    const angleIncrement = (2 * Math.PI) / divisions;
    const segmentGeometrys = [];
    

    for (let i = 1; i <= divisions; i++) {

        segmentGeometrys.push( createDonutSlice({startAngle: angleIncrement * i, endAngle: angleIncrement * ( i + 1 )}) );
    }

    const ring = new THREE.Group();
    
    segmentGeometrys.forEach( segment => {
        const mesh = new THREE.Mesh(segment, mat);
        ring.add(mesh);

    });
    
    return ring;
};

function createDonutSlice({
    innerRadius = 1,
    outerRadius = 2,
    startAngle = 0,
    endAngle = Math.PI / 2,
    segments = 4,
    depth = 0.5,          
    bevelEnabled = false
} = {}) {
    const shape = new THREE.Shape();

    shape.absarc(0, 0, outerRadius, startAngle, endAngle, false, segments);

    shape.lineTo(
        Math.cos(endAngle) * innerRadius,
        Math.sin(endAngle) * innerRadius
    );

    shape.absarc(0, 0, innerRadius, endAngle, startAngle, true, segments);

    shape.lineTo(
        Math.cos(startAngle) * outerRadius,
        Math.sin(startAngle) * outerRadius
    );

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: depth,
        bevelEnabled: bevelEnabled,
        curveSegments: segments
    });

    return geometry;
}
