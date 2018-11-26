import "@babel/polyfill";
import { generateNoise, grey, smoothNoise, smoothAtPoint, turbulence, marbleTexture, woodTexture } from "../objects/Tiles/Texture";
import { distance } from "../objects/utils/utils";

// attrbutes set on canvas element
const canvasContainerSelector = "#canvas";
const canvasAttributes = {
    width: 800,
    height: 600,
    id: "drawingSurface"
};

const backgroundCanvasAttributes = {
    width: 800,
    height: 600,
    id: "backgroundSurface"
};

function createStyles() {
    let el=document.createElement('style');
    el.setAttribute('type','text/css');
    el.setAttribute('id','styles');
    const text=
    document.createTextNode(`
        ${canvasContainerSelector} {
            margin: 0;
            padding: 0;
        }
        ${canvasContainerSelector} canvas {
            // background: black;
            margin: 0;
            padding: 0;
        }
    `);
    el.appendChild(text);
    document.querySelector('head').appendChild(el);
}

createStyles();
const canvas: HTMLCanvasElement = document.querySelector(canvasContainerSelector)
                                        .appendChild(Object.keys(canvasAttributes)
                                            .reduce((c,k)=>{c.setAttribute(k,canvasAttributes[k]);return c},document.createElement('canvas'))
                                    );
const canvasBounds=canvas.getBoundingClientRect();
let offsetX=canvasBounds.x;
let offsetY=canvasBounds.y;

const ctx = canvas.getContext('2d');
let width=128;
let height=128;
const img=ctx.createImageData(width,height);
const img2=ctx.createImageData(width,height);
const img3=ctx.createImageData(width,height);

const img4=ctx.createImageData(width,height);
const img5=ctx.createImageData(width,height);

function woodColor(v) {
    return [
        v+(256-v)/256*128,
        v+(256-v)/256*128,
        128
    ];
}
function sandColor(v) {
    return [
        v+(256-v)/256*128,
        v+(256-v)/256*128,
        128
    ];
}
// This zooms into the original noise 4 times.
function drawZoomNoise(scale: number=1) {
    var idx=0;
    for (idx=0;idx<img.data.length;idx+=4) {
        let y=Math.floor((idx/4)/width/scale);
        let x=Math.floor(((idx/4)%height)/scale);
        const v=sandColor(noise[x][y]*256);
        img.data[idx]=v[0];
        img.data[idx+1]=v[1];
        img.data[idx+2]=v[2];
        img.data[idx+3]=255;
    }
    ctx.putImageData(img,10,10);
}

function drawSmoothImage(scale: number=1,smoothing: number=2) {
    var idx=0;
    for (idx=0;idx<img2.data.length;idx+=4) {
        let y=Math.floor((idx/4)/width);
        let x=Math.floor(((idx/4)%height));
        const v = sandColor(smoothAtPoint(noise,x/smoothing,y/smoothing)*256);
        img2.data[idx]=v[0];
        img2.data[idx+1]=v[1];
        img2.data[idx+2]=v[2];
        img2.data[idx+3]=255;
    }
    ctx.putImageData(img2,10,140);
}

function drawTurbulentImage(t) {
    var idx=0;
    for (idx=0;idx<img3.data.length;idx+=4) {
        let y=Math.floor((idx/4)/width);
        let x=Math.floor(((idx/4)%height));
        const v = sandColor(turbulence(noise,x,y,t));
        img3.data[idx]=v[0]
        img3.data[idx+1]=v[1];
        img3.data[idx+2]=v[2];
        img3.data[idx+3]=255;
    }
    ctx.putImageData(img3,10,270);
}

function drawMarble(d,t) {
    const marble=marbleTexture(noise,5,10,d,t);
    for (let idx=0;idx<img4.data.length;idx+=4) {
        let y=Math.floor((idx/4)/width);
        let x=Math.floor(((idx/4)%height));
        const v = marble[x][y];
        img4.data[idx]=v;
        img4.data[idx+1]=v;
        img4.data[idx+2]=v;
        img4.data[idx+3]=255;
    }
    ctx.putImageData(img4,140,10);
}

function drawWood(d,t,rings,scale=4) {
    const wood=woodTexture(noise,rings,1/d,t);
    for (let idx=0;idx<img5.data.length;idx+=4) {
        let y=Math.floor((idx/4)/width);
        let x=Math.floor(((idx/4)%height));
        const v = wood[x][y];
        img5.data[idx]=v;
        img5.data[idx+1]=v;
        img5.data[idx+2]=v;
        img5.data[idx+3]=255;
    }
    ctx.putImageData(img5,140,140);
    for (let idx=0;idx<img5.data.length;idx+=4) {
        let y=Math.floor((idx/4)/width/scale);
        let x=Math.floor(((idx/4)%height)/scale);
        const v = woodColor(wood[x][y]);
        img5.data[idx]=v[0];
        img5.data[idx+1]=v[1];
        img5.data[idx+2]=v[2];
        img5.data[idx+3]=255;
    }
    ctx.putImageData(img5,140,270);
}

let scale=1;
let smoothing=2;
let turb=2;
let dist=5;
let rings=8;
let noise=generateNoise(document.querySelector('input[name="rngSeed"]').value,width,height,.5);
drawZoomNoise(scale);
drawSmoothImage(scale,smoothing);
drawTurbulentImage(+turb);

drawMarble(5,30);
drawWood(5,8);

document.querySelector('input[name="rngSeed"]').addEventListener('input',(e)=>{
    const rngSeed=e.target.value;
    noise=generateNoise(rngSeed,width,height,.5);
    drawZoomNoise(+scale);
    drawSmoothImage(+scale,+smoothing);
    drawTurbulentImage(+turb);
    drawWood(+dist,+turb,+rings,+scale);
});

document.querySelector('input[name="scaleRange"]').addEventListener('change',(e)=>{
    scale=e.target.value;
    drawZoomNoise(+scale);
    drawSmoothImage(+scale,+smoothing);
    drawWood(+dist,+turb,+rings,+scale);
});
document.querySelector('input[name="smootheRange"]').addEventListener('change',(e)=>{
    smoothing=e.target.value;
    // drawZoomNoise(+scale);
    drawSmoothImage(+scale,+smoothing);
    // drawTurbulantImage(+turb);
})
document.querySelector('input[name="turbulenceRange"]').addEventListener('change',(e)=>{
    turb=e.target.value;
    // drawZoomNoise(+scale);
    drawTurbulentImage(+turb);
    drawMarble(+dist,+turb);
    drawWood(+dist,+turb,+rings,+scale);
});
document.querySelector('input[name="distortionRange"]').addEventListener('change',(e)=>{
    dist=e.target.value;
    // drawZoomNoise(+scale);
    drawMarble(+dist,+turb);
    drawWood(+dist,+turb,+rings,+scale);
});
document.querySelector('input[name="ringsRange"]').addEventListener('change',(e)=>{
    rings=e.target.value;
    // drawZoomNoise(+scale);
    drawMarble(+dist,+turb);
    drawWood(+dist,+turb,+rings,+scale);
});