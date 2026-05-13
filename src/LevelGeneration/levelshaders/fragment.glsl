varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vWorldPos;

uniform float u_time;

#define PI 3.141593




float voroMask(vec3 p) {
    float m1 = sin(p.z * PI * 15.0);
    float m2 = sin(p.y * PI * 2.0);

    m1 = m1 * 0.5 + 0.5;
    m2 = m2 * 0.5 + 0.5;

    return min(m1, m2);
}


void main() {

    vec3 pos = vPos * 4.0;

    vec3 normal = normalize(vNormal);

    float msk = voroMask(pos);

    float w = fwidth(msk);
    msk = smoothstep(0.05 - w, 0.05 + w, msk);

    float dx = dFdx(msk);
    float dy = dFdy(msk);

    normal = normalize(normal - vec3(dx, dy, 0.0) * 8.0);

    vec3 V = normalize(cameraPosition - vWorldPos);

    float fresnel = pow(1.0 - max(dot(normal, V), 0.0), 2.0);

    vec3 color = vec3(0.1,0.0,0.0) * (fresnel) * 0.8;

    gl_FragColor = vec4(color, 1.0);
}
