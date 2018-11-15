import { RoughCanvas } from "roughjs/bin/canvas";
import { Drawable } from "roughjs/bin/core";

import {Point2D} from "./datastructures";

export abstract class Drawing {

    surface: RoughCanvas;
    drawing: Drawable;
    offset: Point2D=new Point2D(0,0);

    /** 
     * Re-create the Drawing object.
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

export abstract class CompositeDrawing extends Drawing {

    drawings: Drawing[]=null;

    set drawing(d) {this.drawings=[d];}
    draw(surface: RoughCanvas): void {
        !this.drawings&&this.refresh(surface);
        this.drawings.forEach(surface.draw.bind(surface));
    }
}