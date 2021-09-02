import {Color} from '../color'
import {Vec2} from '../math/vec2'
import {Style} from '../style'
import {Drawable} from '../drawable'

interface RectangleStyle extends Style {
    bgColor?: Color
    borderColor?: Color
    border?: number
    borderRadius?: number
    borderTopLeftRadius?: number
    borderTopRightRadius?: number
    borderBottomLeftRadius?: number
    borderBottomRightRadius?: number
}
function getComputedStyles(style: RectangleStyle) {
    const x = style.x
    const y = style.y
    const width = style.width
    const height = style.height
    const border = style.border ?? 0
    const borderColor = style.borderColor?.toRgbaStr() ?? 'rgba(0,0,0,0)'
    const borderTopLeftRadius = style.borderTopLeftRadius ?? style.borderRadius ?? 0
    const borderTopRightRadius = style.borderTopRightRadius ?? style.borderRadius ?? 0
    const borderBottomLeftRadius = style.borderBottomLeftRadius ?? style.borderRadius ?? 0
    const borderBottomRightRadius = style.borderBottomRightRadius ?? style.borderRadius ?? 0
    const bgColor = style.bgColor?.toRgbaStr() ?? 'rgba(0,0,0,1)'
    return {
        x,
        y,
        width,
        height,
        bgColor,
        border,
        borderColor,
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
    }
}

class RectangleStyle implements Style {
    public x: number
    public y: number
    public width: number
    public height: number

    constructor() {
        this.x = 0
        this.y = 0
        this.width = 0
        this.height = 0
    }

}

export class Rectangle implements Drawable {
    private readonly style: RectangleStyle

    constructor() {
        this.style = new RectangleStyle()
    }

    setPosition(position: Vec2): Rectangle {
        this.style.x = position.x
        this.style.y = position.y
        return this
    }

    setWidth(w: number): Rectangle {
        this.style.width = w
        return this
    }

    setHeight(h: number): Rectangle {
        this.style.height = h
        return this
    }

    setStyle<T extends keyof RectangleStyle>(k: T, v: RectangleStyle[T]): Rectangle {
        this.style[k] = v
        return this
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const style = this.style
        const {
            x,
            y,
            width: w,
            height: h,
            bgColor,
            borderTopLeftRadius: tl,
            borderTopRightRadius: tr,
            borderBottomLeftRadius: bl,
            borderBottomRightRadius: br,
        } = getComputedStyles(style)

        const points = [
            new Vec2(x, y + tl),
            new Vec2(x + tl, y),
            new Vec2(x + w - tr, y),
            new Vec2(x + w, y + tr),
            new Vec2(x + w, y + h - br),
            new Vec2(x + w - br, y + h),
            new Vec2(x + bl, y + h),
            new Vec2(x, y + h - bl),
        ]

        ctx.beginPath()
        // 左上弧线
        ctx.moveTo(points[0].x, points[0].y)
        ctx.arcTo(x, y, points[1].x, points[1].y, tl)
        // 上侧横线
        ctx.lineTo(points[2].x, points[2].y)
        // 右上弧线
        ctx.arcTo(x + w, y, points[3].x, points[3].y, tr)
        // 右侧竖线
        ctx.lineTo(points[4].x, points[4].y)
        // 右下弧线
        ctx.arcTo(x + w, y + h, points[5].x, points[5].y, br)
        // 下侧横线
        ctx.lineTo(points[6].x, points[6].y)
        // 左下弧线
        ctx.arcTo(x, y + h, points[7].x, points[7].y, bl)
        // 封闭
        ctx.closePath()
        // bgColor
        ctx.fillStyle = bgColor
        ctx.fill()
    }
}
