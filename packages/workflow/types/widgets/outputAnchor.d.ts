import { EdgeAnchor } from './edgeAnchor';
import { Rect, Vec2 } from 'ezcanvas';
import { NodeWidget } from './nodeWidget';
export declare class OutputAnchor extends EdgeAnchor {
    protected node: NodeWidget;
    private toPosition;
    private dragging;
    constructor(node: NodeWidget);
    get bbox(): Rect;
    translate(v: Vec2): void;
    setToPosition(v: Vec2): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
