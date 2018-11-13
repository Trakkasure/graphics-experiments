import { RoughCanvas } from "roughjs/bin/canvas";
import { Drawable } from "roughjs/bin/core";

export class Point2D {
    // Point
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x=x;
        this.y=y
    }

    add(v: Vector2D) {
        return new Point2D(v.mx+this.x,v.my+this.y);
    }
}
export class Vector2D {
    // Using magnitude per-axis method for vectors.
    /**
     * Magnitude of X axis
     */
    readonly mx: number;
    /**
     * Magnitude of Y axis
     */
    readonly my: number;

    /**
     * Calculated angle in radians of vector. 0 degrees is x=0,y=any
     */
    readonly angle: number;

    /**
     * Calculated magnitude of vector based on x/y magnitudes.
     * Math.sqrt(Math.pow(x,2)+Math.pow(y,2))
     */
    readonly magnitude: number;

    constructor(vect: {angle: number, magnitude: number});
    constructor(vect: {mx: number, my: number});
    constructor(vect: number, vecty: number)
    constructor(vect,vecty?) {
        if (vect.hasOwnProperty('angle')) {
            this.angle=vect.angle;
            this.magnitude=vect.magnitude;
            this.mx=Math.cos(vect.angle)*vect.magnitude;
            this.my=Math.sin(vect.angle)*vect.magnitude;
        } else {
            if(typeof(vect) === 'number') {
                vect={mx:vect,my:vecty};
            }
            this.angle=Math.atan2(vect.my,vect.mx);
            this.magnitude=Math.sqrt(Math.pow(vect.mx,2)+Math.pow(vect.my,2))
            this.mx=vect.mx;
            this.my=vect.my;
        }
    }

    /**
     * Add the ivector with another.
     * @param v Vector to add
     */
    add(v: Vector2D | Point2D | number):Vector2D {
        if (typeof(v)==='number') {
            return new Vector2D(this.mx+v,this.my+v);
        }
        if (v instanceof Point2D) {
            return new Vector2D({mx:this.mx+v.x, my: this.my+v.y})
        }
        return new Vector2D({mx:this.mx+v.mx, my: this.my+v.my})
    }

    /**
     * Subtract the vector with another.
     * @param v Vector to subtract
     */
    sub(v: Vector2D | Point2D | number):Vector2D {
        if (typeof(v)==='number') {
            return new Vector2D(this.mx-v,this.my-v);
        }
        if (v instanceof Point2D) {
            return new Vector2D({mx:this.mx-v.x, my: this.my-v.y})
        }
        return new Vector2D({mx:this.mx-v.mx, my: this.my-v.my})
    }

    /**
     * Scale the vector
     * @param scale Amount to scale the vector
     */
    scale(scale: number):Vector2D {
        return new Vector2D({angle:this.angle,magnitude:this.magnitude*scale});
    }

    rotate(angle: number): Vector2D {
        var mx = this.mx;
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        return new Vector2D(c * this.mx - s * this.my, s * mx + c * this.my);
    }
  
    /**
     * Multiply vector with another vector.
     * @param v Vector to multiply with
     */
    mult(v: Vector2D | Point2D | number):Vector2D {
        if (typeof(v)==='number') {
            return new Vector2D(this.mx*v,this.my*v);
        }
        if (v instanceof Point2D) {
            v = new Vector2D(v.x,v.y);
        }
        return new Vector2D({mx:v.mx*this.mx,my:v.my*this.my});
    }

    /**
     * Divide vector with another vector.
     * @param v Vector to multiply with
     */
    div(v: Vector2D | Point2D | number):Vector2D {
        if (typeof(v)==='number') {
            return new Vector2D(this.mx/v,this.my/v);
        }
        if (v instanceof Point2D) {
            return new Vector2D(this.mx/v.x,this.my/v.y)
        }
        // return new Vector2D({angle:this.angle,magnitude:this.magnitude/v.magnitude});
        return new Vector2D({mx:v.mx/this.mx,my:v.my/this.my});
    }

    /**
     * Get a normalized version of the vector. (Magnatude of 1)
     */
    normalize(): Vector2D {
        return this.magnitude>0?this.div(this.magnitude):this;
    }

    limit(magnitude: number): Vector2D {
        if (this.magnitude > magnitude) {
            return this.normalize().mult(magnitude);
        }
        return this;
    }
   
    angleBetween(v: Vector2D): number {
        return Math.acos(this.dot(v) / Math.sqrt(this.magnitude*this.magnitude * v.magnitude*this.magnitude));
    };

    dist(v: Vector2D): number {
        const dx=Math.pow(this.mx-v.mx,2);
        const dy=Math.pow(this.my-v.my,2);
        return Math.sqrt(dx+dy);
    }

    dot(v: Vector2D): number {
        return this.mx*v.mx+this.my*v.my;
    }

    lerp(v: Vector2D, amt:number): Vector2D
    lerp(mx: number, my: number,amt: number): Vector2D 
    lerp(v,my,amt?) {
        const lerpVal = (start:number, stop:number, amt:number)=>start+(stop-start)*amt;
        var mx:number=v;
        (v instanceof Vector2D)&&(amt=my,{mx,my}=v);
        return new Vector2D(lerpVal(this.mx,mx,amt),lerpVal(this.my,my,amt));
    }
}

