const keyCodeMap = {
	left: 37,
	right: 39,
	a: 65,
	d: 68,
	SHIFT: 16,
};

export const movementState = {
	isMovingLeft: false,
	isMovingRight: false,
	isSprintingPressed: false,
};

function KeyPressed(event) {
	switch (event.keyCode) {
		case keyCodeMap['left']:
		case keyCodeMap['a']:
			movementState.isMovingLeft = true;
			break;
		case keyCodeMap['right']:
		case keyCodeMap['d']:
			movementState.isMovingRight = true;
			break;
		case keyCodeMap['SHIFT']:
			movementState.isSprintingPressed = true;
			break;
	}
}

function KeyReleased(event) {
	switch (event.keyCode) {
		case keyCodeMap['left']:
		case keyCodeMap['a']:
			movementState.isMovingLeft = false;
			break;
		case keyCodeMap['right']:
		case keyCodeMap['d']:
			movementState.isMovingRight = false;
			break;
		case keyCodeMap['SHIFT']:
			movementState.isSprintingPressed = false;
			break;
	}
}

window.addEventListener('keydown', KeyPressed, false);
window.addEventListener('keyup', KeyReleased, false);
