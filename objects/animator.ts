
import { RoughCanvas } from "roughjs/bin/canvas";
import { Drawing } from "./drawing";
import { Movable } from "./movable";

export class Animator {

    sprites: Drawing[];
    running: boolean=false;
    stepping: number = 1/60; // multiply this times magnitude of vector each frame to get next position.
    frameRate: number = 60;  // expected frame rate
    surface: RoughCanvas;
    clearFrame: boolean=true;

    private time: number = 0;

    constructor(r: RoughCanvas,sprites: Drawing[]=[]) {
        this.surface = r;
        this.sprites = sprites;
    }

    clearFrames(b:boolean):void {
        this.clearFrame=b;
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

    draw(time: number = 0):void {
        if (this.clearFrame) this.surface.ctx.clearRect(0,0,this.surface.canvas.width,this.surface.canvas.height);
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
