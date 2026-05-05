import * as THREE from 'three';
import { registerFunctionForSetup, scene, timer } from '../sceneManager.js';

import { generateMask } from './ringSegmentMask.js';
import { levelShad } from './ringShader.js';


const epsilon = 1;
const ringDivisions = 8;



export const startLevelGeneration = () => {
    
    const level = new THREE.Group();
    
    const ring = createRingMesh(ringDivisions);
    const scaleVec = new THREE.Vector3;
    
    const MAX_RINGS = 10;
    const MAX_SCALE = 1024;
    const SPEED = 1;

    let derivedRadius = 1;
    let currentLevel = null;

    ring.scale.set(epsilon,epsilon,1);
    level.scale.set(1,1,1);
    level.position.set(0,0,0);
    
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
            
            currentLevel = generateMask(ringDivisions, currentLevel);

            const segments = [...cur.children];
            segments.forEach((segment, i) => {
                if (!currentLevel[i]) {
                    cur.remove(segment);
                }
            });
            const adjustment = 2 / derivedRadius;


            level.add(cur);
            const inverseScale = 1 / level.scale.x;
            cur.scale.x = (epsilon * adjustment * inverseScale);
            cur.scale.y = (epsilon * adjustment * inverseScale);
            

            derivedRadius -= 1;
            if (level.children.length > MAX_RINGS ){
                level.remove(level.children[0]);
            }
        }
        scaleVec.set(multiplier, multiplier, 1);
        level.scale.multiply(scaleVec);
        
        if ( level.scale.x > MAX_SCALE ){
            const scaleDown = level.scale.x;

            level.children.forEach( child => {
                child.scale.multiply(new THREE.Vector3(scaleDown, scaleDown, 1));
            });

            level.scale.set(1 ,1 ,1 );


        }
    }

    registerFunctionForSetup(levelUpdate);
}

const createRingMesh = (Divisions) => {
    const angleIncrement = (2 * Math.PI) / Divisions;
    const segmentGeometries = [];

    for (let i = 1; i <= Divisions; i++) {
        segmentGeometries.push(
            createDonutSlice({
                startAngle: angleIncrement * i, 
                endAngle: angleIncrement * ( i + 1 )
            }));
    }

    const ring = new THREE.Group();
    segmentGeometries.forEach( segment => {
        const mesh = new THREE.Mesh(segment, levelShad);
        ring.add(mesh);

    });
    return ring;
};

const createDonutSlice = ({
    innerRadius = 1,
    outerRadius = 2,
    startAngle = 0,
    endAngle = Math.PI / 4,
    radialSegments = 2,
    angularSegments = 16,
    depth = 3
}) => {
    const positions = [];
    const indices = [];

    const vertsPerRow = angularSegments + 1;
    const layerSize = (radialSegments + 1) * vertsPerRow;

    for (let z = 0; z <= 1; z++) {
        const zPos = z * depth;
        for (let r = 0; r <= radialSegments; r++) {
            const radius = THREE.MathUtils.lerp(innerRadius, outerRadius, r / radialSegments);
            for (let a = 0; a <= angularSegments; a++) {
                const angle = THREE.MathUtils.lerp(startAngle, endAngle, a / angularSegments);
                positions.push(Math.cos(angle) * radius, Math.sin(angle) * radius, zPos);
            }
        }
    }

    for (let r = 0; r < radialSegments; r++) {
        for (let a = 0; a < angularSegments; a++) {
            const i  = r * vertsPerRow + a;
            const a0 = i,          a1 = i + 1;
            const b0 = i + vertsPerRow, b1 = i + vertsPerRow + 1;
            indices.push(a0, a1, b0);  
            indices.push(a1, b1, b0);
        }
    }

    
    for (let r = 0; r < radialSegments; r++) {
        for (let a = 0; a < angularSegments; a++) {
            const i  = layerSize + r * vertsPerRow + a;
            const a0 = i,          a1 = i + 1;
            const b0 = i + vertsPerRow, b1 = i + vertsPerRow + 1;
            indices.push(a0, b0, a1);  
            indices.push(a1, b0, b1);
        }
    }

    const addSideQuad = (f0, f1, b0, b1) => {
        indices.push(f0, f1, b0);
        indices.push(f1, b1, b0);
    };

    for (let a = 0; a < angularSegments; a++) {
        const fBase = radialSegments * vertsPerRow;
        const f0 = fBase + a,             f1 = fBase + a + 1;
        const b0 = layerSize + fBase + a, b1 = layerSize + fBase + a + 1;
        addSideQuad(f0, f1, b0, b1);  
    }

    for (let a = 0; a < angularSegments; a++) {
        const f0 = a,              f1 = a + 1;
        const b0 = layerSize + a,  b1 = layerSize + a + 1;
        addSideQuad(f0, b0, f1, b1); 
    }

    for (let r = 0; r < radialSegments; r++) {
        const f0 = r * vertsPerRow;
        const f1 = (r + 1) * vertsPerRow;
        const b0 = layerSize + f0;
        const b1 = layerSize + f1;
        addSideQuad(f0, f1, b0, b1); 
    }

    for (let r = 0; r < radialSegments; r++) {
        const f0 = r * vertsPerRow + angularSegments;
        const f1 = (r + 1) * vertsPerRow + angularSegments;
        const b0 = layerSize + f0;
        const b1 = layerSize + f1;
        addSideQuad(f0, b0, f1, b1);  
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
};
