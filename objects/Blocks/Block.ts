import {Drawing} from "../graphics/Drawing";
import {Tile} from '../Tiles/Tile';
import {Chunk} from "../Map/Chunk";
import { Point2D } from "../DataModel/DataStructures";

export abstract class Block extends Drawing {

    /** Height of block in chunk. */
    protected height: number=0;
    tile: Tile;

    chunkPosition: Point2D;

    constructor(protected chunk: Chunk) {
        super();
    }

    abstract generate(seed: number);
    // Primary action. What happens when you use the primary action key/button on this block.
    abstract action(modifier?: any);
    // Seconday action. What happens when you use the seconday action key/button on this block.
    abstract altAction(modifier?: any);

    // Custom actions allowed for this block.
    abstract customAction(actionKey:string, actionValue:string,modifier?: any);

}