
const segments = 8;
const lastRing = [];

export const generateMask = (segments, lastRing) => {
    segments = segments;
    lastRing = lastRing;

    return randomMask(0.5);
}

const randomMask = (chance) => {
    
    const list = Array.from({ length: segments }, () => Math.random() < 0.50);
    return list;

}

const proceduralMask = () => {
    return [];
}
