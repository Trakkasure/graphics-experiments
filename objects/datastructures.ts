import { Vector2D } from "./physics";

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

export interface Bounds {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export interface Rect {
    getBounds(): Bounds;
    intersects(obj: Rect | Bounds): boolean;
    exits(obj: Rect | Bounds): boolean;
    getIntersection(obj: Rect | Bounds): Bounds;
    contains(obj: Point2D): boolean;
}

export class QuadTree implements Rect {
    
    points: Array<Point2D>=[];
    divided: boolean=false;
    nw: QuadTree;
    ne: QuadTree;
    sw: QuadTree;
    se: QuadTree;

    constructor(private bounds: Bounds, private capacity: number) {

    }

    /* Returns true if point is within the tree */
    contains(p: Point2D) {
        const b = this.bounds;
        return (
            (p.x<=b.x2&&p.x>b.x1)&&
            (p.y<=b.y2&&p.y>b.y1)
        );
    }

    /* Returns true if any vertex is within bounds */
    intersects(obj: Rect | Bounds): boolean {
        const b = obj.getBounds?obj.getBounds():obj;
        return (
            this.contains({x:b.x1,y:b.y1})
          ||this.contains({x:b.x2,y:b.y1})
          ||this.contains({x:b.x1,y:b.y2})
          ||this.contains({x:b.x2,y:b.y2})
        );
    }

    exits(obj: Rect | Bounds) {
        return !this.intersects(obj);
    }
    
    getIntersection(obj: Rect| Bounds) {
        const b = obj.getBounds?obj.getBounds():obj;
        if (!this.intersects(b))
            return {
                x1:0,
                x2:0,
                y1:0,
                y2:0
            };
        const p = this.bounds;
        const x = [p.x1,p.x2,b.x1,b.x2].sort();
        const y = [p.y1,p.y2,b.y1,b.y2].sort();
        return {
            x1:x[1],
            x2:x[2],
            y1:y[1],
            y2:y[2]
        };
    }

    insert(p: Point2D):void {
        if (!this.contains(p)) return;
        if (this.divided||this.points.length>this.capacity) {
            if (this.points.length) {
                this.points.forEach(pt=>{
                    // only top
                    if (p.y<this.bounds.y2-(this.bounds.y2-this.bounds.y1)/2) {
                        this.nw.insert(pt);
                        this.ne.insert(pt);
                    } else {
                        this.sw.insert(pt);
                        this.se.insert(pt);
                    }
                })
                this.points=[];
                this.nw.insert(p);
                this.ne.insert(p);
                this.sw.insert(p);
                this.se.insert(p);
            }
            this.points.push(p);
        }
    }

    divide():void {
        this.divided=true;
        const center = new Point2D(this.bounds.x2-(this.bounds.x2-this.bounds.x1)/2,this.bounds.y2-(this.bounds.y2-this.bounds.y1)/2)
        this.nw = new QuadTree({x1:this.bounds.x1,y1:this.bounds.y1,x2:center.x,y2:center.y},this.capacity);
        this.ne = new QuadTree({x1:center.x,y1:this.bounds.y1,x2:this.bounds.x2,y2:center.y},this.capacity);
        this.sw = new QuadTree({x1:this.bounds.x1,y1:center.y,x2:center.x,y2:this.bounds.y2},this.capacity);
        this.se = new QuadTree({x1:center.x,y1:center.y,x2:this.bounds.x2,y2:this.bounds.y2},this.capacity);
    }

    getBounds():Bounds {
        return this.bounds;
    }

}