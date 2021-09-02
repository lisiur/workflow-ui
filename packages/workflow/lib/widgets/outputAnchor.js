import { EdgeAnchor } from './edgeAnchor';
import { BezierCurve3, CanvasEventType, Rect, Vec2 } from 'ezcanvas';
export class OutputAnchor extends EdgeAnchor {
    node;
    toPosition;
    dragging;
    constructor(node) {
        super(node);
        this.node = node;
        this.setDraggable(true);
        this.toPosition = this.bbox.leftCenter;
        this.dragging = false;
        this.addEventListener(CanvasEventType.Drag, (e) => {
            this.dragging = true;
        });
        this.addEventListener(CanvasEventType.DragEnd, (e) => {
            this.dragging = false;
        });
    }
    get bbox() {
        const center = this.node.bbox.rightCenter.add(new Vec2(EdgeAnchor.AnchorSize / 2, 0));
        return Rect.from_center(center, EdgeAnchor.AnchorSize, EdgeAnchor.AnchorSize);
    }
    translate(v) {
    }
    setToPosition(v) {
        this.toPosition = v;
    }
    draw(ctx) {
        super.draw(ctx);
        if (this.dragging) {
            new BezierCurve3(this.node.outputAnchorPosition, this.toPosition).draw(ctx);
        }
    }
}
