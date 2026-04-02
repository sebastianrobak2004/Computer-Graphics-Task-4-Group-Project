
const segments = 8;
const lastRing = [];

export const generateMask = (segments, lastRing) => {
    segments = segments;
    lastRing = lastRing;

    return randomMask(0.5);
}

const randomMask = (chance) => Array.from({ length: segments }, () => Math.random() < chance);

const proceduralMask = () => {
    return [];
}
