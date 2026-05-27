import * as THREE from 'three';
import { movementState } from './controls';
import { player } from './player';
import { camera } from './sceneManager';
import { ringGeometryOuterRadius } from './ring';
import { gameData, startSprint, stopSprint } from './gameManager';

// Constants
var effectiveSpeed = 0.03;

const SPRINT_SPEED = 0.045;
const WALK_SPEED = 0.03;

const FACTOR = 0.3;


const SPRINT_SPEED_MULTIPLIER = 1.5;

let playerAngle = 0;

export function doMove() {
	if (movementState.isSprintingPressed) {
		startSprint();
	} else {
		stopSprint();
	}

	if (gameData.isSprintingActive) {
		effectiveSpeed = lerp(effectiveSpeed, SPRINT_SPEED, FACTOR);
    }else{
        effectiveSpeed = lerp(effectiveSpeed, WALK_SPEED, FACTOR);
    }

    if (movementState.isMovingLeft || movementState.isMovingRight ){
        effectiveSpeed = lerp(effectiveSpeed, 0, FACTOR);
    }else{
        effectiveSpeed = lerp(effectiveSpeed, 0, FACTOR);
    }


	if (movementState.isMovingLeft) {
		playerAngle += effectiveSpeed;
	}

	if (movementState.isMovingRight) {
		playerAngle -= effectiveSpeed;
	}



	const newPos = new THREE.Vector3(
		ringGeometryOuterRadius * Math.cos(playerAngle),
		-21,
		ringGeometryOuterRadius * Math.sin(playerAngle),
	);

	camera.position.x = newPos.x;
	camera.position.y = newPos.y;
	camera.position.z = newPos.z;

	if (player) {
		player.position.x = newPos.x;
		player.position.y = newPos.y;
		player.position.z = newPos.z;
	}

	camera.lookAt(0, -25, 0);
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}
