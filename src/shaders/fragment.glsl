varying vec3 vWorldPos;
varying vec3 vNormal;

uniform float u_time;

#define PI 3.141593


// voronoi noise based on @patriciogv in https://thebookofshaders.com/edit.php#12/vorono-01.frag
vec2 random2(vec2 p){
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

vec2 voronoiFlat(vec2 p){
    
    vec2 pi = floor(p);

    vec2 pf = fract(p);

    float m_dist = 10.0;
    vec2 m_point;

    for (int j=-1; j<=1; j++ ) {
        for (int i=-1; i<=1; i++ ) {
            vec2 neighbor = vec2(float(i),float(j));
            vec2 point = random2(pi+ neighbor);
            point = 0.5 + 0.5*sin(6.2831*point);
            vec2 diff = neighbor + point - pf;
            float dist = length(diff);

            if( dist < m_dist ) {
                m_dist = dist;
                m_point = point;
            }
        }
    }

    return vec2(m_point.x/2.0+m_point.y/2.0, 0.0);
}

void main() {
    
    
    vec2 pos = vWorldPos.xz;

    float noise = voronoiFlat(pos * 0.1).x;


    float ndx = dFdx(noise);
    float ndy = dFdy(noise);

    vec3 bump = vec3(-ndx, -ndy, 0.0);
    bump = bump - vNormal * dot(bump, vNormal);

    vec3 normal = normalize(vNormal + bump * 2.0);    
        
    //pos += noise * 2.5;

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
