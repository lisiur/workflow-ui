import {
    CanvasEventType,
    CanvasGlobalMouseMoveEvent,
    CanvasDragOverEvent,
    CanvasDragEvent,
    CanvasDropEvent,
    CanvasDragEndEvent,
    Layer,
    Rect,
    Rectangle,
    StateMachine,
    Vec2,
    Widget,
    CanvasMouseMoveEvent
} from 'ezcanvas'
import {InputAnchor} from './inputAnchor'
import {OutputAnchor} from './outputAnchor'

export enum NodeState {
    Normal,
    Hover,
    AnchorDrag,
    AnchorDragOver,
}

export enum NodeEvent {
    MouseEnter,
    MouseLeave,
    AnchorDragStart,
    AnchorDrag,
    AnchorDragEnd,
}

export abstract class NodeWidget extends Widget {
    static Grid = 20
    static Border = 4
    static DragOrigin: NodeWidget | null = null
    static DragTarget: NodeWidget | null = null
    abstract get type(): string;
    abstract get inputAnchorLinkable(): boolean;
    abstract get outputAnchorLinkable(): boolean;
    abstract get bbox(): Rect;
    private readonly inputAnchor: InputAnchor;
    private readonly outputAnchor: OutputAnchor;
    protected center: Vec2
    private state: NodeState
    protected trendCenter: Vec2
    private border: Rectangle
    private layer!: Layer

    protected constructor(center: Vec2, zIndex = 0) {
        super()
        this.center = center
        this.trendCenter = center.clone()
        this.state = NodeState.Normal
        this.inputAnchor = new InputAnchor(this)
        this.outputAnchor = new OutputAnchor(this)
        this.border = new Rectangle()
        this.setDraggable(true)
        this.setDroppable(true)
        this.setZIndex(zIndex)
        this.init()
    }

    init() {
        const stateMachine = new StateMachine<NodeState, NodeEvent>(NodeState.Normal)
        stateMachine.registerRules(NodeState.Normal, [
            [NodeEvent.MouseEnter, NodeState.Hover],
        ])
        stateMachine.registerRules(NodeState.Hover, [
            [NodeEvent.MouseLeave, NodeState.Normal],
            [NodeEvent.AnchorDragStart, NodeState.AnchorDrag],
        ])
        stateMachine.registerRules(NodeState.AnchorDrag, [
            [NodeEvent.AnchorDragEnd, NodeState.Normal],
        ])
        this.addEventListener(CanvasEventType.GlobalMouseMove, (e) => {
            let {position} = e as CanvasGlobalMouseMoveEvent
            if (this.bbox.containsPoint(position) || this.inputAnchor.bbox.containsPoint(position) || this.outputAnchor.bbox.containsPoint(position)) {
                this.state = stateMachine.inputEvent(NodeEvent.MouseEnter)
            } else {
                this.state = stateMachine.inputEvent(NodeEvent.MouseLeave)
            }
        })
        this.addEventListener(CanvasEventType.DragOver, (e) => {
            let event = e as CanvasDragOverEvent
            if (event.origin instanceof OutputAnchor && NodeWidget.DragOrigin !== this && this.inputAnchorLinkable) {
                NodeWidget.DragTarget = this
                event.origin.setToPosition(this.inputAnchorPosition)
            }
        })
        this.addEventListener(CanvasEventType.DragLeave, (e) => {
            NodeWidget.DragTarget = null
        })
        this.addEventListener(CanvasEventType.Drop, (e) => {
            let event = e as CanvasDropEvent
            NodeWidget.DragTarget = this
        })
        this.outputAnchor.addEventListener(CanvasEventType.DragStart, () => {
            this.state = stateMachine.inputEvent(NodeEvent.AnchorDragStart)
            NodeWidget.DragTarget = null
            NodeWidget.DragOrigin = this
        })
        this.outputAnchor.addEventListener(CanvasEventType.Drag, (e) => {
            this.state = stateMachine.inputEvent(NodeEvent.AnchorDrag)
            let event = e as CanvasDragEvent
            if (NodeWidget.DragTarget) {
                this.outputAnchor.setToPosition(NodeWidget.DragTarget.inputAnchorPosition)
            } else {
                this.outputAnchor.setToPosition(event.position)
            }
        })
        this.outputAnchor.addEventListener(CanvasEventType.DragEnd, (e) => {
            this.state = stateMachine.inputEvent(NodeEvent.AnchorDragEnd)
            if (NodeWidget.DragTarget) {
                this.linkTo(NodeWidget.DragTarget)
            }
            NodeWidget.DragTarget = null
            NodeWidget.DragOrigin = null
        })
    }

    translate(v: Vec2): void {
        const grid = NodeWidget.Grid
        this.trendCenter.addSelf(v)
        let tx = Math.floor(this.trendCenter.x / grid)
        let ty = Math.floor(this.trendCenter.y / grid)
        const dx = this.trendCenter.x - tx * grid
        const dy = this.trendCenter.y - ty * grid
        if (dx > grid / 2) {
            tx += 1
        }
        if (dy > grid / 2) {
            ty += 1
        }
        this.center = new Vec2(tx * grid, ty * grid)
    }

    linkTo(node: NodeWidget): void {}

    abstract drawNode(ctx: CanvasRenderingContext2D): void;

    abstract drawBorder(ctx: CanvasRenderingContext2D): void;

    private get canDrawAnchor(): boolean {
        return [NodeState.Hover, NodeState.AnchorDrag].includes(this.state)
    }

    get inputAnchorPosition() {
        return this.inputAnchor.bbox.rightCenter
    }

    get outputAnchorPosition() {
        return this.outputAnchor.bbox.leftCenter
    }

    addTo(layer: Layer) {
        this.layer = layer
        layer.addWidget(this)
        if (this.inputAnchorLinkable) {
            layer.addWidget(this.inputAnchor)
        }
        if (this.outputAnchorLinkable) {
            layer.addWidget(this.outputAnchor)
        }
    }

    remove() {
        this.layer.removeWidget(this)
        this.layer.removeWidget(this.inputAnchor)
        this.layer.removeWidget(this.outputAnchor)
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if ([NodeState.Hover, NodeState.AnchorDrag].includes(this.state)) {
            this.drawBorder(ctx)
        }
        this.drawNode(ctx)
        this.inputAnchor.setVisible(this.canDrawAnchor && this.inputAnchorLinkable)
        this.outputAnchor.setVisible(this.canDrawAnchor && this.outputAnchorLinkable)
    }
}
