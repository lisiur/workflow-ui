import { Vec2 } from '../math/vec2';
import { Drawable } from '../drawable';
export declare class BezierCurve3 implements Drawable {
    private from;
    private to;
    constructor(from: Vec2, to: Vec2);
    setFrom(from: Vec2): void;
    setTo(to: Vec2): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
