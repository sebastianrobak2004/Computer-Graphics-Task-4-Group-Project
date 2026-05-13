varying vec3 vWorldPos;
varying vec3 vNormal;

uniform float u_time;

#define PI 3.141593



//voronoi noise by Max bittker  https://github.com/MaxBittker/glsl-voronoi-noise/blob/master/2d.glsl
const mat2 myt = mat2(.12121212, .13131313, -.13131313, .12121212);
const vec2 mys = vec2(1e4, 1e6);

vec2 rhash(vec2 uv) {
  uv *= myt;
  uv *= mys;
  return fract(fract(uv / mys) * uv);
}

vec3 hash(vec3 p) {
  return fract(sin(vec3(dot(p, vec3(1.0, 57.0, 113.0)),
                        dot(p, vec3(57.0, 113.0, 1.0)),
                        dot(p, vec3(113.0, 1.0, 57.0)))) *
               43758.5453);
}

float voronoi2d(const in vec2 point) {
  vec2 p = floor(point);
  vec2 f = fract(point);
  float res = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 b = vec2(i, j);
      vec2 r = vec2(b) - f + rhash(p + b);
      res += 1. / pow(dot(r, r), 8.);
    }
  }
  return pow(1. / res, 0.0625);
}

#pragma glslify: export(voronoi2d)

void main() {
    
    
    vec2 pos = vWorldPos.xz;

    float noise = voronoi2d(pos * 0.1);


    float ndx = dFdx(noise);
    float ndy = dFdy(noise);

    vec3 bump = vec3(-ndx, -ndy, 0.0);
    bump = bump - vNormal * dot(bump, vNormal);

    vec3 normal = normalize(vNormal + bump * 2.0);    
        
    pos += noise * 2.5;

    float a = atan(pos.x, pos.y);
    float dst = length(pos);
    

    a += PI - PI/16.0;

    float mo =
        sin(a * 8.0);

    mo = mo * 0.5 + 0.5;
    
    float logDst = log(dst);
    float ma = sin(dst * 0.2);

    ma = ma * 0.5 + 0.5;


    float mask = min(mo, ma);

    mask = smoothstep(0.001, 0.005, mask);


    float dx = dFdx(mask);
    float dy = dFdy(mask);

    float strength = 10.0;

    normal = normalize(
        normal
        - vec3(dx, dy, 0.0) * strength
    );

    vec3 uLightPos = vec3(0.,10.,0.);
    vec3 uLightColor = vec3(1.0);

    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 L = normalize(uLightPos - vWorldPos);
    vec3 H = normalize(L+V);

    float fresnel = pow(0.8 -max(dot(normal, V), 0.0), 2.0);
   
    vec3 color = vec3(0.0, 0.0, 0.0);


    color += vec3(1.0) * fresnel;



    gl_FragColor = vec4(color, 1.0);
}
