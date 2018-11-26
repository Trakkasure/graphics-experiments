import { Chunk } from "./Chunk";


export class Map {

    chunks: Array<Array<Chunk>>=[];

    /**
     * Load map from disk.
     * @param fileName File to load
     */
    load(fileName: string) {}
    /**
     * Save map to disk.
     * @param fileName File to save
     */
    save(fileName: string) {}

    setChunk(chunk: Chunk, x:number, y:number):void {

    }

    getChunkForPosition(x,y):chunk {

    }
}