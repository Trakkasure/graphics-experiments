import {RoughCanvas, Drawing} from './RoughCanvas.js';
import { autobind } from 'core-decorators';


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

interface Vector {
    // Point
    x: number;
    y: number;
    // Angle
    angle: number;
    // Speed
    velocity: number;
}

export abstract class Movable extends Drawable implements Vector {
    
    // Point
    x: number;
    y: number;
    // Angle
    angle: number;
    // Speed
    velocity: number;

    // Incremental change over time (per tick)
    accelleration: number;

    private _linkedTo: Drawable;

    constructor(x: number, y: number, angle: number=0, velocity: number=0) {
        super();
    }

    tick(): void {}

    link(drawable: Drawable): void {
        this._linkedTo=drawable;
    }

    draw(surface): void {
        // save current rotation.
        this.tick();
        surface.ctx.save();
        surface.ctx.translate(this.x,this.y);
        this._linkedTo&&this._linkedTo.draw(surface);
        surface.ctx.rotate(this.angle);
        super.draw(surface);
        // surface.draw(this.drawing);
        // restore rotation
        surface.ctx.restore();
    }
}

export class Obstacle extends Drawable {

    // Award granted to player contacting this item.
    award: number;
    // Multiplier to vector of player crossing this item.
    vectorMultiplier: number;
    x: number;
    y: number;
    size: number;
    scale: number;

    constructor(x: number=0 , y: number=0, size: number=1, scale: number=80) {
        super();
        this.x=x;
        this.y=y;
        this.size=size;
        this.scale=scale;
    }

    refresh(surface) {
        this.drawing=surface.generator.circle(this.x,this.y,this.size*this.scale);
    }

    moveTo(x: number,y: number) {
        this.x=x;
        this.y=y;
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
        super(x,y,angle);
        this.x=x;
        this.y=y;
        this.angle=angle;
    }

    refresh(surface) {
        this.drawing=surface.generator.path('M -8 16 L 8 16 L 0 -16Z',{stroke: "white"});
    }

    setAngle(a: number) {
        this.angle=(Math.PI/180)*a;
    }

    moveTo(x: number,y: number) {
        this.x=x;
        this.y=y;
    }
}

export class Animator {

    sprites: Drawable[];
    running: boolean=false;
    surface: RoughCanvas;

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

    animate():void {
        if (!this.running) return;
        this.draw();
        requestAnimationFrame(this.animate.bind(this));
    }

    draw(clear: boolean=true):void {
        if (clear) this.surface.ctx.clearRect(0,0,this.surface.canvas.width,this.surface.canvas.height);
        for (let sprite of this.sprites) {
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

