import {Drawable} from './drawable'
import {Vec2} from './math/vec2'
import {CanvasDragStartEvent, CanvasEvent, CanvasEventType, EventStore} from './event'
import {WidgetStateMachine} from './widgetState'
import {Rect} from './math/rect'

export abstract class Widget implements Drawable {
    private _zIndex: number
    protected eventStore: EventStore
    public draggable: boolean
    public droppable: boolean
    private stateMachine: WidgetStateMachine

    protected constructor() {
        this.eventStore = new EventStore()
        this.stateMachine = new WidgetStateMachine(this)
        this.draggable = false
        this.droppable = false
        this._zIndex = 0
        this.initDefaultListeners()
    }

    get zIndex() {
        return this._zIndex
    }

    setZIndex(zIndex: number) {
        this._zIndex = zIndex
    }

    setDraggable(flag: boolean) {
        this.draggable = flag
    }

    setDroppable(flag: boolean) {
        this.droppable = flag
    }

    abstract get bbox(): Rect;

    initDefaultListeners() {
        this.addEventListener(CanvasEventType.Drag, (e) => {
            if (this.draggable) {
                let event = e as any as CanvasDragStartEvent
                this.translate(event.offset)
            }
        })
        this.addEventListener(CanvasEventType.DragEnd, (e) => {
            if (this.draggable) {
                let event = e as any as CanvasDragStartEvent
                this.translate(event.offset)
            }
        })
    }

    abstract contains(v: Vec2): boolean

    abstract translate(v: Vec2): void

    abstract draw(ctx: CanvasRenderingContext2D): void

    handleEvent(event: CanvasEvent): boolean {
        if (event.active) {
            const newEvent = this.stateMachine.handleEvent(event)
            if (newEvent) {
                this.eventStore.dispatch(newEvent)
            }
        }
        return true
    }

    addEventListener(eventName: CanvasEventType, handler: (event: CanvasEvent) => void): void {
        this.eventStore.on(eventName, handler)
    }
}


