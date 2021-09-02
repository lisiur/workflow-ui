export interface Color {
    toRgbaStr(): string;
}

export class Rgba implements Color {
    constructor(public r: number, public g: number, public b: number, public a: number) {
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }

    toRgbaStr(): string {
        const {r, g, b, a} = this
        return `rgba(${r},${g},${b},${a})`
    }
}

export class HexColor implements Color {
    constructor(public value: string) {
        this.value = value.toLowerCase()
        if (this.value.length === 7) {
            this.value += 'ff'
        }
    }

    toRgbaStr(): string {
        return this.toRgba().toRgbaStr()
    }

    toRgba(): Rgba {
        const hexR = this.value.slice(1, 3)
        const hexG = this.value.slice(3, 5)
        const hexB = this.value.slice(5, 7)
        const hexA = this.value.slice(7, 9)
        const r = parseInt(hexR, 16)
        const g = parseInt(hexG, 16)
        const b = parseInt(hexB, 16)
        const a = +(parseInt(hexA, 16) / 255).toFixed(2)
        return new Rgba(r, g, b, a)
    }

}
