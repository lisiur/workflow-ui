import { Vec2 } from './math/vec2';
export var CanvasEventType;
(function (CanvasEventType) {
    CanvasEventType["GlobalMouseMove"] = "globalmousemove";
    CanvasEventType["MouseMove"] = "mousemove";
    CanvasEventType["MouseUp"] = "mousedown";
    CanvasEventType["MouseDown"] = "mouseup";
    CanvasEventType["MouseEnter"] = "mouseenter";
    CanvasEventType["MouseLeave"] = "mouseleave";
    CanvasEventType["Contextmenu"] = "contextmenu";
    CanvasEventType["DblClick"] = "dblclick";
    CanvasEventType["DragStart"] = "dragstart";
    CanvasEventType["Drag"] = "drag";
    CanvasEventType["DragEnd"] = "dragend";
    CanvasEventType["DragEnter"] = "dragenter";
    CanvasEventType["DragOver"] = "dragover";
    CanvasEventType["DragLeave"] = "dragleave";
    CanvasEventType["Drop"] = "drop";
})(CanvasEventType || (CanvasEventType = {}));
export class CanvasEvent {
    active;
    constructor() {
        this.active = true;
    }
    stopPropagation() {
        this.active = false;
    }
}
export class CanvasMouseEvent extends CanvasEvent {
    position;
    constructor(position) {
        super();
        this.position = position;
        this.position = position;
    }
}
export class CanvasDragDropEvent extends CanvasMouseEvent {
    offset;
    origin;
    constructor(position) {
        super(position);
        this.offset = new Vec2(0, 0);
        this.origin = null;
    }
    setOffset(offset) {
        this.offset = offset;
        return this;
    }
    setOrigin(widget) {
        this.origin = widget;
        return this;
    }
}
export class CanvasGlobalMouseMoveEvent extends CanvasMouseEvent {
    get type() {
        return CanvasEventType.GlobalMouseMove;
    }
}
export class CanvasMouseMoveEvent extends CanvasMouseEvent {
    get type() {
        return CanvasEventType.MouseMove;
    }
}
export class CanvasMouseEnterEvent extends CanvasMouseEvent {
    get type() {
        return CanvasEventType.MouseEnter;
    }
}
export class CanvasMouseLeaveEvent extends CanvasMouseEvent {
    get type() {
        return CanvasEventType.MouseLeave;
    }
}
export class CanvasMouseDownEvent extends CanvasMouseEvent {
    get type() {
        return CanvasEventType.MouseDown;
    }
}
export class CanvasMouseUpEvent extends CanvasMouseEvent {
    get type() {
        return CanvasEventType.MouseUp;
    }
}
export class CanvasContextmenuEvent extends CanvasMouseEvent {
    get type() {
        return CanvasEventType.Contextmenu;
    }
}
export class CanvasDblClickEvent extends CanvasMouseEvent {
    get type() {
        return CanvasEventType.DblClick;
    }
}
export class CanvasDragStartEvent extends CanvasDragDropEvent {
    get type() {
        return CanvasEventType.DragStart;
    }
}
export class CanvasDragEvent extends CanvasDragDropEvent {
    get type() {
        return CanvasEventType.Drag;
    }
}
export class CanvasDragEndEvent extends CanvasDragDropEvent {
    get type() {
        return CanvasEventType.DragEnd;
    }
}
export class CanvasDragEnterEvent extends CanvasDragDropEvent {
    get type() {
        return CanvasEventType.DragEnter;
    }
}
export class CanvasDragOverEvent extends CanvasDragDropEvent {
    get type() {
        return CanvasEventType.DragOver;
    }
}
export class CanvasDragLeaveEvent extends CanvasDragDropEvent {
    get type() {
        return CanvasEventType.DragLeave;
    }
}
export class CanvasDropEvent extends CanvasDragDropEvent {
    get type() {
        return CanvasEventType.Drop;
    }
}
export class CanvasEventGenerator {
    canvas;
    transformPoint;
    constructor(canvas, transformPoint) {
        this.canvas = canvas;
        this.transformPoint = transformPoint;
        this.canvas = canvas;
        this.transformPoint = transformPoint;
    }
    async *listen() {
        const dom = this.canvas;
        let resolve;
        let promise = new Promise(r => resolve = r);
        dom.addEventListener('mousemove', e => {
            const { offsetX, offsetY } = e;
            const canvasPosition = this.transformPoint(offsetX, offsetY);
            resolve(new CanvasMouseMoveEvent(canvasPosition));
        });
        dom.addEventListener('mouseup', e => {
            const { offsetX, offsetY } = e;
            const canvasPosition = this.transformPoint(offsetX, offsetY);
            resolve(new CanvasMouseUpEvent(canvasPosition));
        });
        dom.addEventListener('mousedown', e => {
            const { offsetX, offsetY } = e;
            const canvasPosition = this.transformPoint(offsetX, offsetY);
            resolve(new CanvasMouseDownEvent(canvasPosition));
        });
        dom.addEventListener('contextmenu', e => {
            const { offsetX, offsetY } = e;
            const canvasPosition = this.transformPoint(offsetX, offsetY);
            resolve(new CanvasContextmenuEvent(canvasPosition));
        });
        dom.addEventListener('dblclick', e => {
            const { offsetX, offsetY } = e;
            const canvasPosition = this.transformPoint(offsetX, offsetY);
            resolve(new CanvasDblClickEvent(canvasPosition));
        });
        dom.addEventListener('mouseleave', e => {
        });
        dom.addEventListener('mouseenter', e => {
        });
        while (true) {
            yield (await promise);
            promise = new Promise(r => resolve = r);
        }
    }
}
export class EventStore {
    store;
    constructor() {
        this.store = new Map();
    }
    on(eventName, handler) {
        const handlers = this.store.get(eventName) ?? [];
        handlers.push({
            handler,
        });
        this.store.set(eventName, handlers);
    }
    dispatch(event) {
        const handlers = this.store.get(event.type) ?? [];
        for (let handler of handlers) {
            handler.handler(event);
        }
    }
}
