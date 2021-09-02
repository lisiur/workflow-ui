import { Vec2, Rect } from 'ezcanvas';
import { NodeWidget } from './nodeWidget';
export declare class CollectorWidget extends NodeWidget {
    static Width: number;
    static Height: number;
    constructor(center: Vec2, zIndex?: number);
    get type(): string;
    get outputAnchorLinkable(): boolean;
    get inputAnchorLinkable(): boolean;
    get bbox(): Rect;
    contains(point: Vec2): boolean;
    drawBorder(ctx: CanvasRenderingContext2D): void;
    drawNode(ctx: CanvasRenderingContext2D): void;
}
