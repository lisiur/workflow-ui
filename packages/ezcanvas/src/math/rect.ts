import {Vec2} from './vec2'

export class Rect {
    static from_center(center: Vec2, width: number, height?: number) {
        height ??= width as number
        const x = center.x - width / 2
        const y = center.y - height / 2
        return new Rect(x, y, width, height)
    }

    static from_two_points(p1: Vec2, p2: Vec2) {
        const width = Math.abs(p1.x - p2.x)
        const height = Math.abs(p1.y - p2.y)
        const x = Math.min(p1.x, p2.x)
        const y = Math.min(p1.y, p2.y)
        return new Rect(x, y, width, height)
    }

    constructor(public x: number, public y: number, public w: number, public h: number) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    get endX(): number {
        return this.x + this.w
    }

    get endY(): number {
        return this.y + this.h
    }

    get center(): Vec2 {
        return new Vec2(this.x + this.w / 2, this.y + this.h / 2)
    }

    get leftTop(): Vec2 {
        return new Vec2(this.x, this.y)
    }

    get bottomRight(): Vec2 {
        return new Vec2(this.x + this.w, this.y + this.h)
    }

    get leftCenter(): Vec2 {
        return new Vec2(this.x, this.y + this.h / 2)
    }

    get rightCenter(): Vec2 {
        return new Vec2(this.x + this.w, this.y + this.h / 2)
    }

    expand(px: number): Rect {
        return Rect.from_center(this.center, this.w + px, this.h + px)
    }

    containsPoint(point: Vec2) {
        return point.x >= this.x && point.x <= this.endX && point.y >= this.y && point.y <= this.endY
    }
}
