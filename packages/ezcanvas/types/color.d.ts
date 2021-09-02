export interface Color {
    toRgbaStr(): string;
}
export declare class Rgba implements Color {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a: number);
    toRgbaStr(): string;
}
export declare class HexColor implements Color {
    value: string;
    constructor(value: string);
    toRgbaStr(): string;
    toRgba(): Rgba;
}
