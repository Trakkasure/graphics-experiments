import {Chunk} from "./Chunk";

import {Desert} from './Desert';
import {Plains} from './Plains';
import {Ocean} from './Ocean';
import {Hills} from './Hills';
import {Mountains} from './Mountains';

export abstract class Biome {

    chunks: Array<Array<Chunk>>
    /**
     * Width of biome in chunks
     */
    width: number=0;
    /**
     * Height of biome in chunks
     */
    height: number=0;

    constructor(protected biomeSeed:string) { }

    /** 
     * @param seed: random seed.
     * @param x chunk X position (in chunks, not blocks)
     * @param y chunk Y position (in chunks, not blocks)
    */
    abstract generateChunk(x ,y, biomSeed: string);

    /**
     * 
     * @param seed Seed to the biom generator
     */
    generateBiome(seed: string) {
        
    }

    abstract serialize(): string;
}
