import { RoughCanvas } from "roughjs/bin/canvas";
import { RoughCanvasAsync } from "roughjs/bin/canvas-async";
import { Drawable } from "roughjs/bin/core";

import {Point2D} from "../DataModel/DataStructures";

export abstract class Drawing {

    surface: RoughCanvas;
    drawing: Drawable;
    img: ImageData | HTMLImageElement | SVGImageElement;
    offset: Point2D=new Point2D(0,0);

    /**
     * Default function for draw.
     * Most extenders should call this (as super)
     */ 
    draw(surface: RoughCanvas|RoughCanvasAsync): void {
        (!(this.drawing||this.img))&&this.refresh(surface);
        surface.ctx.save();
        surface.ctx.translate(this.offset.x,this.offset.y);
        if (this.img)
            surface.ctx.putImageData(this.img);
        else surface.draw(this.drawing);
        surface.ctx.restore();
    }

    abstract refresh(surface: RoughCanvas|RoughCanvasAsync): void;
}

export abstract class CompositeDrawing {

    drawings: Drawing[]=null;
    img: ImageData | HTMLImageElement | SVGImageElement;
    offset: Point2D=new Point2D(0,0);

    set drawing(d) {this.drawings=[d];}
    draw(surface: RoughCanvas|RoughCanvasAsync): void {
        !this.drawings&&this.refresh(surface);
        surface.ctx.save();
        surface.ctx.translate(this.offset.x,this.offset.y);
        if (this.img)
            surface.ctx.putImageData(this.img);
        else this.drawings.forEach(surface.draw.bind(surface));
        surface.ctx.restore();
    }

    /** 
     * Re-create the Drawing object.
     */
    abstract refresh(surface: RoughCanvas|RoughCanvasAsync): void;
}