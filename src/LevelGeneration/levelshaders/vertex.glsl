varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
    float uHeightScale = 0.8;
    float depth = 0.1;

    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;

    float dist = length(worldPos.xz);

    vec3 displacedNormal = normal;

    if (position.z < depth) {
        worldPos.y += dist * uHeightScale;

        if (dist > 0.0001) {
            vec2 grad = (worldPos.xz / dist) * uHeightScale;
            displacedNormal -= vec3(grad.x, 0.0, grad.y);
        }
    }

    vNormal = normalize(mat3(transpose(inverse(modelMatrix))) * displacedNormal);
    vPos = position;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
