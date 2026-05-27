varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec2 vUv;




void main() {

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);


    vWorldPos = worldPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
