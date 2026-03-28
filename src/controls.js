const keyCodeMap = {
	w: 38,
	s: 40,
	a: 37,
	d: 39,
	SHIFT: 16,
	CTRL: 17,
	SPACE: 32,
};

export const movementState = {
	isMovingForward: false,
	isMovingBackward: false,
	isMovingLeft: false,
	isMovingRight: false,
	isTurningLeft: false,
	isTurningRight: false,
	isRising: false,
	isFalling: false,
};

function KeyPressed(event) {
	switch (event.keyCode) {
		case keyCodeMap['w']:
			movementState.isMovingForward = true;
			break;
		case keyCodeMap['s']:
			movementState.isMovingBackward = true;
			break;
		case keyCodeMap['a']:
			movementState.isMovingLeft = true;
			break;
		case keyCodeMap['d']:
			movementState.isMovingRight = true;
			break;
		case keyCodeMap['SPACE']:
			movementState.isRising = true;
			break;
		case keyCodeMap['SHIFT']:
			movementState.isFalling = true;
			break;
	}
}

function KeyReleased(event) {
	switch (event.keyCode) {
		case keyCodeMap['w']:
			movementState.isMovingForward = false;
			break;
		case keyCodeMap['s']:
			movementState.isMovingBackward = false;
			break;
		case keyCodeMap['a']:
			movementState.isMovingLeft = false;
			break;
		case keyCodeMap['d']:
			movementState.isMovingRight = false;
			break;
		case keyCodeMap['SPACE']:
			movementState.isRising = false;
			break;
		case keyCodeMap['SHIFT']:
			movementState.isFalling = false;
			break;
	}
}

window.addEventListener('keydown', KeyPressed, false);
window.addEventListener('keyup', KeyReleased, false);
