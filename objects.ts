import {RoughCanvas, Drawing} from './RoughCanvas';

class Point2D {
    // Point
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x=x;
        this.y=y
    }
}
class Vector2D {
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
    constructor(vect) {
        if (vect.hasOwnProperty('angle')) {
            this.angle=vect.angle;
            this.magnitude=vect.magnitude;
            this.mx=Math.cos(vect.angle)*vect.magnitude;
            this.my=Math.sin(vect.angle)*vect.magnitude;
        } else {
            this.angle=Math.atan2(vect.my,vect.mx);
            this.magnitude=Math.sqrt(Math.pow(vect.x,2)+Math.pow(vect.y,2))
            this.mx=vect.mx;
            this.my=vect.my;
        }
    }

    add(v: Vector2D) {
        return new Vector2D({mx:this.mx+v.mx, my: this.my+v.my})
    }

    sub(v: Vector2D) {
        return new Vector2D({mx:this.mx-v.mx, my: this.my-v.my})
    }

    mult(v: Vector2D) {
        return new Vector2D({mx:this.mx*v.mx, my: this.my*v.my})
    }
}

abstract class Drawable {

    surface: RoughCanvas;
    drawing: Drawing;

    /** 
     * Re-create the Drawable object.
     */
    abstract refresh(surface: RoughCanvas): void;

    /**
     * Default function for draw.
     * Most extenders should call this (as super)
     */ 
    draw(surface: RoughCanvas): void {
        !this.drawing&&this.refresh(surface);
        surface.draw(this.drawing);
    }
}
    
export abstract class Movable extends Drawable {
    
    // Point
    p: Point2D;

    v: Vector2D;

    // Incremental change over time (per tick)
    accelleration: number;

    private _linkedTo: Drawable[];
    private _attachedTo: Drawable[];

    constructor(x: number, y: number, angle: number=0, magnitude: number=0) {
        super();
        this.p = new Point2D(x,y);
        this.v = new Vector2D({angle,magnitude});
    }

    tick(time:number=0): void {}

    attach(drawable: Drawable, position: number=-1): void {
        if (position==-1)
            this._attachedTo.push(drawable);
        else this._attachedTo.splice(position,0,drawable);
    }

    link(drawable: Drawable, position: number=-1): void {
        if (position==-1)
            this._linkedTo.push(drawable);
        else this._linkedTo.splice(position,0,drawable);
    }

    draw(surface,time: number=0): void {
        // save current rotation.
        this.tick(time); // allow drawable object to do something before it's drawn
        surface.ctx.save();
        surface.ctx.translate(this.p.x,this.p.y);
        this._linkedTo&&this._linkedTo.draw(surface);
        surface.ctx.rotate(this.v.angle);
        this._attachedTo&&this._attachedTo.draw(surface);
        super.draw(surface);
        // restore rotation
        surface.ctx.restore();
    }

    moveTo(x: number,y: number) {
        this.p = new Point2D(x,y);
    }

    /**
     * Move origin along the current vector.
     * @param stepping Perportional Amount to move along vector based on magnitude.
     * @return the new origin.
     */
    move(stepping: number): Point2D {
        // return this.p.add({x:this.v.magnitude*stepping,y: this.v.magnitude*stepping
        return this.p;
    }

}

export class Obstacle extends Drawable {

    p: Point2D;
    // Award granted to player contacting this item.
    award: number;
    // Multiplier to vector of player crossing this item.
    vectorMultiplier: number;

    size: number;
    scale: number;

    constructor(x: number=0 , y: number=0, size: number=1, scale: number=80) {
        super();
        this.p = new Point2D(x,y);
        this.size=size;
        this.scale=scale;
    }

    refresh(surface) {
        this.drawing=surface.generator.circle(this.p.x,this.p.y,this.size*this.scale);
    }

    moveTo(x: number,y: number) {
        this.p = new Point2D(x,y);
    }

    setScale(s: number=80) {
        this.scale=s;
    }

    setSize(s: number=1) {
        this.size=s;
    }
}

export class Player extends Movable  {

    path: string;

    constructor(x: number=0,y: number=0,angle: number=0) {
        super(x,y,angle,0);
    }

    tick(time) {
        console.log("Angle:",this.v.angle*180/Math.PI)
    }
    refresh(surface) {
        this.drawing=surface.generator.path('M -8 16 L 8 16 L 0 -16Z',{stroke: "white"});
    }

    setAngle(a: number) {
        this.v=new Vector2D({angle:(a/180*Math.PI), magnitude: this.v.magnitude});
    }
}

export class Animator {

    sprites: Drawable[];
    running: boolean=false;
    stepping: number = 1/60; // multiply this times magnitude of vector each frame to get next position.
    frameRate: number = 60;  // expected frame rate
    surface: RoughCanvas;

    private time: number = 0;

    constructor(r: RoughCanvas,sprites: Drawable[]=[]) {
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

    animate(time):void {
        if (!this.running) return;
        const diff=time-this.time;
        this.time=time;
        this.draw(diff);
        requestAnimationFrame(this.animate.bind(this));
    }

    draw(time: number = 0, clear: boolean=true):void {
        if (clear) this.surface.ctx.clearRect(0,0,this.surface.canvas.width,this.surface.canvas.height);
        for (let sprite of this.sprites) {
            if (sprite instanceof Movable) {
                sprite.p = sprite.move(this.stepping);
            }
            sprite.draw(this.surface);
        }
    }

    add(sprite: Drawable | Drawable[],position: number=-1): void {
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

    remove(sprite: Drawable | number):void {
        if (typeof(sprite)!=='number') {
            sprite=this.sprites.findIndex(n=>n===sprite);
            if (sprite==-1) return;
        }
        this.sprites.splice(sprite,1);
    }
}

export class Food extends Obstacle {
    constructor(x: number=0 , y: number=0, size: number=1, scale: number=80) {
        super(x,y,size,scale);
        this.award=1;
        this.vectorMultiplier=1; // no change to vector motion.
    }
}

export class Poison extends Obstacle {
    constructor(x: number=0 , y: number=0, size: number=1, scale: number=80) {
        super(x,y,size,scale);
        this.award=-1;
        this.vectorMultiplier=0.5; // slow a little
    }
}

