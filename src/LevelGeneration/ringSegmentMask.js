
let segmentsNum = 8;
let lastR = [];

export const generateMask = (segments, lastRing) => {
    segmentsNum = segments;
    lastR = lastRing;

    return proceduralMask();
}

const randomMask = (chance) => Array.from({ length: segments }, () => Math.random() < chance);

const mod = (n, m) => ((n % m) + m) % m;
const randBool = () => Math.random() < 0.5 ? true : false;

const proceduralMask = () => {
    if(lastR == null){
        lastR = [false,false,false,false,false,false,true,true];
        console.log(lastR);
    }

    let nextR = [false,false,false,false,false,false,false,false];

    let first = true;
    //const dir = Math.random() < 0.5 ? 1 : -1;

    for (let i = 1; i < lastR.length; i += 1){
        const cur = lastR[i];
        const prev = lastR[mod(i + 1, lastR.length)];
        const next = lastR[mod(i - 1, lastR.length)];

        if(!cur){
            if(!first) first = true;
            continue;
        }

        if(first){
            nextR[i] = true;
            first = false;
        }else{
            nextR[i] = randBool();
        }

        if(nextR[i]){
            if(!prev) nextR[mod(i + 1, lastR.length)] = randBool();
            if(!next) nextR[mod(i - 1, lastR.length)] = randBool();
        }
    }
    
    console.log(nextR);
    return nextR;
}
