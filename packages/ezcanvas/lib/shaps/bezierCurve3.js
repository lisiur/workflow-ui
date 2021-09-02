export class BezierCurve3 {
    from;
    to;
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.from = from;
        this.to = to;
    }
    setFrom(from) {
        this.from = from;
    }
    setTo(to) {
        this.to = to;
    }
    draw(ctx) {
        const fromX = this.from.x;
        const fromY = this.from.y;
        const toX = this.to.x;
        const toY = this.to.y;
        let ctrl1X = 0;
        let ctrl2X = 0;
        let ctrl1Y = 0;
        let ctrl2Y = 0;
        if (toX > fromX) {
            ctrl1X = toX - (toX - fromX) / 4;
            ctrl2X = fromX + (toX - fromX) / 4;
            ctrl1Y = fromY;
            ctrl2Y = toY;
        }
        else {
            ctrl1X = fromX - (toX - fromX);
            ctrl2X = toX + (toX - fromX);
            ctrl1Y = toY;
            ctrl2Y = fromY;
        }
        ctx.save();
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.bezierCurveTo(ctrl1X, ctrl1Y, ctrl2X, ctrl2Y, toX, toY);
        ctx.stroke();
        ctx.restore();
    }
}
