uniform sampler2D tDiffuse;
uniform vec2 u_texel;
uniform vec2 u_shape;
uniform float u_brightness;

varying vec2 vUv;


#define SIG 0.5

// from https://mini.gmshaders.com/p/gamma
//Decode sRGB to linear
vec3 SRGB_decode(vec3 srgb)
{
    return mix(
        srgb / 12.92,
        pow((srgb + 0.055) / 1.055, vec3(2.4)),
        step(0.04045, srgb)
    );
}

//Encode linear to sRGB
vec3 SRGB_encode(vec3 lrgb)
{
    return mix(
        12.92 * lrgb,
        1.055 * pow(lrgb, vec3(1.0 / 2.4)) - 0.055,
        step(0.0031308, lrgb)
    );
}

// Hable 2010, "Filmic Tonemapping Operators"
vec3 Tonemap_tanh(vec3 x)
{
    x = clamp(x, -40.0, 40.0);
    vec3 exp_neg_2x = exp(-2.0 * x);
    return -1.0 + 2.0 / (1.0 + exp_neg_2x);
}


//based on https://github.com/vispy/experimental/blob/master/fsaa/ssaa.glsl by @vispy
float gaussian(float x, float s) {
    return exp(-(x*x) / (2.0*s*s));
}

vec4 sampleSSAA(sampler2D tex, vec2 p){
    float sigma = SIG;
    vec2 pos = p;
    
    vec4 color1 = vec4(0.0, 0.0, 0.0, 0.0); 
    
    float dx = 1.0/u_shape.x;
    float dy = 1.0/u_shape.y;

    float c = 0.;
    
    int sze = 3;
    for (int y=-sze; y<sze+1; y++)
    {
        for (int x=-sze; x<sze+1; x++)
        {   
            float k = gaussian(float(x), sigma) * gaussian(float(y), sigma);
            vec2 dpos = vec2(float(x)*dx, float(y)*dy);
            color1 += texture2D(tex, pos+dpos) * k;
            c += k;
        }
    }

    return color1 / c;
}

vec3 checkHDR(vec3 c){
    float m = step(3.0,length(c));
    return c * (1.0-m) + vec3(0.0,1.0,0.0) * m ;
}

void main() {


    vec4 color = sampleSSAA(tDiffuse, vUv); 
    //color *= 20.;
    
    color.xyz = Tonemap_tanh(color.xyz);
    color.xyz = SRGB_encode(color.xyz);
    //color *= 50.0;
    //color *= 0.85;
    
    
   
    

    
    
    gl_FragColor = color;
}
