import { EdgeAnchor } from './edgeAnchor';
import { Rect, Vec2 } from 'ezcanvas';
export declare class InputAnchor extends EdgeAnchor {
    get bbox(): Rect;
    translate(v: Vec2): void;
}
