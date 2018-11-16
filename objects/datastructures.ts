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
export function isRect(obj: Rect | object): obj is Rect {
    return !!(<Rect>obj).getBounds;
}
export interface Rect {
    getBounds(): Bounds;
    intersects(obj: Rect | Bounds): boolean;
    exits(obj: Rect | Bounds): boolean;
    getIntersection(obj: Rect | Bounds): Bounds;
    contains(obj: Point2D): boolean;
}

export class QuadTree implements Rect {
    
    points: Array<[Point2D,any]>=[];
    divided: boolean=false;
    children: Array<QuadTree>=[];

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
    intersects(obj: Bounds | Rect): boolean {
        const b = isRect(obj)?obj.getBounds():obj;
        return (
            this.contains(<Point2D>{x:b.x1,y:b.y1})
          ||this.contains(<Point2D>{x:b.x2,y:b.y1})
          ||this.contains(<Point2D>{x:b.x1,y:b.y2})
          ||this.contains(<Point2D>{x:b.x2,y:b.y2})
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

    insert(p: Point2D, userData:any):void {
        if (!this.contains(p)) return;
        if (this.points.length>=this.capacity) {
            this.divide();
            this.points.forEach((pts:[Point2D,any])=>{
                // only top
                const [pt,userData]=pts;
                if (p.y<this.bounds.y2-(this.bounds.y2-this.bounds.y1)/2) {
                    this.children[0].insert(pt,userData);
                    this.children[1].insert(pt,userData);
                } else {
                    this.children[2].insert(pt,userData);
                    this.children[3].insert(pt,userData);
                }
            })
            this.points=[];
        }
        if (this.divided) {
            this.children[0].insert(p,userData);
            this.children[1].insert(p,userData);
            this.children[2].insert(p,userData);
            this.children[3].insert(p,userData);
        } else
            this.points.push([p,userData]);
    }

    divide():void {
        this.divided=true;
        const center = new Point2D(this.bounds.x2-(this.bounds.x2-this.bounds.x1)/2,this.bounds.y2-(this.bounds.y2-this.bounds.y1)/2)
        this.children[0] = new QuadTree({x1:this.bounds.x1,y1:this.bounds.y1,x2:center.x,y2:center.y},this.capacity);
        this.children[1] = new QuadTree({x1:center.x,y1:this.bounds.y1,x2:this.bounds.x2,y2:center.y},this.capacity);
        this.children[2] = new QuadTree({x1:this.bounds.x1,y1:center.y,x2:center.x,y2:this.bounds.y2},this.capacity);
        this.children[3] = new QuadTree({x1:center.x,y1:center.y,x2:this.bounds.x2,y2:this.bounds.y2},this.capacity);
    }

    getBounds():Bounds {
        return this.bounds;
    }

    find(range: Rect) {
        if (!this.intersects(range)) return [];
        if (this.divided) {
            return this.children.reduce((a: Array<Point2D>, c:QuadTree)=>a.concat(c.find(range)),[]);
        }
        return this.points.filter(p=>range.contains(p[0]));
    }
}