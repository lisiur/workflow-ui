import { Layer } from './layer';
import { Vec2 } from './math/vec2';
import { Widget } from './widget';
export declare class EzCanvas {
    canvas: HTMLCanvasElement;
    static DevicePixelRatio: number;
    private readonly ctx;
    private layers;
    private readonly orderedLayers;
    private layerCanvas;
    private layerCanvasCtx;
    readonly defaultLayer: Layer;
    private transformMatrix;
    private inverseTransformMatrix;
    constructor(canvas: HTMLCanvasElement);
    init(): void;
    setTransform(matrix: DOMMatrix): void;
    addWidget(widget: Widget): void;
    addWidgetToLayer(layerName: string, widget: Widget): void;
    addLayer(name: string, layer: Layer): void;
    syncLayerCanvas(layer: Layer): void;
    autoResize(): void;
    resizeCanvasToDisplaySize(): void;
    translateDomPosition(x: number, y: number): Vec2;
    handleEvents(): Promise<void>;
    drawLayer(layer: Layer): HTMLCanvasElement;
    renderLayer(layer: Layer): void;
    render(): void;
}
