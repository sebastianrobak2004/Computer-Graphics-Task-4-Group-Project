varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vWorldPos;

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
  return fract(
      sin(vec3(dot(p, vec3(1.0, 57.0, 113.0)), dot(p, vec3(57.0, 113.0, 1.0)),
               dot(p, vec3(113.0, 1.0, 57.0)))) *
      43758.5453);
}

vec3 voronoi3d(const in vec3 x) {
  vec3 p = floor(x);
  vec3 f = fract(x);

  float id = 0.0;
  vec2 res = vec2(100.0);
  for (int k = -1; k <= 1; k++) {
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec3 b = vec3(float(i), float(j), float(k));
        vec3 r = vec3(b) - f + hash(p + b);
        float d = dot(r, r);

        float cond = max(sign(res.x - d), 0.0);
        float nCond = 1.0 - cond;

        float cond2 = nCond * max(sign(res.y - d), 0.0);
        float nCond2 = 1.0 - cond2;

        id = (dot(p + b, vec3(1.0, 57.0, 113.0)) * cond) + (id * nCond);
        res = vec2(d, res.x) * cond + res * nCond;

        res.y = cond2 * d + nCond2 * res.y;
      }
    }
  }

  return vec3(sqrt(res), abs(id));
}

void main() {

    vec3 pos = vPos.xyz;

    
    
    
    float e = 0.001;

    

    float n  = length(voronoi3d(pos * 4.0));

    float nx = length(voronoi3d((pos + vec3(e,0,0)) * 4.0));
    float ny = length(voronoi3d((pos + vec3(0,e,0)) * 4.0));
    float nz = length(voronoi3d((pos + vec3(0,0,e)) * 4.0));

    vec3 grad = vec3(
        nx - n,
        ny - n,
        nz - n
    );


    vec3 normal = normalize(vNormal - grad * 2.0);



    float mo = sin(pos.z * PI * 50.0);
    float ma = sin(pos.y * PI * 15.0);
    ma = ma * 0.5 + 0.5;
    mo = mo * 0.5 + 0.5;

    float msk = min(mo,ma);
    msk = smoothstep(0.001, 0.005 ,msk );

    float dx = dFdx(msk);
    float dy = dFdy(msk);

    float str = 10.0;

    normal = normalize(
            normal
            - vec3(dx,dy,0.0) * str
    );

    vec3 V = normalize(cameraPosition - vWorldPos);

    float fresnel = pow(0.8 - max(dot(normal,V),0.0), 2.0);

    
    vec3 color = vec3(1.0) * fresnel;

    gl_FragColor = vec4(color, 1.0);
}
