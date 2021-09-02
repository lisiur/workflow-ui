import { Vec2 } from './math/vec2';
import { Widget } from './widget';
export declare enum CanvasEventType {
    GlobalMouseMove = "globalmousemove",
    MouseMove = "mousemove",
    MouseUp = "mousedown",
    MouseDown = "mouseup",
    MouseEnter = "mouseenter",
    MouseLeave = "mouseleave",
    Contextmenu = "contextmenu",
    DblClick = "dblclick",
    DragStart = "dragstart",
    Drag = "drag",
    DragEnd = "dragend",
    DragEnter = "dragenter",
    DragOver = "dragover",
    DragLeave = "dragleave",
    Drop = "drop"
}
export declare abstract class CanvasEvent {
    active: boolean;
    abstract get type(): CanvasEventType;
    protected constructor();
    stopPropagation(): void;
}
export declare abstract class CanvasMouseEvent extends CanvasEvent {
    position: Vec2;
    constructor(position: Vec2);
}
export declare abstract class CanvasDragDropEvent extends CanvasMouseEvent {
    offset: Vec2;
    origin: Widget | null;
    constructor(position: Vec2);
    setOffset(offset: Vec2): this;
    setOrigin(widget: Widget | null): this;
}
export declare class CanvasGlobalMouseMoveEvent extends CanvasMouseEvent {
    get type(): CanvasEventType;
}
export declare class CanvasMouseMoveEvent extends CanvasMouseEvent {
    get type(): CanvasEventType;
}
export declare class CanvasMouseEnterEvent extends CanvasMouseEvent {
    get type(): CanvasEventType;
}
export declare class CanvasMouseLeaveEvent extends CanvasMouseEvent {
    get type(): CanvasEventType;
}
export declare class CanvasMouseDownEvent extends CanvasMouseEvent {
    get type(): CanvasEventType;
}
export declare class CanvasMouseUpEvent extends CanvasMouseEvent {
    get type(): CanvasEventType;
}
export declare class CanvasContextmenuEvent extends CanvasMouseEvent {
    get type(): CanvasEventType;
}
export declare class CanvasDblClickEvent extends CanvasMouseEvent {
    get type(): CanvasEventType;
}
export declare class CanvasDragStartEvent extends CanvasDragDropEvent {
    get type(): CanvasEventType;
}
export declare class CanvasDragEvent extends CanvasDragDropEvent {
    get type(): CanvasEventType;
}
export declare class CanvasDragEndEvent extends CanvasDragDropEvent {
    get type(): CanvasEventType;
}
export declare class CanvasDragEnterEvent extends CanvasDragDropEvent {
    get type(): CanvasEventType;
}
export declare class CanvasDragOverEvent extends CanvasDragDropEvent {
    get type(): CanvasEventType;
}
export declare class CanvasDragLeaveEvent extends CanvasDragDropEvent {
    get type(): CanvasEventType;
}
export declare class CanvasDropEvent extends CanvasDragDropEvent {
    get type(): CanvasEventType;
}
export declare class CanvasEventGenerator {
    private readonly canvas;
    private readonly transformPoint;
    constructor(canvas: HTMLCanvasElement, transformPoint: (x: number, y: number) => Vec2);
    listen(): AsyncIterableIterator<CanvasEvent>;
}
declare type EventHandler = (e: CanvasEvent) => void;
export declare class EventStore {
    private store;
    constructor();
    on(eventName: string, handler: EventHandler): void;
    dispatch(event: CanvasEvent): void;
}
export {};
