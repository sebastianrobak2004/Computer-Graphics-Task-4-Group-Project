uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {
    vec3 col = texture2D(tDiffuse, vUv).rgb;
    gl_FragColor = vec4(col, 1.0);
}
