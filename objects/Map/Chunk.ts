import {Biome} from './Biome';
import { Block } from '../Blocks/Block';

export class Chunk {
    /**
     * Number of blocks (w & h) of a chunk.
     */
    static size: 16;
    blocks: Array<Array<Block>>;

    static generateChunk(biome,x, y, blockFactory: (x:number,y:number)=>Block): Chunk {
        const chunk = new Chunk(biome,x, y);
        var i=0,j=0;
        for (i=0;i<Chunk.size;i++) {
            for (j=0;j<Chunk.size;j++) {
                chunk.blocks[i][j]=blockFactory(x,y);
            }
        }
        return chunk;
    }

    constructor(protected biome: Biome, protected x: number, protected y: number) {
        
    }

    getBlock(x,y) {
        return this.blocks[x][y];
    }
    serialize(): string {
        return 
    }
}