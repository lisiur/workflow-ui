import { Layer, Rect, Vec2, Widget } from 'ezcanvas';
export declare enum NodeState {
    Normal = 0,
    Hover = 1,
    AnchorDrag = 2,
    AnchorDragOver = 3
}
export declare enum NodeEvent {
    MouseEnter = 0,
    MouseLeave = 1,
    AnchorDragStart = 2,
    AnchorDrag = 3,
    AnchorDragEnd = 4
}
export declare abstract class NodeWidget extends Widget {
    static Grid: number;
    static Border: number;
    static DragOrigin: NodeWidget | null;
    static DragTarget: NodeWidget | null;
    abstract get type(): string;
    abstract get inputAnchorLinkable(): boolean;
    abstract get outputAnchorLinkable(): boolean;
    abstract get bbox(): Rect;
    private readonly inputAnchor;
    private readonly outputAnchor;
    protected center: Vec2;
    private state;
    protected trendCenter: Vec2;
    private border;
    private layer;
    protected constructor(center: Vec2, zIndex?: number);
    init(): void;
    translate(v: Vec2): void;
    linkTo(node: NodeWidget): void;
    abstract drawNode(ctx: CanvasRenderingContext2D): void;
    abstract drawBorder(ctx: CanvasRenderingContext2D): void;
    private get canDrawAnchor();
    get inputAnchorPosition(): Vec2;
    get outputAnchorPosition(): Vec2;
    addTo(layer: Layer): void;
    remove(): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
