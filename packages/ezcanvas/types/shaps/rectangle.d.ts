import { Color } from '../color';
import { Vec2 } from '../math/vec2';
import { Style } from '../style';
import { Drawable } from '../drawable';
interface RectangleStyle extends Style {
    bgColor?: Color;
    borderColor?: Color;
    border?: number;
    borderRadius?: number;
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
    borderBottomLeftRadius?: number;
    borderBottomRightRadius?: number;
}
declare class RectangleStyle implements Style {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor();
}
export declare class Rectangle implements Drawable {
    private readonly style;
    constructor();
    setPosition(position: Vec2): Rectangle;
    setWidth(w: number): Rectangle;
    setHeight(h: number): Rectangle;
    setStyle<T extends keyof RectangleStyle>(k: T, v: RectangleStyle[T]): Rectangle;
    draw(ctx: CanvasRenderingContext2D): void;
}
export {};
