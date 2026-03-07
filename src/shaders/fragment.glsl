uniform vec2 u_resolution;
varying vec2 vUv;

void main() {
    
    vec2 st = vUv/u_resolution;

    gl_FragColor = vec4( st, 0.0 , 1.0);
}
