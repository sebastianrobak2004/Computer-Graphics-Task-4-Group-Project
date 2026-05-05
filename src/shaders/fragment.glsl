varying vec3 vPos;
varying vec2 vUv;
uniform float u_time;

#define PI 3.141

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main() {
    float dist = length(vPos);

    float angle = atan(vPos.z, vPos.x);
    float angle01 = (angle + 3.14159265) / (3.0 * 3.14159265);

    float radial = (sin(dist * 0.1) + 1.0) / 2.0;

    float spiral = sin(angle * 5.0 + dist * 2.0);

    gl_FragColor = vec4(vec3(angle), 0.8);
}
