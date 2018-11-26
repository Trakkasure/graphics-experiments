import { Animatable } from "../graphics/Animator";
import { Map } from "./Map";

export class Viewport implements Animatable {

    constructor(protected map: Map, protected w: number, protected h: number, protected x: number, protected y: number) {

    }

    tick(time: number, surface) {
        const chunk=this.map.getChunkForPosition(this.x,this.y);
        chunk.
    }
}