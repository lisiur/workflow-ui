import { Widget } from './widget';
import { CanvasEvent } from './event';
export declare class Layer {
    zIndex: number;
    private readonly widgets;
    constructor(zIndex: number);
    addWidget(widget: Widget): Layer;
    removeWidget(widget: Widget): void;
    handleEvent(e: CanvasEvent): boolean;
    draw(ctx: CanvasRenderingContext2D): void;
}
