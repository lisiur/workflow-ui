export class Vec2 {
    constructor(public x: number, public y: number) {
        this.x = x;
        this.y = y;
    }

    add(v: Vec2): Vec2 {
        const x = this.x + v.x
        const y = this.y + v.y
        return new Vec2(x, y)
    }

    sub(v: Vec2): Vec2 {
        const x = this.x - v.x
        const y = this.y - v. y
        return new Vec2(x, y)
    }

    addSelf(v: Vec2): Vec2 {
        this.x += v.x
        this.y += v.y
        return this
    }

    clone() {
        return new Vec2(this.x, this.y)
    }
}
