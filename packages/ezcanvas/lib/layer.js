export class Layer {
    zIndex;
    widgets;
    constructor(zIndex) {
        this.zIndex = zIndex;
        this.zIndex = zIndex;
        this.widgets = [];
    }
    addWidget(widget) {
        this.widgets.push(widget);
        return this;
    }
    removeWidget(widget) {
        const index = this.widgets.indexOf(widget);
        if (index >= 0) {
            this.widgets.splice(index, 1);
        }
    }
    handleEvent(e) {
        // 冒泡阶段
        for (let i = this.widgets.length - 1; i >= 0; i--) {
            if (e.active) {
                this.widgets[i].handleEvent(e);
            }
            else {
                break;
            }
        }
        return true;
    }
    draw(ctx) {
        this.widgets.sort((a, b) => a.zIndex - b.zIndex);
        for (let widget of this.widgets) {
            widget.draw(ctx);
        }
    }
}
