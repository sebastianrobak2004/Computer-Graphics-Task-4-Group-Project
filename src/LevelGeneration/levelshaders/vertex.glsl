varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
    float uHeightScale = 0.3;
    float depth = .1;
    
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    float dist = length(worldPos.xz);
    
    // Only move verts that are on the top face (local z = depth)
    if (position.z < depth) {
        worldPos.y += dist * uHeightScale;
    }
    
    vNormal = normalize(normalMatrix * normal);
    vWorldPos = worldPos.xyz;
    
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
