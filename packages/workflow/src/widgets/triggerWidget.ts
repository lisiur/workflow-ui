import {Vec2, Rect, Rectangle, Rgba} from 'ezcanvas'
import {NodeWidget} from './nodeWidget'

export class TriggerWidget extends NodeWidget {
    static Width = 120
    static Height = 80

    constructor(center: Vec2, zIndex = 0){
        super(center, zIndex)
        this.setZIndex(zIndex)
    }

    get type() {
        return 'Trigger'
    }

    get outputAnchorLinkable() {
        return true
    }

    get inputAnchorLinkable() {
        return false
    }

    get bbox() {
        return Rect.from_center(this.center, TriggerWidget.Width, TriggerWidget.Height)
    }

    contains(point: Vec2): boolean {
        return this.bbox.containsPoint(point)
    }

    drawBorder(ctx: CanvasRenderingContext2D) {
        new Rectangle()
            .setPosition(new Vec2(this.bbox.x - NodeWidget.Border, this.bbox.y - NodeWidget.Border))
            .setWidth(this.bbox.w + NodeWidget.Border * 2)
            .setHeight(this.bbox.h + NodeWidget.Border * 2)
            .setStyle('borderTopLeftRadius', 34)
            .setStyle('borderBottomLeftRadius', 34)
            .setStyle('borderTopRightRadius', 14)
            .setStyle('borderBottomRightRadius', 14)
            .setStyle('bgColor', new Rgba(126, 74, 185, 1))
            .draw(ctx)
    }

    drawNode(ctx: CanvasRenderingContext2D): void {
        new Rectangle()
            .setPosition(this.bbox.leftTop)
            .setWidth(TriggerWidget.Width)
            .setHeight(TriggerWidget.Height)
            .setStyle('borderTopLeftRadius', 30)
            .setStyle('borderBottomLeftRadius', 30)
            .setStyle('borderTopRightRadius', 10)
            .setStyle('borderBottomRightRadius', 10)
            .setStyle('bgColor', new Rgba(231, 231, 231, 1))
            .draw(ctx)
    }
}
