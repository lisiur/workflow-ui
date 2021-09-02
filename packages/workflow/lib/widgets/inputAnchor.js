import { EdgeAnchor } from './edgeAnchor';
import { Rect, Vec2 } from 'ezcanvas';
export class InputAnchor extends EdgeAnchor {
    get bbox() {
        const center = this.node.bbox.leftCenter.sub(new Vec2(EdgeAnchor.AnchorSize / 2, 0));
        return Rect.from_center(center, EdgeAnchor.AnchorSize, EdgeAnchor.AnchorSize);
    }
    translate(v) { }
}
