
import { RoughCanvas } from "roughjs/bin/canvas";
import { Drawing } from "./Drawing";
import { Movable } from "./Movable";

export interface Animatable {
    tick(time: number, surface: any);
}

export function isAnimatable(o: object): o is Animatable {return typeof((<Animatable>o).tick)=='function'}
export function isAnimator(o: object): o is Animator {return o instanceof Animator}

export type TickListener = (tick:number,surface:RoughCanvas)=>void;

export class Animator { 

    sprites: Array<Drawing>;
    running: boolean=false;
    stepping: number = 1/60; // multiply this times magnitude of vector each frame to get next position.
    frameRate: number = 60;  // expected frame rate
    surface: RoughCanvas;
    clearFrame: boolean=true;
    tickListeners: Array<TickListener>=[];

    private time: number = 0;

    constructor(r: RoughCanvas,sprites: Array<Drawing>=[]) {
        this.surface = r;
        this.sprites = sprites;
    }

    clearFrames(b:boolean):void {
        this.clearFrame=b;
    }

    start():void {
        if (this.running) return
        this.running = true;
    }

    stop():void {
        this.running = false;
    }

    addTickListener(func: TickListener) {
        if (this.tickListeners.includes(func)) return;
        this.tickListeners.push(func);
    }
    
    removeTickListener(func: TickListener) {
        if (!this.tickListeners.includes(func)) return;
        this.tickListeners.splice(this.tickListeners.indexOf(func),1);
    }
    
    animate(gameTick:number,time:number):void {
        if (!this.running) return;
        const diff=time-this.time;
        this.time=time;
        this.tickListeners.forEach(l=>l.call(this,time,this.surface));
        this.draw(diff);
    }

    draw(time: number = 0):void {
        if (this.clearFrame) this.surface.ctx.clearRect(0,0,this.surface.canvas.width,this.surface.canvas.height);
        for (let sprite of this.sprites) {
            if (isAnimatable(sprite)) {
                sprite.tick(time,this.surface);
            }
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
