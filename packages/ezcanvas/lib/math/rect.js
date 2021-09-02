import { Vec2 } from './vec2';
export class Rect {
    x;
    y;
    w;
    h;
    static from_center(center, width, height) {
        height ??= width;
        const x = center.x - width / 2;
        const y = center.y - height / 2;
        return new Rect(x, y, width, height);
    }
    static from_two_points(p1, p2) {
        const width = Math.abs(p1.x - p2.x);
        const height = Math.abs(p1.y - p2.y);
        const x = Math.min(p1.x, p2.x);
        const y = Math.min(p1.y, p2.y);
        return new Rect(x, y, width, height);
    }
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    get endX() {
        return this.x + this.w;
    }
    get endY() {
        return this.y + this.h;
    }
    get center() {
        return new Vec2(this.x + this.w / 2, this.y + this.h / 2);
    }
    get leftTop() {
        return new Vec2(this.x, this.y);
    }
    get bottomRight() {
        return new Vec2(this.x + this.w, this.y + this.h);
    }
    get leftCenter() {
        return new Vec2(this.x, this.y + this.h / 2);
    }
    get rightCenter() {
        return new Vec2(this.x + this.w, this.y + this.h / 2);
    }
    expand(px) {
        return Rect.from_center(this.center, this.w + px, this.h + px);
    }
    containsPoint(point) {
        return point.x >= this.x && point.x <= this.endX && point.y >= this.y && point.y <= this.endY;
    }
}
