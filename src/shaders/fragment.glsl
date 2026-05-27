varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec2 vUv;

uniform float u_time;
uniform sampler2D u_rockMap;

#define PI 3.141593

void main() {

    vec2 pos = vWorldPos.xz;

    vec3 baseNormal = texture2D(u_rockMap, vUv * 10.0).xyz * 2.0 - 1.0;
    baseNormal *= 0.1;

    vec3 N = normalize(vNormal);
    vec3 T = normalize(vec3(1.0, 0.0, 0.0));
    vec3 B = normalize(cross(N, T));
    mat3 TBN = mat3(T, B, N);

    vec3 normal = normalize(TBN * baseNormal);

    float a = atan(pos.x, pos.y);
    float dst = length(pos);

    a += PI - PI / 16.0;

    float mo = sin(a * 8.0);
    mo = mo * 0.5 + 0.5;

    float ma = sin(dst * 0.2);
    ma = ma * 0.5 + 0.5;

    float mask = min(mo, ma);
    mask = smoothstep(0.001, 0.005, mask);

    float dx = dFdx(mask);
    float dy = dFdy(mask);

    vec3 tiles = vec3(dx, dy, 0.0) * 10.0;

    tiles = tiles - normal * dot(tiles, normal);

    normal = normalize(normal + tiles);

    vec3 uLightPos = vec3(0.0, 10.0, 0.0);

    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 L = normalize(uLightPos - vWorldPos);

    float fresnel = pow(1.0 - max(dot(normal, V), 0.0), 2.0);

    vec3 color = vec3(1.0) * fresnel;

    gl_FragColor = vec4(color, 1.0);
}
