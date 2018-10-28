interface Ops {
    op: string;
    data: Array<number>;
}
interface OpSet {
    type: string;
    ops: Array<Ops>;
}

interface DrawOptions {
    maxRandomnessOffset?: number;
    roughness?: number;
    bowing?: number;
    stroke?: string;
    strokeWidth?: number;
    curveTightness?: number;
    curveStepCount?: number;
    fillStyle?: string;
    fillWeight?: number;
    hachureAngle?: number;
    hachureGap?: number;
}

export interface Drawing {
    shape: string;
    sets: Array<OpSet>;
    options: DrawOptions;
}
export interface RoughCanvas {
    line(x1: number, y1: number, x2: number, y2: number, options?: DrawOptions): Drawing;
    rectangle(x: number, y: number, width: number, height: number, options?: DrawOptions): Drawing;
    ellipse(x: number, y: number, width: number, height: number, options?: DrawOptions): Drawing;
    circle(x: number, y: number, diamerer: number, options?: DrawOptions): Drawing;
    linearPath(points: Array<number[]>, options?: DrawOptions): Drawing;
    path(path: string, options?: DrawOptions);
    draw(drawing: Drawing): void;
    generator: RoughCanvas;
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
}

export interface RoughSVG {
    line(x1: number, y1: number, x2: number, y2: number, options?: DrawOptions): HTMLElement;
    rectangle(x: number, y: number, width: number, height: number, options?: DrawOptions): HTMLElement;
    ellipse(x: number, y: number, width: number, height: number, options?: DrawOptions): HTMLElement;
    circle(x: number, y: number, diamerer: number, options?: DrawOptions): HTMLElement;
    linearPath(points: Array<number[]>, options?: DrawOptions): HTMLElement;
    draw(drawing: Drawing);
    generator: RoughCanvas;
}

export interface RoughJS {
    canvas(canvas: HTMLCanvasElement, config?: object): RoughCanvas;
    svg(svgRoot: HTMLElement, config?: object): RoughSVG;
}