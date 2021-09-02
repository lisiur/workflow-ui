import { CanvasContextmenuEvent, CanvasDblClickEvent, CanvasDragEndEvent, CanvasDragEnterEvent, CanvasDragEvent, CanvasDragLeaveEvent, CanvasDragOverEvent, CanvasDragStartEvent, CanvasDropEvent, CanvasGlobalMouseMoveEvent, CanvasMouseDownEvent, CanvasMouseEnterEvent, CanvasMouseEvent, CanvasMouseLeaveEvent, CanvasMouseMoveEvent, CanvasMouseUpEvent } from './event';
import { StateMachine } from './stateMachine';
import { Vec2 } from './math/vec2';
var WidgetState;
(function (WidgetState) {
    WidgetState[WidgetState["Normal"] = 0] = "Normal";
    WidgetState[WidgetState["Hover"] = 1] = "Hover";
    WidgetState[WidgetState["DragStart"] = 2] = "DragStart";
    WidgetState[WidgetState["Drag"] = 3] = "Drag";
    WidgetState[WidgetState["DragOver"] = 4] = "DragOver";
})(WidgetState || (WidgetState = {}));
var WidgetEvent;
(function (WidgetEvent) {
    WidgetEvent[WidgetEvent["MouseEnter"] = 0] = "MouseEnter";
    WidgetEvent[WidgetEvent["MouseLeave"] = 1] = "MouseLeave";
    WidgetEvent[WidgetEvent["MouseMove"] = 2] = "MouseMove";
    WidgetEvent[WidgetEvent["MouseDown"] = 3] = "MouseDown";
    WidgetEvent[WidgetEvent["MouseUp"] = 4] = "MouseUp";
    WidgetEvent[WidgetEvent["DblClick"] = 5] = "DblClick";
    WidgetEvent[WidgetEvent["Contextmenu"] = 6] = "Contextmenu";
})(WidgetEvent || (WidgetEvent = {}));
export class WidgetStateMachine {
    widget;
    static dragging = false;
    static dragPayload = {
        prevPosition: new Vec2(0, 0),
        origin: null,
    };
    // 状态机
    stateMachine;
    // 鼠标位置
    prevPointerPosition;
    // 鼠标位置是否在 widget 内
    prevPointerIncludeInWidget;
    constructor(widget) {
        this.widget = widget;
        this.widget = widget;
        this.prevPointerIncludeInWidget = false;
        this.prevPointerPosition = new Vec2(0, 0);
        const sm = new StateMachine(WidgetState.Normal);
        sm.registerRules(WidgetState.Normal, [
            [WidgetEvent.MouseEnter, () => this.widget.droppable && WidgetStateMachine.dragging ? WidgetState.DragOver : WidgetState.Hover]
        ]);
        sm.registerRules(WidgetState.Hover, [
            [WidgetEvent.MouseDown, () => this.widget.draggable ? WidgetState.DragStart : WidgetState.Hover],
            [WidgetEvent.MouseLeave, WidgetState.Normal],
        ]);
        sm.registerRules(WidgetState.DragStart, [
            [WidgetEvent.MouseMove, WidgetState.Drag],
            [WidgetEvent.MouseUp, WidgetState.Hover],
        ]);
        sm.registerRules(WidgetState.Drag, [
            [WidgetEvent.MouseUp, WidgetState.Hover],
        ]);
        sm.registerRules(WidgetState.DragOver, [
            [WidgetEvent.MouseLeave, WidgetState.Normal],
            [WidgetEvent.MouseUp, WidgetState.Hover],
        ]);
        this.stateMachine = sm;
    }
    get state() {
        return this.stateMachine.state;
    }
    handleEvent(event) {
        const widget = this.widget;
        const droppable = widget.droppable;
        const draggable = widget.draggable;
        const dragging = WidgetStateMachine.dragging;
        const dragPrevPosition = WidgetStateMachine.dragPayload.prevPosition;
        const dragOriginWidget = WidgetStateMachine.dragPayload.origin;
        let outputEvent = null;
        if (event instanceof CanvasGlobalMouseMoveEvent) {
            outputEvent = event;
        }
        else if (event instanceof CanvasMouseEvent) {
            if (event instanceof CanvasMouseMoveEvent) {
                const prevPointerIncludeInWidget = this.prevPointerIncludeInWidget;
                const currPointerIncludeInWidget = widget.contains(event.position);
                if (!prevPointerIncludeInWidget && currPointerIncludeInWidget) {
                    // 之前不在widget内，现在在widget内，为 mouseenter 事件
                    this.stateMachine.inputEvent(WidgetEvent.MouseEnter);
                    if (droppable && dragging && dragOriginWidget !== widget) {
                        // 拖拽中，则触发 dragenter 事件
                        const offset = event.position.sub(dragPrevPosition);
                        WidgetStateMachine.dragPayload.prevPosition = event.position;
                        outputEvent = new CanvasDragEnterEvent(event.position).setOffset(offset).setOrigin(dragOriginWidget);
                    }
                    else {
                        // 否则触发 mouseenter 事件
                        outputEvent = new CanvasMouseEnterEvent(event.position);
                    }
                }
                else if (prevPointerIncludeInWidget && !currPointerIncludeInWidget) {
                    // 之前在widget内，现在不在widget内，为 mouseleave 事件
                    this.stateMachine.inputEvent(WidgetEvent.MouseLeave);
                    if (droppable && dragging && dragOriginWidget !== widget) {
                        // 拖拽中，则触发 dragleave 事件
                        const offset = event.position.sub(dragPrevPosition);
                        WidgetStateMachine.dragPayload.prevPosition = event.position;
                        outputEvent = new CanvasDragLeaveEvent(event.position).setOffset(offset).setOrigin(dragOriginWidget);
                    }
                    else {
                        // 否则触发 mouseleave 事件
                        outputEvent = new CanvasMouseLeaveEvent(event.position);
                    }
                }
                else {
                    if (this.prevPointerIncludeInWidget) {
                        this.stateMachine.inputEvent(WidgetEvent.MouseMove);
                        if (dragging) {
                            if (droppable && dragOriginWidget !== widget) {
                                // 可放置 widget 上移动，触发 dragover 事件
                                const offset = event.position.sub(dragPrevPosition);
                                WidgetStateMachine.dragPayload.prevPosition = event.position;
                                outputEvent = new CanvasDragOverEvent(event.position).setOffset(offset).setOrigin(dragOriginWidget);
                            }
                            if (draggable && dragOriginWidget === widget) {
                                // 可拖拽 widget 上移动，触发 drag 事件
                                const offset = event.position.sub(dragPrevPosition);
                                WidgetStateMachine.dragPayload.prevPosition = event.position;
                                outputEvent = new CanvasDragEvent(event.position).setOffset(offset).setOrigin(dragOriginWidget);
                            }
                        }
                        else {
                            // 其他情况触发 mousemove 事件
                            outputEvent = new CanvasMouseMoveEvent(event.position);
                        }
                    }
                    else {
                        // 拖拽速度过快会导致移出拖拽的元素
                        // 此时判断正在拖拽的元素是否为当前widget来触发拖拽事件
                        if (dragging && draggable && dragOriginWidget === widget) {
                            const offset = event.position.sub(dragPrevPosition);
                            WidgetStateMachine.dragPayload.prevPosition = event.position;
                            outputEvent = new CanvasDragEvent(event.position).setOffset(offset).setOrigin(dragOriginWidget);
                        }
                        else {
                            outputEvent = new CanvasMouseLeaveEvent(event.position);
                        }
                    }
                }
                this.prevPointerIncludeInWidget = currPointerIncludeInWidget;
                this.prevPointerPosition = event.position;
            }
            else {
                if (event instanceof CanvasMouseDownEvent) {
                    if (this.prevPointerIncludeInWidget) {
                        this.stateMachine.inputEvent(WidgetEvent.MouseDown);
                        if (draggable) {
                            WidgetStateMachine.dragging = true;
                            WidgetStateMachine.dragPayload = {
                                prevPosition: event.position,
                                origin: widget,
                            };
                            outputEvent = new CanvasDragStartEvent(event.position).setOrigin(dragOriginWidget);
                        }
                        else {
                            outputEvent = new CanvasMouseDownEvent(event.position);
                        }
                    }
                }
                else if (event instanceof CanvasMouseUpEvent) {
                    // 普通点击事件
                    if (!dragging && this.prevPointerIncludeInWidget) {
                        this.stateMachine.inputEvent(WidgetEvent.MouseUp);
                        outputEvent = new CanvasMouseUpEvent(event.position);
                    }
                    // 对于正在拖拽的元素来说
                    if (dragging) {
                        this.stateMachine.inputEvent(WidgetEvent.MouseUp);
                        // 鼠标位于可放置元素上
                        if (droppable && dragOriginWidget !== widget && this.prevPointerIncludeInWidget) {
                            const offset = event.position.sub(dragPrevPosition);
                            WidgetStateMachine.dragPayload.prevPosition = event.position;
                            outputEvent = new CanvasDropEvent(event.position).setOffset(offset).setOrigin(dragOriginWidget);
                        }
                        if (draggable && dragOriginWidget === widget) {
                            // 拖拽结束
                            WidgetStateMachine.dragging = false;
                            const offset = event.position.sub(dragPrevPosition);
                            WidgetStateMachine.dragPayload.prevPosition = event.position;
                            outputEvent = new CanvasDragEndEvent(event.position).setOffset(offset).setOrigin(dragOriginWidget);
                        }
                    }
                }
                else if (event instanceof CanvasDblClickEvent) {
                    if (this.prevPointerIncludeInWidget) {
                        this.stateMachine.inputEvent(WidgetEvent.DblClick);
                        outputEvent = new CanvasDblClickEvent(event.position);
                    }
                }
                else if (event instanceof CanvasContextmenuEvent) {
                    if (this.prevPointerIncludeInWidget) {
                        this.stateMachine.inputEvent(WidgetEvent.Contextmenu);
                        outputEvent = new CanvasContextmenuEvent(event.position);
                    }
                }
            }
        }
        return outputEvent;
    }
}
