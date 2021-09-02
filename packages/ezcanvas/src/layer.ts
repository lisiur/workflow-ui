import {Widget} from './widget'
import {CanvasEvent, CanvasMouseEvent} from './event'

export class Layer {
    private readonly widgets: Widget[]
    constructor(public zIndex: number) {
        this.zIndex = zIndex
        this.widgets = []
    }

    addWidget(widget: Widget): Layer {
        this.widgets.push(widget)
        return this
    }

    removeWidget(widget: Widget) {
        const index = this.widgets.indexOf(widget)
        if (index >= 0) {
            this.widgets.splice(index, 1)
        }
    }

    handleEvent(e: CanvasEvent): boolean {
        // 冒泡阶段
        for (let i = this.widgets.length - 1; i>= 0; i--) {
            if (e.active) {
                this.widgets[i].handleEvent(e)
            } else {
                break
            }
        }
        return true
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.widgets.sort((a, b) => a.zIndex - b.zIndex)
        for (let widget of this.widgets) {
            widget.draw(ctx)
        }
    }
}
