varying vec3 vWorldPos;

void main() {
    vWorldPos = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
