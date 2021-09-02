import { Rectangle, Rgba, Widget } from 'ezcanvas';
export class EdgeAnchor extends Widget {
    node;
    static AnchorSize = 12;
    visible;
    constructor(node) {
        super();
        this.node = node;
        this.node = node;
        this.visible = true;
    }
    contains(v) {
        return this.bbox.containsPoint(v);
    }
    setVisible(visible) {
        this.visible = visible;
    }
    draw(ctx) {
        if (this.visible) {
            new Rectangle()
                .setPosition(this.bbox.leftTop)
                .setWidth(this.bbox.w)
                .setHeight(this.bbox.h)
                .setStyle('borderRadius', 4)
                .setStyle('bgColor', new Rgba(126, 74, 185, 1))
                .draw(ctx);
        }
    }
}
