export declare class Vec2 {
    x: number;
    y: number;
    constructor(x: number, y: number);
    add(v: Vec2): Vec2;
    sub(v: Vec2): Vec2;
    addSelf(v: Vec2): Vec2;
    clone(): Vec2;
}
