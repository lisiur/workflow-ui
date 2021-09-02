import { Rect, Vec2, Widget } from 'ezcanvas';
import { NodeWidget } from './nodeWidget';
export declare abstract class EdgeAnchor extends Widget {
    protected node: NodeWidget;
    static AnchorSize: number;
    protected visible: boolean;
    constructor(node: NodeWidget);
    contains(v: Vec2): boolean;
    setVisible(visible: boolean): void;
    abstract translate(v: Vec2): void;
    abstract get bbox(): Rect;
    draw(ctx: CanvasRenderingContext2D): void;
}
