varying vec3 vWorldPos;

void main() {
    float scale = .1;

    vec3 grid = floor(vWorldPos * scale);
    float checker = mod(grid.x + grid.y + grid.z, 2.0);

    float dst = length(vWorldPos);

    float cmsk = step(dst, 0.01);
    

    vec3 color = mix(vec3(cmsk + 0.1)*.2, vec3(dst/1000.0)*1.5, checker);
    gl_FragColor = vec4(color, 1.0);
}
