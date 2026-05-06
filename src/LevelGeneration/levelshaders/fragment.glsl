varying vec3 vNormal;
varying vec3 vWorldPos;


void main() {
    
    vec3 uLightDir = normalize(vec3(1.0,1.0,1.0));
    vec3 uLightColor = vec3(1.0);

    vec3 N = normalize(vNormal);
    vec3 L = normalize(uLightDir);

    float diff = max(dot(N, L), 0.0);

    vec3 color = vec3(0.0, 1.0, 0.0)* uLightColor * diff;

    gl_FragColor = vec4(color, 1.0);
}
