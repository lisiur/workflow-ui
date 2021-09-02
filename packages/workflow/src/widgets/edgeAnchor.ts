import {Rect, Rectangle, Rgba, Vec2, Widget} from 'ezcanvas'
import {NodeWidget} from './nodeWidget'

export abstract class EdgeAnchor extends Widget {
    static AnchorSize = 12

    protected visible: boolean
    constructor(protected node: NodeWidget) {
        super()
        this.node = node
        this.visible = true
    }

    contains(v: Vec2): boolean {
        return this.bbox.containsPoint(v)
    }

    setVisible(visible: boolean) {
        this.visible = visible
    }

    abstract translate(v: Vec2): void;

    abstract get bbox(): Rect;

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.visible) {
            new Rectangle()
                .setPosition(this.bbox.leftTop)
                .setWidth(this.bbox.w)
                .setHeight(this.bbox.h)
                .setStyle('borderRadius', 4)
                .setStyle('bgColor', new Rgba(126, 74, 185, 1))
                .draw(ctx)
        }
    }
}
