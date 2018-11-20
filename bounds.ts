import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { Ball, vScreen, Box } from './objects/objects';
import { Animator } from './objects/animator';
import { Point2D, Bounds } from './objects/datastructures';
import { Vector2D } from './objects/physics';
import "@babel/polyfill";

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
let offsetX=canvasBounds.left;
let offsetY=canvasBounds.top;

const tube = new vScreen(400,400);
const ball = new Ball(350,350);
const ballBounds = new Box(0,0,10,10);

tube.offset=new Point2D(canvas.width/2-tube.getBounds().x2/2,canvas.height/2-tube.getBounds().y2/2)
ballBounds.offset=new Point2D(-5,-5);
ball.attach(ballBounds); // attach bounds image.

let lastCollision: boolean=false
let mouse=new Point2D(0,0);
canvas.addEventListener("mousemove",function(e) {
    // Set position of the mouse..
    mouse=new Point2D(e.clientX-offsetX,e.clientY-offsetY);
    ball.moveTo(mouse.x,mouse.y);
    const collision: boolean = tube.intersects(ball);
    
    if (lastCollision!==collision) {
        ball.setColor(collision?'#FF5555':'white')
        ball.refresh(rc);
        lastCollision=collision;
    }
});
const boundsAnimator=new Animator(<RoughCanvas>rc);
boundsAnimator.clearFrames(true);
boundsAnimator.add(tube);
boundsAnimator.add(ball);

// Start/stop animation.
document.getElementById('startBounds').addEventListener('click',()=>{
    boundsAnimator.start();
});
document.getElementById('stopBounds').addEventListener('click',()=>{
    boundsAnimator.stop();
});

let tick=0;
console.log(tube.getBounds());
boundsAnimator.tick=function(time,surface) {
    // No tick necessary since mouse event changes the ball color based on collision.
}

function clear(c) {
    // Clear the canvas
    c.ctx.clearRect(0,0,canvas.width,canvas.height);

}
// Demo attachments. No need to add to animator. Attached items render with object attached to.
// players[0].link(pline);
// players[1].attach(pline2);

// expose objects to play around.
window.Vector2D = Vector2D;
window.Point2D = Point2D;
window.rc=rc;