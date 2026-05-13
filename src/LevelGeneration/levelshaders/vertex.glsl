varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {

    float uHeightScale = 0.6;
    float depth = 0.1;

    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;

    float dist = length(worldPos.xz);

    if(position.z < depth) {
        worldPos.y += dist * uHeightScale;
    }

    // MODEL SPACE
    vPos = position;
    vNormal = normalize(normal);

    gl_Position =
        projectionMatrix *
        viewMatrix *
        worldPos;
}
