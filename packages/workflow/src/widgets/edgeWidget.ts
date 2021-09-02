import {Widget, Vec2, Rect, BezierCurve3, Layer} from 'ezcanvas'
import {NodeWidget} from './nodeWidget'

export class EdgeWidget extends Widget {

    private fromNode: NodeWidget
    private toNode: NodeWidget | null
    private  _toPosition: Vec2 | null
    private layer!: Layer
    constructor(fromNode: NodeWidget, toNode: NodeWidget | null = null) {
        super()
        this.fromNode = fromNode
        this.toNode = toNode
        this._toPosition = null
    }

    get fromPosition(): Vec2 {
        return this.fromNode.outputAnchorPosition
    }

    get toPosition(): Vec2 {
        return this.toNode?.inputAnchorPosition ?? this._toPosition ?? this.fromPosition
    }

    addTo(layer: Layer) {
        this.layer = layer
        layer.addWidget(this)
    }

    setToPosition(position: Vec2): EdgeWidget {
        this._toPosition = position
        return this
    }

    contains(v: Vec2): boolean {
        // TODO
        return false;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        new BezierCurve3(this.fromPosition, this.toPosition)
            .draw(ctx)
    }

    translate(v: Vec2): void {}

    get bbox(): Rect {
        return Rect.from_two_points(this.fromPosition, this.toPosition)
    }
}
