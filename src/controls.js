

export const camera_controls = {
    foward: false,
    backward: false,
    left: false,
    right: false,
    turn_left: false,
    turn_right: false,
    rise: false,
    fall: false,
};

// w: 38
// s: 30
// a: 37
// d: 39
// SHIFT: 16
// CTRL: 17
// SPACE: 32

function KeyPressed(event){
    switch(event.keyCode)
    {
        case 38: camera_controls.foward = true; break;
        case 40: camera_controls.backward = true; break;
        case 37: camera_controls.left = true; break;
        case 39: camera_controls.right = true; break;
        case 32: camera_controls.rise = true; break;
        case 16: camera_controls.fall = true; break;
    }
};

function KeyReleased(event){
    switch(event.keyCode)
    {
        case 38: camera_controls.foward = false; break;
        case 40: camera_controls.backward = false; break;
        case 37: camera_controls.left = false; break;
        case 39: camera_controls.right = false; break;
        case 32: camera_controls.rise = false; break;
        case 16: camera_controls.fall = false; break;
    }
};





window.addEventListener("keydown", KeyPressed, false );
window.addEventListener("keyup", KeyReleased, false );
