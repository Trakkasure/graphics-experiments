import { RoughCanvas } from "roughjs/bin/canvas";
import {Point2D, Vector2D, Bounds, Rect} from "./physics.ts";
import {Drawing,CompositeDrawing} from "./drawing.ts";
import { Movable } from "./movable.ts";

export class Obstacle extends Drawing {

    position: Point2D;
    // Award granted to player contacting this item.
    award: number;
    // Multiplier to vector of player crossing this item.
    vectorMultiplier: number;

    size: number;
    scale: number;

    constructor(x: number=0 , y: number=0, size: number=1, scale: number=80) {
        super();
        this.position = new Point2D(x,y);
        this.size=size;
        this.scale=scale;
    }

    refresh(surface: RoughCanvas,color: string="red") {
        this.drawing=surface.generator.circle(this.position.x,this.position.y,this.size*this.scale,{stroke:color,fillStyle: 'solid',fill:color});
    }

    moveTo(x: number,y: number) {
        this.position = new Point2D(x,y);
    }

    setScale(s: number=80) {
        this.scale=s;
    }

    setSize(s: number=1) {
        this.size=s;
    }
}

export class Ball extends Movable implements Rect {

    color: string = "blue";
    constructor(x: number=0 , y: number=0, private radius: number=12, mass: number=1) {
        super(x, y);
        this.mass=mass;
    }

    setColor(c) {
        this.color=c;
    }
    // tick(time: number=0,surface: RoughCanvas): void {
    //     this.edge(surface.canvas.width,surface.canvas.height);
    //     return super.tick(time,surface);
    // }

    refresh(surface: RoughCanvas): void {
        this.drawing = surface.generator.circle(0,0,this.radius*2,{stroke:this.color,fillStyle:'solid',fill:this.color});
    }


    getBounds():Bounds {
        const p = this.position;
        return {x1:p.x-this.radius,x2:p.x+this.radius,y1:p.y-this.radius,y2:p.y+this.radius};
    }

    exits(b: Bounds): boolean {
        const p = this.getBounds();
        return (
            (p.x1<b.x1||p.x2>b.x2)||
            (p.y1<b.y2||p.y2>b.y1)
        );
    }

    intersects(b: Bounds): boolean {
        const p = this.getBounds();
        return (
            (p.x1>b.x2&&p.x2<b.x1||
            p.x1<b.x2&&p.x2>b.x1)&&
            (p.y1>b.y2&&p.y2<b.y1||
            p.y1<b.y2&&p.y2>b.y1)
        );
    }

    getIntersection(obj: Rect | Bounds): Bounds {
        const b = obj.getBounds?obj.getBounds():obj;
        if (!this.intersects(b))
            return {
                x1:0,
                x2:0,
                y1:0,
                y2:0
            };
        const p = this.getBounds();
        const x = [p.x1,p.x2,b.x1,b.x2].sort();
        const y = [p.y1,p.y2,b.y1,b.y2].sort();
        return {
            x1:x[1],
            x2:x[2],
            y1:y[1],
            y2:y[2]
        };
    }

}
export class Player extends Movable {

    private _attractionVector: Vector2D;
    private _friction: number;

    constructor(x: number=0,y: number=0) {
        super(x,y);
        this._attractionVector=new Vector2D(0,0);
        this.mass=16;
        this._friction=0.25;
        this.offset=new Point2D(16,0);
    }

    tick(time,surface) {
        this.accelleration=this._attractionVector.sub(this.position).limit(5);
        super.tick(time,surface);
    }

    attractToPoint(p: Point2D) {
        this._attractionVector = new Vector2D(p.x,p.y);
    }
    refresh(surface) {
        this.drawing=surface.generator.path('L -32 8 L -32 -8Z',{stroke: "white"});
    }

    // setAngle(a: number) {
    //     this.velocity=new Vector2D({angle:a*(Math.PI/180), magnitude: this.velocity.magnitude});
    // }

}

export class Axis extends CompositeDrawing {

    w: number;
    h: number;

    constructor(w: number,h: number) {
        super()
        this.w=w;
        this.h=h;
    }

    refresh(surface) {
        const centerX = surface.canvas.width/2;
        const centerY = surface.canvas.height/2;
        this.drawings=[
            // Vertical
            surface.generator.line(centerX, centerY + this.h, centerX, centerY - this.h,{stroke:'white'}),
            // Horizontal
            surface.generator.line(centerX - this.w, centerY, this.w+centerX, centerY,{stroke:'white'})
        ]
    }
}

export class vScreen extends Drawing implements Rect {

    x1: number;
    y1: number;
    x2: number;
    y2: number;

    constructor(private w: number, private h: number) {
        super();
    }

    getBounds():Bounds {
        return {x1:this.x1,x2:this.x2,y1:this.y1,y2:this.y2};
    }

    notIntersects(b: Bounds): boolean {
        return (this.x2<b.x1||b.x2<this.x1||this.y2<b.y1||b.y2<this.y1)
    }

    intersects(b: Bounds): boolean {
        return (this.x2<b.x1||b.x2<this.x1||this.y2<b.y1||b.y2<this.y1)
    }

    getIntersection(obj: Rect | Bounds): Bounds {
        const b = obj.getBounds?obj.getBounds():obj;
        if (!this.intersects(b))
            return {
                x1:0,
                x2:0,
                y1:0,
                y2:0
            };
        const x = [this.x1,this.x2,b.x1,b.x2].sort();
        const y = [this.y1,this.y2,b.y1,b.y2].sort();
        return {
            x1:x[1],
            x2:x[2],
            y1:y[1],
            y2:y[2]
        };
    }

    refresh(surface) {
        const centerX = surface.canvas.width/2;
        const centerY = surface.canvas.height/2;
        this.x1=centerX-this.w/2;
        this.y1=centerY-this.h/2;
        this.x2=this.x1+this.w;
        this.y2=this.y1+this.h;
        this.drawing=surface.generator.rectangle(this.x1, this.y1, this.w, this.h, {stroke:'white'});
    }
}

export class VLine extends Drawing {

    vec: Vector2D;
    root: Point2D=new Point2D(0,0);
    txt: string;

    constructor(xvec:number, yvec: number, txt: string="") {
        super()
        this.vec=new Vector2D(xvec,yvec);
        this.txt=txt;
    }

    refresh(surface) {
        this.drawings=[
            surface.generator.line(this.root.x,this.root.y,this.root.x+this.vec.mx,this.root.y+this.vec.my,{stroke:'white'})
        ];
    }

    setRoot(root: Point2D) {
        this.root=root;
    };

    setVec(vec: Vector2D) {
        this.vec = vec;
    }
}

export class Food extends Obstacle {
    constructor(x: number=0 , y: number=0, size: number=1, scale: number=10) {
        super(x,y,size,scale);
        this.award=1;
        this.vectorMultiplier=1; // no change to vector motion.
    }

    refresh(surface) {
        super.refresh(surface,"green");
    }
}

export class Poison extends Obstacle {
    constructor(x: number=0 , y: number=0, size: number=1, scale: number=10) {
        super(x,y,size,scale);
        this.award=-1;
        this.vectorMultiplier=0.5; // slow a little
    }

        // this.drawing=surface.generator.circle(this.position.x,this.position.y,this.size*this.scale,{stroke:"red"})
    refresh(surface) {
        super.refresh(surface,"red");
    }
}

