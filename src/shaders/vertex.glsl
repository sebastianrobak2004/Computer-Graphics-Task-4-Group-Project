varying vec2 vUv;      
varying vec3 vNormal;
uniform float u_time;



void main() {
    vec3 pos = position;
    vUv = uv;
    
    
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
