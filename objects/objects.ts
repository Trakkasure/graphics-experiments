import { RoughCanvas } from "roughjs/bin/canvas";
import { RoughCanvasAsync } from "roughjs/bin/canvas-async";
import { Drawable } from "roughjs/bin/core";
import { Vector2D } from "./physics";
import { Bounds, Rect, Point2D, isRect } from "./datastructures";
import { Drawing,CompositeDrawing } from "./drawing";
import { Movable } from "./movable";

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

    refresh(surface: RoughCanvas|RoughCanvasAsync,color: string="red") {
        this.drawing=<Drawable>surface.generator.circle(this.position.x,this.position.y,this.size*this.scale,{stroke:color,fillStyle: 'solid',fill:color});
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

    /* Returns true if point is within the tree */
    contains(p: Point2D) {
        const b = this.getBounds();
        return (
            (p.x<=b.x2&&p.x>b.x1)&&
            (p.y<=b.y2&&p.y>b.y1)
        );
    }

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

    // intersects(b: Bounds): boolean {
    //     const p = this.getBounds();
    //     return (
    //         (p.x1>b.x2&&p.x2<b.x1||
    //         p.x1<b.x2&&p.x2>b.x1)&&
    //         (p.y1>b.y2&&p.y2<b.y1||
    //         p.y1<b.y2&&p.y2>b.y1)
    //     );
    // }

    /* Returns true if all vertexes are within bounds */
    intersects(obj: Rect | Bounds): boolean {
        const b = isRect(obj)?obj.getBounds():obj;
        return (
            this.contains(<Point2D>{x:b.x1,y:b.y1})
            &&this.contains(<Point2D>{x:b.x2,y:b.y1})
            &&this.contains(<Point2D>{x:b.x1,y:b.y2})
            &&this.contains(<Point2D>{x:b.x2,y:b.y2})
        );
    }

    getIntersection(obj: Rect | Bounds): Bounds {
        const b = isRect(obj)?obj.getBounds():obj;
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

    // Point that this object is attracted to.
    private _attractionVector: Vector2D;
    
    // Friction force that slows movement and angular adjustments.
    private _friction: number;

    // Friction will eventually take over this value
    private _turnLimit: number=3;

    constructor(x: number=0,y: number=0) {
        super(x,y);
        this._attractionVector=new Vector2D(0,0);
        this.mass=16;
        this._friction=0.25;
        this.offset=new Point2D(16,0);
    }

    tick(time,surface) {
        this.accelleration=this._attractionVector.sub(this.position).limit(this._turnLimit);
        super.tick(time,surface);
    }

    // Directly change angle.
    setAngle(degrees: number) {
        this.velocity=new Vector2D({angle:degrees*Math.PI/180,magnitude:this.velocity.magnitude});
    }

    // Gradually attract to a point 
    attractToPoint(p: Point2D) {
        this._attractionVector = new Vector2D(p.x,p.y);
    }

    refresh(surface) {
        this.drawing=surface.generator.path('L -32 8 L -32 -8Z',{stroke: "white"});
    }
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

export class Box extends Drawing implements Rect {

    color: string="white";
    static fromBounds(b:Bounds):Box {
        return new Box(b.x1,b.y1,b.x2,b.y2);
    }
    constructor(protected x1:number,protected y1:number,protected x2:number,protected y2:number) {
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

    /* Returns true if point is within the tree */
    contains(p: Point2D) {
        const b = this.getBounds();
        return (
            (p.x<=b.x2&&p.x>b.x1)&&
            (p.y<=b.y2&&p.y>b.y1)
        );
    }

    getIntersection(obj: Rect | Bounds): Bounds {
        const b = isRect(obj)?obj.getBounds():obj;
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

    exits(b: Bounds): boolean {
        const p = this.getBounds();
        return (
            (p.x1<b.x1||p.x2>b.x2)||
            (p.y1<b.y2||p.y2>b.y1)
        );
    }

    setColor(color: string):void {
        this.color=color;
    }

    refresh(surface) {
        const w=this.x2-this.x1;
        const h=this.y2-this.y1;
        this.drawing=surface.generator.rectangle(this.x1, this.y1, w, h, {stroke:this.color});
    }
}

export class vScreen extends Box implements Rect {

    constructor(private w: number, private h: number) {
        super(0,0,0,0);
    }

    refresh(surface) {
        const centerX = surface.canvas.width/2;
        const centerY = surface.canvas.height/2;
        this.x1=centerX-this.w/2;
        this.y1=centerY-this.h/2;
        this.x2=this.x1+this.w;
        this.y2=this.y1+this.h;
        this.drawing=surface.generator.rectangle(this.x1, this.y1, this.w, this.h, {stroke:this.color});
    }
}

export class VLine extends Drawing {

    vec: Vector2D;
    root: Point2D=new Point2D(0,0);
    txt: string;
    color: string="white";

    constructor(xvec:number, yvec: number, txt: string="") {
        super()
        this.vec=new Vector2D(xvec,yvec);
        this.txt=txt;
    }

    setColor(color:string) {
        this.color=color;
    }
    refresh(surface) {
        this.drawing=
            surface.generator.line(this.root.x,this.root.y,this.root.x+this.vec.mx,this.root.y+this.vec.my,{stroke:this.color})
        ;
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