export abstract class Drawing {

    surface: RoughCanvas;
    drawing: Drawable;
    offset: Point2D=new Point2D(0,0);

    /** 
     * Re-create the Drawing object.
     */
    abstract refresh(surface: RoughCanvas): void;

    /**
     * Default function for draw.
     * Most extenders should call this (as super)
     */ 
    draw(surface: RoughCanvas): void {
        !this.drawing&&this.refresh(surface);
        surface.ctx.save();
        surface.ctx.translate(this.offset.x,this.offset.y);
        surface.draw(this.drawing);
        surface.ctx.restore();
    }
}

export abstract class CompositeDrawing extends Drawing {

    drawings: Drawing[]=null;

    set drawing(d) {this.drawings=[d];}
    draw(surface: RoughCanvas): void {
        !this.drawings&&this.refresh(surface);
        this.drawings.forEach(surface.draw.bind(surface));
    }
}
export abstract class Movable extends Drawing {
    
    // Point: Position
    position: Point2D;

    // Velocity: Change to position.
    velocity: Vector2D=new Vector2D(0,0);

    maxSpeed: number=0;

    // Change to velocity
    accelleration: Vector2D=new Vector2D(0,0);
    
    // Mass of Movable
    mass: number;

    private _linkedTo: Drawing[]=[];
    private _attachedTo: Drawing[]=[];

    constructor(x: number, y: number) {
        super();
        this.position = new Point2D(x,y);
    }

    // Handle default movement based on "accelleration".
    tick(time:number=0,surface: RoughCanvas): void {
        this.velocity = this.velocity.add(this.accelleration).limit(this.maxSpeed);
        this.position = this.position.add(this.velocity);
        (!(time%10))&&this.refresh(surface);
        this.accelleration=new Vector2D(0,0);
    }

    attach(drawable: Drawing|CompositeDrawing, position: number=-1): void {
        if (position==-1)
            this._attachedTo.push(drawable);
        else this._attachedTo.splice(position,0,drawable);
    }

    link(drawable: Drawing|CompositeDrawing, position: number=-1): void {
        if (position==-1)
            this._linkedTo.push(drawable);
        else this._linkedTo.splice(position,0,drawable);
    }

    draw(surface,time: number=0): void {
        // save current rotation.
        surface.ctx.save();
        surface.ctx.translate(this.position.x,this.position.y);
        this._linkedTo.forEach(l=>l.draw(surface));
        surface.ctx.rotate(this.velocity.angle);
        this._attachedTo.forEach(a=>a.draw(surface));
        super.draw(surface);
        // restore rotation
        surface.ctx.restore();
    }

    moveTo(x: number,y: number) {
        this.position = new Point2D(x,y);
    }

    applyForce(f: Vector2D) {
        this.accelleration=this.accelleration.add(f);
    }
}

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

interface Bounds {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
interface Rect {
    getBounds(): Bounds;
    intersects(obj: Rect | Bounds): boolean;
    exits(obj: Rect | Bounds): boolean;
    getIntersection(obj: Rect | Bounds): Bounds;
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
export class Animator {

    sprites: Drawing[];
    running: boolean=false;
    stepping: number = 1/60; // multiply this times magnitude of vector each frame to get next position.
    frameRate: number = 60;  // expected frame rate
    surface: RoughCanvas;

    private time: number = 0;

    constructor(r: RoughCanvas,sprites: Drawing[]=[]) {
        this.surface = r;
        this.sprites = sprites;
    }

    start():void {
        if (this.running) return
        this.running = true;
        requestAnimationFrame(this.animate.bind(this));
    }

    stop():void {
        this.running = false;
    }

    tick():void { 
    }
    
    animate(time):void {
        if (!this.running) return;
        const diff=time-this.time;
        this.time=time;
        this.tick(time,this.surface);
        this.draw(diff);
        requestAnimationFrame(this.animate.bind(this));
    }

    draw(time: number = 0, clear: boolean=true):void {
        if (clear) this.surface.ctx.clearRect(0,0,this.surface.canvas.width,this.surface.canvas.height);
        for (let sprite of this.sprites) {
            if (sprite instanceof Movable) {
                sprite.tick(time,this.surface);
            }
            sprite.draw(this.surface);
        }
    }

    add(sprite: Drawing | Drawing[],position: number=-1): void {
        if (position==-1) {
            if (Array.isArray(sprite))
                this.sprites=this.sprites.concat(sprite);
            else this.sprites.push(sprite)
        } else {
            if (Array.isArray(sprite))
                this.sprites.splice.call(this.sprites,position,0,...sprite);
            else 
                this.sprites.splice.call(this.sprites,position,0,sprite);
        }
    }

    remove(sprite: Drawing | number):void {
        if (typeof(sprite)!=='number') {
            sprite=this.sprites.findIndex(n=>n===sprite);
            if (sprite==-1) return;
        }
        this.sprites.splice(sprite,1);
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

