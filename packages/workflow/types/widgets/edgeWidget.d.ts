import { Widget, Vec2, Rect, Layer } from 'ezcanvas';
import { NodeWidget } from './nodeWidget';
export declare class EdgeWidget extends Widget {
    private fromNode;
    private toNode;
    private _toPosition;
    private layer;
    constructor(fromNode: NodeWidget, toNode?: NodeWidget | null);
    get fromPosition(): Vec2;
    get toPosition(): Vec2;
    addTo(layer: Layer): void;
    setToPosition(position: Vec2): EdgeWidget;
    contains(v: Vec2): boolean;
    draw(ctx: CanvasRenderingContext2D): void;
    translate(v: Vec2): void;
    get bbox(): Rect;
}
