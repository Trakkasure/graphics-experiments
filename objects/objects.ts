import { RoughCanvas } from "roughjs/bin/canvas";
import { RoughCanvasAsync } from "roughjs/bin/canvas-async";
import { Drawable } from "roughjs/bin/core";
import { Vector2D } from "./physics";
import { Bounds, Rect, Point2D, isRect } from "./datastructures";
import { Drawing,CompositeDrawing } from "./drawing";
import { Movable } from "./movable";

export class Obstacle extends Movable {

    // Award granted to player contacting this item.
    award: number;
    // Multiplier to vector of player crossing this item.
    vectorMultiplier: number;

    constructor(x: number=0 , y: number=0, protected _radius: number=1, protected scale: number=80) {
        super(x,y);
    }

    refresh(surface: RoughCanvas|RoughCanvasAsync,color: string="red") {
        // this.drawing=<Drawable>surface.generator.circle(this.position.x,this.position.y,this.size*this.scale,{stroke:color,fillStyle: 'solid',fill:color});
        this.drawing=<Drawable>surface.generator.circle(0,0,this._radius*this.scale,{stroke:color,fillStyle:'solid',fill:color});
    }

    getBounds():Bounds {
        return {x1:this._position.x-this._radius,x2:this._position.x+this._radius,y1:this._position.y-this._radius,y2:this._position.y+this._radius};
    }

    setScale(s: number=80) {
        this.scale=s;
    }

    setSize(s: number=1) {
        this._radius=s;
    }
}

export class Ball extends Movable {

    color: string = "blue";
    constructor(x: number=0 , y: number=0, private _radius: number=12) {
        super(x, y);
    }

    setColor(c) {
        this.color=c;
    }

    refresh(surface: RoughCanvas): void {
        // Ball is positioned based on "_position" of Movable.
        this.drawing = surface.generator.circle(0,0,this._radius*2,{stroke:this.color,fillStyle:'solid',fill:this.color});
    }

    getBounds():Bounds {
        return {x1:this._position.x-this._radius,x2:this._position.x+this._radius,y1:this._position.y-this._radius,y2:this._position.y+this._radius};
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

    getBounds(): Bounds {
        return {x1:this._position.x-4 ,y1: this._position.y-16,x2: this._position.x+4,y2: this._position.y+16};
    }

    tick(time,surface) {
        this.accelleration=this._attractionVector.sub(this._position).limit(this._turnLimit);
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

export class Box extends Movable {

    color: string="white";
    w: number;
    h: number;

    static fromBounds(b:Bounds):Box {
        return new Box(b.x1,b.y1,b.x2,b.y2);
    }
    constructor(x1:number,y1:number,x2:number,y2:number) {
        super(x1,y1);
        this.w=x2-x1;
        this.h=y2-y1;
    }

    getBounds():Bounds {
        return {x1:this._position.x+this.offset.x,x2:this._position.x+this.w+this.offset.x,y1:this._position.y+this.offset.y,y2:this._position.y+this.h+this.offset.y};
    }

    notIntersects(b: Bounds): boolean {
        const b2 = this.getBounds();
        return (b2.x2<b.x1||b2.x2<b.x1||b2.y2<b.y1||b.y2<b2.y1)
    }

    setColor(color: string):void {
        this.color=color;
    }

    refresh(surface) {
        this.drawing=surface.generator.rectangle(0,0, this.w, this.h, {stroke:this.color});
    }

    setSize(w: number,h: number) {
        // Force drawing update on demand of render.
        this.drawing=null;
        this.w=w;
        this.h=h;
    }
}

export class vScreen extends Box {

    constructor(w: number, h: number) {
        super(0,0,w,h);
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
            surface.generator.line(this.root.x,this.root.y,this.root.x+this.vec.mx,this.root.y+this.vec.my,{stroke:this.color});
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

