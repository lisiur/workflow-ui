import {Layer} from './layer'
import {CanvasEventGenerator, CanvasGlobalMouseMoveEvent, CanvasMouseMoveEvent} from './event'
import {Vec2} from './math/vec2'
import {Widget} from './widget'

export class EzCanvas {
    static DevicePixelRatio = window.devicePixelRatio ?? 1
    private readonly ctx: CanvasRenderingContext2D
    private layers: Map<string, Layer>
    private readonly orderedLayers: Layer[]
    private layerCanvas: Map<Layer, HTMLCanvasElement>
    private layerCanvasCtx: Map<Layer, CanvasRenderingContext2D>
    public readonly defaultLayer: Layer
    private transformMatrix: DOMMatrix
    private inverseTransformMatrix: DOMMatrix

    constructor(public canvas: HTMLCanvasElement) {
        this.canvas = canvas
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            throw new Error('can not create 2d context from canvas')
        }
        this.ctx = ctx
        this.layers = new Map<string, Layer>()
        this.layerCanvas = new Map<Layer, HTMLCanvasElement>()
        this.layerCanvasCtx = new Map<Layer, CanvasRenderingContext2D>()
        this.orderedLayers = []
        this.defaultLayer = new Layer(0)
        this.transformMatrix = this.ctx.getTransform()
        this.inverseTransformMatrix = this.transformMatrix.inverse()
        this.init()
    }

    init() {
        this.autoResize()
        this.handleEvents().finally()
        this.addLayer('default', this.defaultLayer)
    }

    setTransform(matrix: DOMMatrix) {
        this.transformMatrix = matrix
        this.inverseTransformMatrix = this.transformMatrix.inverse()
    }

    addWidget(widget: Widget) {
        this.addWidgetToLayer('default', widget)
    }

    addWidgetToLayer(layerName: string, widget: Widget) {
        const layer = this.layers.get(layerName)
        if (!layer) {
            throw new Error('layer not found')
        }
        layer.addWidget(widget)
    }

    // 添加 layer
    addLayer(name: string, layer: Layer) {
        if (this.layers.has(name)) {
            throw new Error(`layer ${name} already exists`)
        }
        this.layers.set(name, layer)
        const canvas = document.createElement('canvas')
        this.layerCanvas.set(layer, canvas)
        const canvasCtx = canvas.getContext('2d')
        if (!canvasCtx) {
            throw new Error('cannot get 2d context from canvas')
        }
        this.layerCanvasCtx.set(layer, canvasCtx)

        const index = this.orderedLayers.findIndex(item => item.zIndex > layer.zIndex)
        if (index < 0) {
            this.orderedLayers.push(layer)
        } else {
            this.orderedLayers.splice(index, 0, layer)
        }

        // 立即和可视 canvas 同步
        this.syncLayerCanvas(layer)
    }

    // 同步离屏 canvas 和 可视 canvas
    syncLayerCanvas(layer: Layer) {
        const canvas = this.layerCanvas.get(layer) as HTMLCanvasElement
        const ctx = this.layerCanvasCtx.get(layer) as CanvasRenderingContext2D
        // 同步宽高
        canvas.width = this.canvas.width
        canvas.height = this.canvas.height
        // 同步变换
        ctx.setTransform(this.transformMatrix)
    }

    // 监测 canvas 大小变化做适配
    autoResize() {
        this.resizeCanvasToDisplaySize()
        new ResizeObserver(() => {
            this.resizeCanvasToDisplaySize()
            this.render()
        }).observe(this.canvas)
    }

    // 抗锯齿
    resizeCanvasToDisplaySize() {
        const devicePixelRatio = EzCanvas.DevicePixelRatio
        const width = this.canvas.clientWidth * devicePixelRatio
        const height = this.canvas.clientHeight * devicePixelRatio
        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width
            this.canvas.height = height
        }

        // 同步离屏 canvas
        for (let layer of this.orderedLayers) {
            this.syncLayerCanvas(layer)
        }
    }

    translateDomPosition(x: number, y: number) {
        const point = this.inverseTransformMatrix.transformPoint({
            x, y, z: 0, w: 1
        })
        return new Vec2(point.x, point.y)
    }

    // 处理事件
    async handleEvents() {
        const eventGenerator = new CanvasEventGenerator(this.canvas, this.translateDomPosition.bind(this))
        for await (let event of eventGenerator.listen()) {
            // 冒泡
            for (let i = this.orderedLayers.length - 1; i >= 0; i--) {
                if (event.active) {
                    this.orderedLayers[i].handleEvent(event)
                    if (event instanceof CanvasMouseMoveEvent) {
                        this.orderedLayers[i].handleEvent(new CanvasGlobalMouseMoveEvent(event.position))
                    }
                } else {
                    break
                }
            }
            this.render()
        }
    }

    // 绘制指定 layer，不会刷新可视 canvas
    drawLayer(layer: Layer): HTMLCanvasElement {
        const canvas = this.layerCanvas.get(layer) as HTMLCanvasElement
        const ctx = this.layerCanvasCtx.get(layer) as CanvasRenderingContext2D
        // const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        layer.draw(ctx)
        return canvas
    }

    // 绘制指定 layer，会刷新可视 canvas
    renderLayer(layer: Layer) {
        this.drawLayer(layer)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let layer of this.orderedLayers) {
            const canvas = this.layerCanvas.get(layer) as HTMLCanvasElement
            this.ctx.drawImage(canvas, 0, 0)
        }
    }

    // 渲染
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.setTransform(this.transformMatrix.scale(EzCanvas.DevicePixelRatio, EzCanvas.DevicePixelRatio))
        for (let layer of this.orderedLayers) {
            const canvas = this.drawLayer(layer)
            this.ctx.drawImage(canvas, 0, 0)
        }
    }
}

function isMatrixEqual(a: DOMMatrix, b: DOMMatrix) {
    return a.a === b.a && a.b === b.b && a.c === b.c && a.d === b.d && a.e === b.e && a.f === b.f
}
