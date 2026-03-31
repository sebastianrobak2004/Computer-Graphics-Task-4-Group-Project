import * as THREE from 'three';
import { registerFunctionForSetup, scene, timer } from './sceneManager.js';

const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false });
const epsilon = 0.01;
const enableLogs = true;

export const startLevelGeneration = () => {
    const level = new THREE.Group();
    const ring = createRingMesh();
    const scaleVec = new THREE.Vector3;
    
    const MAX_RINGS = 16;
    const SPEED = 2;
    let derivedRadius = 1;

    ring.scale.set(epsilon,epsilon,1);
    level.scale.set(1,1,1);
    
    level.rotateX(Math.PI/2);
    level.position.y -= 35;

    scene.add(level);
    
    const levelUpdate = () => {
        const delta = timer.getDelta();
        const growth = (SPEED * delta )
        const multiplier = 1 + growth;
        derivedRadius *= multiplier;
        
        if (derivedRadius >= 2){
            const cur = ring.clone();
            const proceduralList = generateProceduralRing(8);

            const segments = [...cur.children]; // remove segments using procedural bool list
            segments.forEach((segment, i) => {
                if (proceduralList[i]) {
                    cur.remove(segment);
                }
            });
            const overshoot = derivedRadius - 1;
            //log("overshoot = ", overshoot)

            level.add(cur);
            cur.scale.set((epsilon * overshoot)/level.scale.x, (epsilon * overshoot)/level.scale.y , 1);

            derivedRadius = 1;
            if (level.children.length > MAX_RINGS ){
                level.remove(level.children[0]);
            }
        }
        scaleVec.set(multiplier, multiplier, 1);
        level.scale.multiply(scaleVec);
        //log("Length of rings", level.children.length );
        //log("length of Scene.Children", scene.children.length);
    }

    registerFunctionForSetup(levelUpdate);
}


function generateProceduralRing(divisions){
    const list = Array.from({ length: divisions }, () => Math.random() < 0.5);
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

function log(string, value){
    if (!enableLogs) return;

        console.log(`${string} : ${value}`);
}
    

