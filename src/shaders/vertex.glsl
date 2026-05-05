varying vec3 vPos;

void main() {
    vPos = position; // local space position (center = 0,0,0)

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
