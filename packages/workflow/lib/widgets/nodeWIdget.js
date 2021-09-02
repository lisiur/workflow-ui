import { CanvasEventType, Rectangle, StateMachine, Vec2, Widget } from 'ezcanvas';
import { InputAnchor } from './inputAnchor';
import { OutputAnchor } from './outputAnchor';
export var NodeState;
(function (NodeState) {
    NodeState[NodeState["Normal"] = 0] = "Normal";
    NodeState[NodeState["Hover"] = 1] = "Hover";
    NodeState[NodeState["AnchorDrag"] = 2] = "AnchorDrag";
    NodeState[NodeState["AnchorDragOver"] = 3] = "AnchorDragOver";
})(NodeState || (NodeState = {}));
export var NodeEvent;
(function (NodeEvent) {
    NodeEvent[NodeEvent["MouseEnter"] = 0] = "MouseEnter";
    NodeEvent[NodeEvent["MouseLeave"] = 1] = "MouseLeave";
    NodeEvent[NodeEvent["AnchorDragStart"] = 2] = "AnchorDragStart";
    NodeEvent[NodeEvent["AnchorDrag"] = 3] = "AnchorDrag";
    NodeEvent[NodeEvent["AnchorDragEnd"] = 4] = "AnchorDragEnd";
})(NodeEvent || (NodeEvent = {}));
export class NodeWidget extends Widget {
    static Grid = 20;
    static Border = 4;
    static DragOrigin = null;
    static DragTarget = null;
    inputAnchor;
    outputAnchor;
    center;
    state;
    trendCenter;
    border;
    layer;
    constructor(center, zIndex = 0) {
        super();
        this.center = center;
        this.trendCenter = center.clone();
        this.state = NodeState.Normal;
        this.inputAnchor = new InputAnchor(this);
        this.outputAnchor = new OutputAnchor(this);
        this.border = new Rectangle();
        this.setDraggable(true);
        this.setDroppable(true);
        this.setZIndex(zIndex);
        this.init();
    }
    init() {
        const stateMachine = new StateMachine(NodeState.Normal);
        stateMachine.registerRules(NodeState.Normal, [
            [NodeEvent.MouseEnter, NodeState.Hover],
        ]);
        stateMachine.registerRules(NodeState.Hover, [
            [NodeEvent.MouseLeave, NodeState.Normal],
            [NodeEvent.AnchorDragStart, NodeState.AnchorDrag],
        ]);
        stateMachine.registerRules(NodeState.AnchorDrag, [
            [NodeEvent.AnchorDragEnd, NodeState.Normal],
        ]);
        this.addEventListener(CanvasEventType.GlobalMouseMove, (e) => {
            let { position } = e;
            if (this.bbox.containsPoint(position) || this.inputAnchor.bbox.containsPoint(position) || this.outputAnchor.bbox.containsPoint(position)) {
                this.state = stateMachine.inputEvent(NodeEvent.MouseEnter);
            }
            else {
                this.state = stateMachine.inputEvent(NodeEvent.MouseLeave);
            }
        });
        this.addEventListener(CanvasEventType.DragOver, (e) => {
            let event = e;
            if (event.origin instanceof OutputAnchor && NodeWidget.DragOrigin !== this && this.inputAnchorLinkable) {
                NodeWidget.DragTarget = this;
                event.origin.setToPosition(this.inputAnchorPosition);
            }
        });
        this.addEventListener(CanvasEventType.DragLeave, (e) => {
            NodeWidget.DragTarget = null;
        });
        this.addEventListener(CanvasEventType.Drop, (e) => {
            let event = e;
            NodeWidget.DragTarget = this;
        });
        this.outputAnchor.addEventListener(CanvasEventType.DragStart, () => {
            this.state = stateMachine.inputEvent(NodeEvent.AnchorDragStart);
            NodeWidget.DragTarget = null;
            NodeWidget.DragOrigin = this;
        });
        this.outputAnchor.addEventListener(CanvasEventType.Drag, (e) => {
            this.state = stateMachine.inputEvent(NodeEvent.AnchorDrag);
            let event = e;
            if (NodeWidget.DragTarget) {
                this.outputAnchor.setToPosition(NodeWidget.DragTarget.inputAnchorPosition);
            }
            else {
                this.outputAnchor.setToPosition(event.position);
            }
        });
        this.outputAnchor.addEventListener(CanvasEventType.DragEnd, (e) => {
            this.state = stateMachine.inputEvent(NodeEvent.AnchorDragEnd);
            if (NodeWidget.DragTarget) {
                this.linkTo(NodeWidget.DragTarget);
            }
            NodeWidget.DragTarget = null;
            NodeWidget.DragOrigin = null;
        });
    }
    translate(v) {
        const grid = NodeWidget.Grid;
        this.trendCenter.addSelf(v);
        let tx = Math.floor(this.trendCenter.x / grid);
        let ty = Math.floor(this.trendCenter.y / grid);
        const dx = this.trendCenter.x - tx * grid;
        const dy = this.trendCenter.y - ty * grid;
        if (dx > grid / 2) {
            tx += 1;
        }
        if (dy > grid / 2) {
            ty += 1;
        }
        this.center = new Vec2(tx * grid, ty * grid);
    }
    linkTo(node) { }
    get canDrawAnchor() {
        return [NodeState.Hover, NodeState.AnchorDrag].includes(this.state);
    }
    get inputAnchorPosition() {
        return this.inputAnchor.bbox.rightCenter;
    }
    get outputAnchorPosition() {
        return this.outputAnchor.bbox.leftCenter;
    }
    addTo(layer) {
        this.layer = layer;
        layer.addWidget(this);
        if (this.inputAnchorLinkable) {
            layer.addWidget(this.inputAnchor);
        }
        if (this.outputAnchorLinkable) {
            layer.addWidget(this.outputAnchor);
        }
    }
    remove() {
        this.layer.removeWidget(this);
        this.layer.removeWidget(this.inputAnchor);
        this.layer.removeWidget(this.outputAnchor);
    }
    draw(ctx) {
        if ([NodeState.Hover, NodeState.AnchorDrag].includes(this.state)) {
            this.drawBorder(ctx);
        }
        this.drawNode(ctx);
        this.inputAnchor.setVisible(this.canDrawAnchor && this.inputAnchorLinkable);
        this.outputAnchor.setVisible(this.canDrawAnchor && this.outputAnchorLinkable);
    }
}
