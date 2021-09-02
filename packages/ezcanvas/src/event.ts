import {Vec2} from './math/vec2'
import {Widget} from './widget'

export enum CanvasEventType {
    GlobalMouseMove = 'globalmousemove',
    MouseMove = 'mousemove',
    MouseUp = 'mousedown',
    MouseDown = 'mouseup',
    MouseEnter = 'mouseenter',
    MouseLeave = 'mouseleave',
    Contextmenu = 'contextmenu',
    DblClick = 'dblclick',
    DragStart = 'dragstart',
    Drag = 'drag',
    DragEnd = 'dragend',
    DragEnter = 'dragenter',
    DragOver = 'dragover',
    DragLeave = 'dragleave',
    Drop = 'drop'
}

export abstract class CanvasEvent {
    public active: boolean
    abstract get type(): CanvasEventType
    protected constructor() {
        this.active = true
    }
    stopPropagation() {
        this.active = false
    }
}

export abstract class CanvasMouseEvent extends CanvasEvent {
    constructor(public position: Vec2) {
        super()
        this.position = position
    }
}

export abstract class CanvasDragDropEvent extends CanvasMouseEvent {
    public offset: Vec2
    public origin: Widget | null
    constructor(position: Vec2) {
        super(position)
        this.offset = new Vec2(0, 0)
        this.origin = null
    }
    setOffset(offset: Vec2) {
        this.offset = offset
        return this
    }

    setOrigin(widget: Widget | null) {
        this.origin = widget
        return this
    }
}

export class CanvasGlobalMouseMoveEvent extends CanvasMouseEvent {
    get type() {
        return CanvasEventType.GlobalMouseMove
    }
}
export class CanvasMouseMoveEvent extends CanvasMouseEvent {
    get type() {
        return CanvasEventType.MouseMove
    }
}
export class CanvasMouseEnterEvent extends CanvasMouseEvent {
    get type() {
        return CanvasEventType.MouseEnter
    }
}
export class CanvasMouseLeaveEvent extends CanvasMouseEvent {
    get type() {
        return CanvasEventType.MouseLeave
    }
}
export class CanvasMouseDownEvent extends CanvasMouseEvent {
    get type() {
        return CanvasEventType.MouseDown
    }
}
export class CanvasMouseUpEvent extends CanvasMouseEvent {
    get type() {
        return CanvasEventType.MouseUp
    }
}
export class CanvasContextmenuEvent extends CanvasMouseEvent {
    get type() {
        return CanvasEventType.Contextmenu
    }
}
export class CanvasDblClickEvent extends CanvasMouseEvent {
    get type() {
        return CanvasEventType.DblClick
    }
}
export class CanvasDragStartEvent extends CanvasDragDropEvent {
    get type() {
        return CanvasEventType.DragStart
    }
}
export class CanvasDragEvent extends CanvasDragDropEvent {
    get type() {
        return CanvasEventType.Drag
    }
}
export class CanvasDragEndEvent extends CanvasDragDropEvent {
    get type() {
        return CanvasEventType.DragEnd
    }
}
export class CanvasDragEnterEvent extends CanvasDragDropEvent {
    get type() {
        return CanvasEventType.DragEnter
    }
}
export class CanvasDragOverEvent extends CanvasDragDropEvent {
    get type() {
        return CanvasEventType.DragOver
    }
}
export class CanvasDragLeaveEvent extends CanvasDragDropEvent {
    get type() {
        return CanvasEventType.DragLeave
    }
}
export class CanvasDropEvent extends CanvasDragDropEvent {
    get type() {
        return CanvasEventType.Drop
    }
}

export class CanvasEventGenerator {
    constructor(private readonly canvas: HTMLCanvasElement, private readonly transformPoint: (x: number, y: number) => Vec2) {
        this.canvas = canvas
        this.transformPoint = transformPoint
    }
    async* listen (): AsyncIterableIterator<CanvasEvent> {
        const dom = this.canvas
        let resolve!: any
        let promise = new Promise<CanvasEvent>(r => resolve = r)
        dom.addEventListener('mousemove', e => {
            const {offsetX, offsetY} = e
            const canvasPosition = this.transformPoint(offsetX, offsetY)
            resolve(new CanvasMouseMoveEvent(canvasPosition))
        })
        dom.addEventListener('mouseup', e => {
            const {offsetX, offsetY} = e
            const canvasPosition = this.transformPoint(offsetX, offsetY)
            resolve(new CanvasMouseUpEvent(canvasPosition))
        })
        dom.addEventListener('mousedown', e => {
            const {offsetX, offsetY} = e
            const canvasPosition = this.transformPoint(offsetX, offsetY)
            resolve(new CanvasMouseDownEvent(canvasPosition))
        })
        dom.addEventListener('contextmenu', e => {
            const {offsetX, offsetY} = e
            const canvasPosition = this.transformPoint(offsetX, offsetY)
            resolve(new CanvasContextmenuEvent(canvasPosition))
        })
        dom.addEventListener('dblclick', e => {
            const {offsetX, offsetY} = e
            const canvasPosition = this.transformPoint(offsetX, offsetY)
            resolve(new CanvasDblClickEvent(canvasPosition))
        })
        dom.addEventListener('mouseleave', e => {
        })
        dom.addEventListener('mouseenter', e => {
        })
        while (true) {
            yield (await promise)
            promise = new Promise<CanvasEvent>(r => resolve = r)
        }
    }
}

type EventHandler = (e: CanvasEvent) => void

export class EventStore {
    private store: Map<string, Array<{handler: EventHandler}>>
    constructor() {
        this.store = new Map()
    }
    on(eventName: string, handler: EventHandler) {
        const handlers = this.store.get(eventName) ?? []
        handlers.push({
            handler,
        })
        this.store.set(eventName, handlers)
    }
    dispatch(event: CanvasEvent) {
        const handlers = this.store.get(event.type) ?? []
        for (let handler of handlers) {
            handler.handler(event)
        }
    }
}
