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
    
    protected _points: Array<[Point2D,any]>=[];
    protected _divided: boolean=false;
    protected _children: Array<QuadTree>=[];
    protected _center: Point2D;

    constructor(protected _bounds: Bounds, protected _capacity: number, protected _parent: QuadTree=null) {
        this._center = new Point2D(this._bounds.x2-(this._bounds.x2-this._bounds.x1)/2,this._bounds.y2-(this._bounds.y2-this._bounds.y1)/2);
    }

    walkTrees=function*(depthFirst:boolean=false) {
        if (!depthFirst)
            yield this;
        if (this._divided) {
            yield* this._children[0].walkTrees();
            yield* this._children[1].walkTrees();
            yield* this._children[2].walkTrees();
            yield* this._children[3].walkTrees();
        }
        if (depthFirst)
            yield this;
    }.bind(this)


    walkPoints=function*(depthFirst:boolean=false) {
        if (!depthFirst)
            for (let i=0;i<this._points.length;i++) yield this._points[i]; 
        if (this._divided) {
            yield* this._children[0].walkPoints();
            yield* this._children[1].walkPoints();
            yield* this._children[2].walkPoints();
            yield* this._children[3].walkPoints();
        }
        if (depthFirst)
            for (let i=0;i<this._points.length;i++) yield this._points[i]; 
    }.bind(this)

    parent(): QuadTree {
        return this._parent;
    }

    getPoints() {
        return this._points;
    }
    /* Returns true if point is within the tree */
    contains(p: Point2D) {
        const b = this._bounds;
        return (
            (p.x<=b.x2&&p.x>b.x1)&&
            (p.y<=b.y2&&p.y>b.y1)
        );
    }

    /* Returns true if any vertex is within _bounds */
    intersects(obj: Bounds | Rect): boolean {
        const b = isRect(obj)?obj.getBounds():obj;
        return((obj.x1<=b.x2&&obj.x1>b.x1)&&
            (obj.y1<=b.y2&&obj.y1>b.y1))
          ||((obj.x2<=b.x2&&obj.x2>b.x1)&&
            (obj.y1<=b.y2&&obj.y1>b.y1))
          ||((obj.x1<=b.x2&&obj.x1>b.x1)&&
            (obj.y2=b.y2&&obj.y2>b.y1))
          ||((obj.x2<=b.x2&&obj.x2>b.x1)&&
            (obj.y2<=b.y2&&obj.y2>b.y1))
        // return (
        //     this.contains(<Point2D>{x:b.x1,y:b.y1})
        //   ||this.contains(<Point2D>{x:b.x2,y:b.y1})
        //   ||this.contains(<Point2D>{x:b.x1,y:b.y2})
        //   ||this.contains(<Point2D>{x:b.x2,y:b.y2})
        // );
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
        const p = this._bounds;
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
        if (this._points.length>=this._capacity) {
            this.divide();
            this._points.forEach((pts:[Point2D,any])=>{
                // only top
                const [pt,userData]=pts;
                this._children[0].insert(pt,userData);
                this._children[1].insert(pt,userData);
                this._children[2].insert(pt,userData);
                this._children[3].insert(pt,userData);
            })
            this._points=[];
        }
        if (this._divided) {
            this._children[0].insert(p,userData);
            this._children[1].insert(p,userData);
            this._children[2].insert(p,userData);
            this._children[3].insert(p,userData);
        } else {
            this._points.push([p,userData]);
        }
    }

    divide():void {
        this._divided=true;
        this._children[0] = new QuadTree({x1:this._bounds.x1,y1:this._bounds.y1,x2:this._center.x,y2:this._center.y},this._capacity,this);
        this._children[1] = new QuadTree({x1:this._center.x,y1:this._bounds.y1,x2:this._bounds.x2,y2:this._center.y},this._capacity,this);
        this._children[2] = new QuadTree({x1:this._bounds.x1,y1:this._center.y,x2:this._center.x,y2:this._bounds.y2},this._capacity,this);
        this._children[3] = new QuadTree({x1:this._center.x,y1:this._center.y,x2:this._bounds.x2,y2:this._bounds.y2},this._capacity,this);
    }

    getBounds():Bounds {
        return this._bounds;
    }

    find(range: Rect): Array<[Point2D,any]> {
        if (!this.intersects(range)) return [];
        if (this._divided) {
            return this._children.reduce((a: Array<[Point2D,any]>, c:QuadTree)=>a.concat(c.find(range)),[]);
        }
        return this._points.filter(p=>range.contains(p[0]));
    }

    findTreeFromPoint(p:Point2D) {
        if (!this.contains(p)) return null;
        // go deep...
        if (this._divided)
            return this._children[0].findTreeFromPoint(p)||this._children[1].findTreeFromPoint(p)||this._children[2].findTreeFromPoint(p)||this._children[3].findTreeFromPoint(p);
        // bubble up lowest tree;
        return this;
    }
}