import {RoughCanvas, Drawing} from './RoughCanvas';

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

    toString() {
        return `[${this.mx},${this.my}/${this.angle*180/Math.PI}°,${this.magnitude}→]`;
    }

    valueOf() {
        return `[${this.mx},${this.my}/${this.angle*180/Math.PI}°,${this.magnitude}→]`;
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
    sub(v: Vector2D | Point2D):Vector2D {
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
            // return new Vector2D({angle:this.angle,magnitude:this.magnitude*(Math.sqrt(v.x*v.x+v.y*v.y))})
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
        return new Vector2D({mx:this.mx/this.magnitude,my:this.my/this.magnitude});
    }

    limit(magnitude: number) {
        if (this.magnitude > magnitude) {
            return this.normalize().mult(magnitude);
        }
        return this;
    }
    

}

export abstract class Drawable {

    surface: RoughCanvas;
    drawing: Drawing;
    offset: Point2D=new Point2D(0,0);

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
        surface.ctx.save();
        surface.ctx.translate(this.offset.x,this.offset.y);
        surface.draw(this.drawing);
        surface.ctx.restore();
    }
}
    
export abstract class CompositeDrawable extends Drawable {

    drawings: Drawing[]=null;

    set drawing(d) {this.drawings=[d];}
    draw(surface: RoughCanvas): void {
        !this.drawings&&this.refresh(surface);
        this.drawings.forEach(surface.draw.bind(surface));
    }
}
export abstract class Movable extends Drawable {
    
    // Point: Position
    position: Point2D;

    // Velocity: Change to position.
    velocity: Vector2D;

    maxSpeed: number=0;

    // Change to velocity
    accelleration: Vector2D=new Vector2D({mx:0,my:0});
    
    // Mass of Movable
    mass: number;

    private _linkedTo: Drawable[]=[];
    private _attachedTo: Drawable[]=[];

    constructor(x: number, y: number, angle: number=0, magnitude: number=0) {
        super();
        this.position = new Point2D(x,y);
        this.velocity = new Vector2D({angle,magnitude});
    }

    // Handle default movement based on "v".
    tick(time:number=0,surface: RoughCanvas): void {
        this.velocity = this.velocity.add(this.accelleration).limit(this.mass/5);
        this.position = this.position.add(this.velocity);
        (!(time%10))&&this.refresh(surface);
    }

    attach(drawable: Drawable|CompositeDrawable, position: number=-1): void {
        if (position==-1)
            this._attachedTo.push(drawable);
        else this._attachedTo.splice(position,0,drawable);
    }

    link(drawable: Drawable|CompositeDrawable, position: number=-1): void {
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

    /**
     * Move origin along the current vector.
     * @param stepping Perportional Amount to move along vector based on magnitude.
     * @return the new origin.
     */
    move(stepping: number): Point2D {
        return this.position;
    }

    applyForce(f: Vector2D) {
        this.accelleration=this.accelleration.add(f);//.scale(1/(this.mass*this.mass)));
    }
}

export class Obstacle extends Drawable {

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

    refresh(surface: RoughCanvas,color: string) {
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

export class Player extends Movable  {

    path: string;

    private _attractionVector: Vector2D;
    private _friction: number;

    constructor(x: number=0,y: number=0,angle: number=0,magnitude: number=0) {
        super(x,y,angle,magnitude);
        this._attractionVector=new Vector2D(0,0);
        this.mass=16;
        this._friction=0.25;
        this.offset=new Point2D(16,0);
        this.setAngle(angle); // adjust for rotation.
    }

    tick(time,surface) {
        this.accelleration=this._attractionVector.sub(this.position).scale(1/(this.mass*this.mass));
        super.tick(time,surface);
    }

    attractToPoint(p: Point2D) {
        this._attractionVector = new Vector2D(p.x,p.y);
    }
    refresh(surface) {
        this.drawing=surface.generator.path('L -32 8 L -32 -8Z',{stroke: "white"});
    }

    setAngle(a: number) {
        this.velocity=new Vector2D({angle:a*(Math.PI/180), magnitude: this.velocity.magnitude});
    }

}

export class Axis extends CompositeDrawable {

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
            surface.generator.line(centerX, centerY, centerX, centerY - this.h),
            surface.generator.line(centerX, centerY, this.w+centerX, centerY)
        ]
    }
}

export class VLine extends CompositeDrawable {

    vec: Point2D;
    txt: string;

    constructor(xvec:number, yvec: number, txt: string="") {
        super()
        this.vec=new Point2D(xvec,yvec);
        this.txt=txt;
    }

    refresh(surface) {
        this.drawings=[
            surface.generator.line(0,0,this.vec.x,this.vec.y,{stroke:'white'})
        ];
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
                sprite.tick(time,this.surface);
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

