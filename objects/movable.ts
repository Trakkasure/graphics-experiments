import { RoughCanvas } from "roughjs/bin/canvas";
import {Vector2D} from "./physics";
import {Point2D, Rect, isRect, Bounds} from "./datastructures";
import {Drawing,CompositeDrawing} from "./drawing";

// Rect is for defining bounding box. Used mostly for collision detection.
export abstract class Movable extends Drawing implements Rect {
    
    // Point: Position
    protected _position: Point2D;

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
        this._position = new Point2D(x,y);
    }

    // Handle default movement based on "accelleration".
    tick(time:number=0,surface: RoughCanvas): void {
        this.velocity = this.velocity.add(this.accelleration).limit(this.maxSpeed);
        this._position = this._position.add(this.velocity);
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
        surface.ctx.translate(this._position.x,this._position.y);
        this._linkedTo.forEach(l=>l.draw(surface));
        surface.ctx.rotate(this.velocity.angle);
        this._attachedTo.forEach(a=>a.draw(surface));
        super.draw(surface);
        // restore rotation
        surface.ctx.restore();
    }

    moveTo(x: number,y: number) {
        this._position = new Point2D(x,y);
    }

    getPosition(): Point2D {
        return this._position;
    }

    applyForce(f: Vector2D) {
        this.accelleration=this.accelleration.add(f);
    }

    // Rect implementations

    // Get bounds of rect.
    abstract getBounds():Bounds;

    /* Returns true if point is within the rect bounds */
    contains(p: Point2D) {
        const b = this.getBounds();
        return (p&&
            (p.x<=b.x2&&p.x>b.x1)&&
            (p.y<=b.y2&&p.y>b.y1)
        );
    }

    /* Returns true if all vertexes are within bounds */
    intersects(obj: Rect | Bounds): boolean {
        const b = isRect(obj)?obj.getBounds():obj;
        const p = this.getBounds();
        return ((p.x1<=b.x1&&p.x2>b.x1)&&  // p.x1 < b.x1 < p.x2  - Upper left of B is within P
            ((p.y1<=b.y1&&p.y2>b.y1)||     // p.y1 < b.y1 < p.y2  - Upper left of B is within P
            (p.y1<=b.y2&&p.y2>b.y2))       // p.y1 < b.y2 < p.y2  - Lower left of B is within P
          ||((p.x1<=b.x2&&p.x2>b.x2)&&     // p.x1 < b.x2 < p.x2  - Lower Right of B is within P
            ((p.y1<=b.y2&&p.y2>b.y2)||     // p.y1 < b.y2 < p.y2  - Lower Right of B is within P
            (p.y1<=b.y1&&p.y2>b.y1)))      // p.y1 < b.y2 < p.y2  - Upper Right of B is within P
        );
    }

    exits(obj: Rect | Bounds) {
        return !this.intersects(obj);
    }
    
    getIntersection(obj: Rect| Bounds) {
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