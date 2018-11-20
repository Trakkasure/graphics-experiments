import rough from 'roughjs';
import { Ball, Food, Poison, Obstacle, Player, VLine, vScreen, Axis, Box } from './objects/objects';
import { Animator } from './objects/animator';
import { Point2D, QuadTree, Bounds } from './objects/datastructures';
import { Vector2D } from './objects/physics';
import { random } from './utils';
import "@babel/polyfill";

// attrbutes set on canvas element
const canvasContainerSelector = "#canvas";
const canvasAttributes = {
    width: 800,
    height: 600,
    id: "drawingSurface"
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
            background: black;
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
const rc = rough.canvas(canvas);

const canvasBounds=canvas.getBoundingClientRect();
let offsetX=canvasBounds.x;
let offsetY=canvasBounds.y;

const axisAnimator=new Animator(rc);

let mouse=new Point2D(0,0);
canvas.addEventListener("mousemove",function(e) {
    // Set position of the mouse..
    mouse=new Point2D(e.clientX-offsetX,e.clientY-offsetY);
});
// Start/stop animation.
document.getElementById('startAxis').addEventListener('click',()=>{
    axisAnimator.start();
});
document.getElementById('stopAxis').addEventListener('click',()=>{
    axisAnimator.stop();
});

const axis = new Axis(200,200);
axisAnimator.add(axis);

// VLine is a line representing a vector.
const line = new VLine(1,0);
const line2 = new VLine(0,0);
const line3 = new VLine(0,0);

// Set root of line (anchor point of vector)
line.setRoot(new Point2D(canvas.width/2,canvas.height/2));
line2.setRoot(new Point2D(canvas.width/2,canvas.height/2));
// Bounce off y axis
line2.setColor('#FF5555');
// Bounce off x axis
line3.setColor('#55FF55');
line3.setRoot(new Point2D(canvas.width/2,canvas.height/2));
axisAnimator.add(line);
axisAnimator.add(line2);
axisAnimator.add(line3);

axisAnimator.tick=(time,surface) => {
    let vec=new Vector2D((mouse.x-canvas.width/2),(mouse.y-canvas.height/2));
    if (vec.my==0) return;
    console.log("Angle: %s",vec.angle*(180/Math.PI))
    line.setVec(vec)
    vec=new Vector2D({angle:2*Math.PI-vec.angle,magnitude:vec.magnitude});
    line2.setVec(vec);
    vec=new Vector2D({angle:Math.PI+vec.angle,magnitude:vec.magnitude});
    line3.setVec(vec);

    // Refresh recalculates the line angle.
    line.refresh(rc)
    line2.refresh(rc);
    line3.refresh(rc);
    // The animator will draw everything to the canvas.
}
// expose objects to play around.
window.Vector2D = Vector2D;
window.Point2D = Point2D;
window.rc=rc;