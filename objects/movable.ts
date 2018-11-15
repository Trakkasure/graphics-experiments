import { RoughCanvas } from "roughjs/bin/canvas";
import {Vector2D} from "./physics";
import {Point2D} from "./datastructures";
import {Drawing,CompositeDrawing} from "./drawing";

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