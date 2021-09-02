import { CanvasEvent } from './event';
import { Widget } from './widget';
import { Vec2 } from './math/vec2';
declare enum WidgetState {
    Normal = 0,
    Hover = 1,
    DragStart = 2,
    Drag = 3,
    DragOver = 4
}
export declare class WidgetStateMachine {
    widget: Widget;
    static dragging: boolean;
    static dragPayload: {
        prevPosition: Vec2;
        origin: Widget | null;
    };
    private stateMachine;
    private prevPointerPosition;
    private prevPointerIncludeInWidget;
    constructor(widget: Widget);
    get state(): WidgetState;
    handleEvent(event: CanvasEvent): null | CanvasEvent;
}
export {};
