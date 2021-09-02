import {EdgeAnchor} from './edgeAnchor'
import {BezierCurve3, CanvasEventType, CanvasMouseMoveEvent, Rect, Vec2} from 'ezcanvas'
import {NodeWidget} from './nodeWidget'

export class OutputAnchor extends EdgeAnchor {

    private toPosition: Vec2
    private dragging: boolean
    constructor(protected node: NodeWidget) {
        super(node)
        this.setDraggable(true)
        this.toPosition = this.bbox.leftCenter
        this.dragging = false
        this.addEventListener(CanvasEventType.Drag, (e) => {
            this.dragging = true
        })
        this.addEventListener(CanvasEventType.DragEnd, (e) => {
            this.dragging = false
        })
    }

    get bbox(): Rect {
        const center = this.node.bbox.rightCenter.add(new Vec2(EdgeAnchor.AnchorSize / 2, 0))
        return Rect.from_center(center, EdgeAnchor.AnchorSize, EdgeAnchor.AnchorSize)
    }

    translate(v: Vec2): void {
    }

    setToPosition(v: Vec2) {
        this.toPosition = v
    }

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx)
        if (this.dragging) {
            new BezierCurve3(this.node.outputAnchorPosition, this.toPosition).draw(ctx)
        }
    }
}
