import { Point2D } from "./DataStructures";

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
    sub(v: Vector2D | Point2D | number):Vector2D {
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

    rotate(angle: number): Vector2D {
        var mx = this.mx;
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        return new Vector2D(c * this.mx - s * this.my, s * mx + c * this.my);
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
        return this.magnitude>0?this.div(this.magnitude):this;
    }

    limit(magnitude: number): Vector2D {
        if (this.magnitude > magnitude) {
            return this.normalize().mult(magnitude);
        }
        return this;
    }
   
    angleBetween(v: Vector2D): number {
        return Math.acos(this.dot(v) / Math.sqrt(this.magnitude*this.magnitude * v.magnitude*this.magnitude));
    };

    dist(v: Vector2D): number {
        const dx=Math.pow(this.mx-v.mx,2);
        const dy=Math.pow(this.my-v.my,2);
        return Math.sqrt(dx+dy);
    }

    dot(v: Vector2D): number {
        return this.mx*v.mx+this.my*v.my;
    }

    lerp(v: Vector2D, amt:number): Vector2D
    lerp(mx: number, my: number,amt: number): Vector2D 
    lerp(v,my,amt?) {
        const lerpVal = (start:number, stop:number, amt:number)=>start+(stop-start)*amt;
        var mx:number=v;
        (v instanceof Vector2D)&&(amt=my,{mx,my}=v);
        return new Vector2D(lerpVal(this.mx,mx,amt),lerpVal(this.my,my,amt));
    }
}
