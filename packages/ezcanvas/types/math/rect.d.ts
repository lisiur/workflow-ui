import { Vec2 } from './vec2';
export declare class Rect {
    x: number;
    y: number;
    w: number;
    h: number;
    static from_center(center: Vec2, width: number, height?: number): Rect;
    static from_two_points(p1: Vec2, p2: Vec2): Rect;
    constructor(x: number, y: number, w: number, h: number);
    get endX(): number;
    get endY(): number;
    get center(): Vec2;
    get leftTop(): Vec2;
    get bottomRight(): Vec2;
    get leftCenter(): Vec2;
    get rightCenter(): Vec2;
    expand(px: number): Rect;
    containsPoint(point: Vec2): boolean;
}
