
let segmentsNum = 8;
let lastR = [];

export const generateMask = (segments, lastRing) => {
    segmentsNum = segments;
    lastR = lastRing;

    return proceduralMask();
}

const randomMask = (chance) => Array.from({ length: segments }, () => Math.random() < chance);

const mod = (n, m) => ((n % m) + m) % m;


const proceduralMask = () => {
    if (lastR == null) {
        lastR = [false, false, false, false, false, false, true, true];
    }

    const reversed = Math.random() < 0.5;
    const working = reversed ? [...lastR].reverse() : [...lastR];

    const len = working.length;
    let nextR = new Array(len).fill(false);

    for (let i = 0; i < len; i++) {
        if (!working[i]) continue;
        const prevAlive = working[mod(i - 1, len)];
        const nextAlive = working[mod(i + 1, len)];
        const neighborCount = (prevAlive ? 1 : 0) + (nextAlive ? 1 : 0);
        const survivalChance = [1.0, 0.75, 0.35][neighborCount];
        nextR[i] = Math.random() < survivalChance;
        if (nextR[i]) {
            const spreadChance = neighborCount === 1 ? 0.65 : 0.3;
            if (!working[mod(i - 1, len)] && !nextR[mod(i - 1, len)]) {
                nextR[mod(i - 1, len)] = Math.random() < spreadChance;
            }
            if (!working[mod(i + 1, len)] && !nextR[mod(i + 1, len)]) {
                nextR[mod(i + 1, len)] = Math.random() < spreadChance;
            }
        }
    }

    if (!nextR.some(Boolean)) {
        const aliveLast = working.map((v, i) => v ? i : -1).filter(i => i !== -1);
        nextR[aliveLast[Math.floor(Math.random() * aliveLast.length)]] = true;
    }

    lastR = reversed ? nextR.reverse() : nextR;
    return lastR;
};
