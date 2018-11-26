import seedrandom from 'seedrandom';
import {Biome} from './Biome';
import {Block} from '../Blocks/Block';
import {Sand} from '../Blocks/Sand';
import {Chunk} from '../Map/Chunk';

export class Desert extends Biome {
   
    constructor() {
        super('desert');
    }

    serialize():string {
        return [
            '{"chunks":',JSON.stringify(this.chunks)+'}'
        // ].concat(this.chunks.map(ca=>ca.map(<Chunk>chunk=>{
        //     return chunk.
        // })))
        ].join("");

            // JSON.stringify(this.blocks,null,2)+'}';
    }
}