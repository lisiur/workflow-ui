import { Drawable } from './drawable';
import { Vec2 } from './math/vec2';
import { CanvasEvent, CanvasEventType, EventStore } from './event';
import { Rect } from './math/rect';
export declare abstract class Widget implements Drawable {
    private _zIndex;
    protected eventStore: EventStore;
    draggable: boolean;
    droppable: boolean;
    private stateMachine;
    protected constructor();
    get zIndex(): number;
    setZIndex(zIndex: number): void;
    setDraggable(flag: boolean): void;
    setDroppable(flag: boolean): void;
    abstract get bbox(): Rect;
    initDefaultListeners(): void;
    abstract contains(v: Vec2): boolean;
    abstract translate(v: Vec2): void;
    abstract draw(ctx: CanvasRenderingContext2D): void;
    handleEvent(event: CanvasEvent): boolean;
    addEventListener(eventName: CanvasEventType, handler: (event: CanvasEvent) => void): void;
}
