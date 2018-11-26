import {Drawing} from "../graphics/Drawing";

export abstract class Tile extends Drawing {
    /** Image to display for this tile */
    protected img: HTMLImageElement;
}