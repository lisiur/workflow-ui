export class Vec2 {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.x = x;
        this.y = y;
    }
    add(v) {
        const x = this.x + v.x;
        const y = this.y + v.y;
        return new Vec2(x, y);
    }
    sub(v) {
        const x = this.x - v.x;
        const y = this.y - v.y;
        return new Vec2(x, y);
    }
    addSelf(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    clone() {
        return new Vec2(this.x, this.y);
    }
}
