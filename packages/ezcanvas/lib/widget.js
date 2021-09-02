import { CanvasEventType, EventStore } from './event';
import { WidgetStateMachine } from './widgetState';
export class Widget {
    _zIndex;
    eventStore;
    draggable;
    droppable;
    stateMachine;
    constructor() {
        this.eventStore = new EventStore();
        this.stateMachine = new WidgetStateMachine(this);
        this.draggable = false;
        this.droppable = false;
        this._zIndex = 0;
        this.initDefaultListeners();
    }
    get zIndex() {
        return this._zIndex;
    }
    setZIndex(zIndex) {
        this._zIndex = zIndex;
    }
    setDraggable(flag) {
        this.draggable = flag;
    }
    setDroppable(flag) {
        this.droppable = flag;
    }
    initDefaultListeners() {
        this.addEventListener(CanvasEventType.Drag, (e) => {
            if (this.draggable) {
                let event = e;
                this.translate(event.offset);
            }
        });
        this.addEventListener(CanvasEventType.DragEnd, (e) => {
            if (this.draggable) {
                let event = e;
                this.translate(event.offset);
            }
        });
    }
    handleEvent(event) {
        if (event.active) {
            const newEvent = this.stateMachine.handleEvent(event);
            if (newEvent) {
                this.eventStore.dispatch(newEvent);
            }
        }
        return true;
    }
    addEventListener(eventName, handler) {
        this.eventStore.on(eventName, handler);
    }
}
