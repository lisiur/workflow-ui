import { Widget, Rect, BezierCurve3 } from 'ezcanvas';
export class EdgeWidget extends Widget {
    fromNode;
    toNode;
    _toPosition;
    layer;
    constructor(fromNode, toNode = null) {
        super();
        this.fromNode = fromNode;
        this.toNode = toNode;
        this._toPosition = null;
    }
    get fromPosition() {
        return this.fromNode.outputAnchorPosition;
    }
    get toPosition() {
        return this.toNode?.inputAnchorPosition ?? this._toPosition ?? this.fromPosition;
    }
    addTo(layer) {
        this.layer = layer;
        layer.addWidget(this);
    }
    setToPosition(position) {
        this._toPosition = position;
        return this;
    }
    contains(v) {
        // TODO
        return false;
    }
    draw(ctx) {
        new BezierCurve3(this.fromPosition, this.toPosition)
            .draw(ctx);
    }
    translate(v) { }
    get bbox() {
        return Rect.from_two_points(this.fromPosition, this.toPosition);
    }
}
