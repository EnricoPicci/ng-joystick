
export const distance = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    return Math.sqrt((dx * dx) + (dy * dy));
};

export const angle = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    return degrees(Math.atan2(dy, dx));
};

export const findCoord = (p: {x: number, y: number}, dist: number, aDegrees: number) => {
    const aRadians = radians(aDegrees);
    const x = p.x - dist * Math.cos(aRadians);
    const y = p.y - dist * Math.sin(aRadians);
    return {x, y};
};

export const radians = (aDegrees: number) => {
    return aDegrees * (Math.PI / 180);
};

export const degrees = (aRadians) => {
    return aRadians * (180 / Math.PI);
};

