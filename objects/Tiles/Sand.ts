import {Tile} from "./Tile"
import { generateNoise, smoothNoise } from "./Texture";

const texture = smoothNoise(generateNoise("sandy noise",128,128,.5),4); // returns 32x32 texture;
const colorMultiplier={r:255,g: 255*.8, b:255*.25};
export class Sand extends Tile {
    constructor(parameters) {
        super();
    }

    refresh(surface) {
        const img=surface.ctx.createImageData(texture.length,texture[0].length);
        for (let idx=0;idx<img.data.length;idx+=4) {
            let y=Math.floor((idx/4)/width/4);
            let x=Math.floor(((idx/4)%height)/4);
            img.data[idx]=Math.floor(texture[x][y]*colorMultiplier.r);
            img.data[idx+1]=Math.floor(texture[x][y]*colorMultiplier.g);
            img.data[idx+2]=Math.floor(snoise[x][y]*colorMultiplier.b);
            img.data[idx+3]=255;
        }
        this.img=img;
    }
}