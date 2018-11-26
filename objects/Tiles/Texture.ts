import seedrandom from 'seedrandom';

type NoiseType = Array<Array<number>>; 
type ColorNoiseType = Array<Array<ColorRGB>>; 

type ColorRGB = {
    r: number;
    g: number;
    b: number;
};

export function grey(noise: NoiseType):ColorNoiseType {
    var r,g,b,
    w=noise.length,
    h=noise[0].length,
    cnoise: ColorNoiseType=new Array(w).fill(0);
    for(let x = 0; x < w; x++) {
        cnoise[x]=new Array(h).fill(0);
        for(let y = 0; y < h; y++) {
            r=g=b= 256 * noise[x][y];
            cnoise[x][y]={r, g, b};
        }
    }
    return cnoise;
}

export function generateNoise(seed: string="randomSeed",width=128,height=128,minRng=0): NoiseType {
    const rng=seedrandom(seed);
    const noise: NoiseType=new Array(width);

    for (let x = 0; x < width; x++) {
        noise[x]=new Array(height);
        for (let y = 0; y < height; y++) {
            noise[x][y] = Math.max(minRng,rng());
        }
    }
    return noise;
}

export function smoothAtPoint(noise,x,y): number {
   //get fractional part of x and y
    const width:number=noise.length;
    const height:number=noise[0].length;

    const fractX = x-Math.floor(x);
    const fractY = y-Math.floor(y);

    //wrap around
    const x1 = (Math.floor(x) + width) % width;
    const y1 = (Math.floor(y) + height) % height;

    //neighbor values
    const y2 = (y1 + height - 1) % height;
    const x2 = (x1 + width - 1) % width;

    //smooth the noise with bilinear interpolation
    let value = 0.0;
    value += fractX       * fractY       * noise[y1][x1];
    value += (1 - fractX) * fractY       * noise[y1][x2];
    value += fractX       * (1 - fractY) * noise[y2][x1];
    value += (1 - fractX) * (1 - fractY) * noise[y2][x2];
    return value;
}

export function turbulence(noise: NoiseType, x: number, y: number, size: number=2): number {
  let value = 0.0, initialSize = size;

  while(size >= 1) {
    value += smoothAtPoint(noise,x/size, y/size)*size;
    size /= 2.0;
  }

  return(128.0 * value / initialSize);
}

export function marbleTexture(noise,xp,yp,distortion,turb=32): NoiseType {

    const width:number=noise.length;
    const height:number=noise[0].length;
    const texture: NoiseType=new Array(width);

    for (let x = 0; x < width; x++) {
        texture[x]=new Array(height).fill(0);
        for (let y = 0; y < height; y++) {
            const xyValue = x * xp / width + y * yp / height + distortion * turbulence(noise, x, y, turb) / 256.0;
            texture[x][y] = 256 * Math.abs(Math.sin(xyValue * Math.PI));
        
        }
    }
    return texture;
}

/**
 * 
 * @param noise Initial input noise to alter calculation
 * @param numRings Number of rings in texture
 * @param twisty How twisty the result
 * @param smooth "smoothing" value
 */
export function woodTexture(noise,numRings=8,twisty=0.1,turb=32) {

    const width:number=noise.length;
    const height:number=noise[0].length;
    const texture: NoiseType=new Array(width);

    for(let x = 0; x < width; x++) {
        texture[x]=new Array(height);
        for(let y = 0; y < height; y++) {
            const xValue = (x - width / 2) / width;
            const yValue = (y - width / 2) / height;
            const distValue = Math.sqrt(xValue * xValue + yValue * yValue) + twisty * turbulence(noise, x, y, turb) / 256;
            const sineValue = 128 * Math.abs(Math.sin(2 * numRings * distValue * Math.PI));
            texture[x][y]=sineValue;
        }
    }
    return texture;
}