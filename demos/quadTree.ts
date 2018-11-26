import rough from 'roughjs';
import { Ball, Food, Poison, Obstacle, Player, VLine, vScreen, Axis, Box } from '../objects/objects';
import { Animator } from '../objects/graphics/Animator';
import { Point2D, QuadTree, Bounds } from '../objects/DataModel/DataStructures';
import { Vector2D } from '../objects/DataModel/Physics';
import { random } from '../objects/utils/utils';

import "@babel/polyfill";

// attrbutes set on canvas element
const canvasContainerSelector = "#canvas";
const backgroundCanvasContainerSelector = "#backgroundCanvas";
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
            background: transparent;
            margin: 0;
            padding: 0;
            top:8px;
            left:8px;
            position: absolute;
        }

        ${backgroundCanvasContainerSelector} {
            margin: 0;
            padding: 0;
        }
        ${backgroundCanvasContainerSelector} canvas {
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
const backgroundCanvas: HTMLCanvasElement = document.querySelector(backgroundCanvasContainerSelector)
                                        .appendChild(Object.keys(backgroundCanvasAttributes)
                                            .reduce((c,k)=>{c.setAttribute(k,backgroundCanvasAttributes[k]);return c},document.createElement('canvas'))
                                    );
const rc = rough.canvas(canvas);
const rcBg = rough.canvas(backgroundCanvas);

const canvasBounds=canvas.getBoundingClientRect();
let offsetX=canvasBounds.left;
let offsetY=canvasBounds.top;

const quadTreeAnimator=new Animator(rc);
quadTreeAnimator.clearFrames(false);

const qt=new QuadTree(<Bounds>{x1:0,y1:0,x2:canvas.width,y2:canvas.height},5);
const balls: Array<Ball>=[];
for (let i=0;i<1000;i++) {
    const ball=new Ball(random(1,canvas.width-1),random(1,canvas.height-1),2);
    ball.setColor('#9999FF');
    balls.push(ball);
    qt.insert(ball.getPosition(),ball);
}

let rx=<HTMLInputElement>document.querySelector('[name="rx"]')
let ry=<HTMLInputElement>document.querySelector('[name="ry"]')
let mouse=new Point2D(0,0);
let mouseBox=new Box(0,0,+rx.value,+ry.value);
mouseBox.setColor('red');
quadTreeAnimator.add(mouseBox);
canvas.addEventListener("mousemove",function(e) {
    // Set position of the mouse..
    mouse=new Point2D(e.clientX-offsetX,e.clientY-offsetY);
    mouseBox.moveTo(mouse.x,mouse.y);
});

// Apply a force to the moving ball..
canvas.addEventListener("click",function(e) {
});

document.getElementById('stopTree').addEventListener('click',()=>{
    quadTreeAnimator.stop();
});

document.getElementById('startTree').addEventListener('click',()=>{
    quadTreeAnimator.start();
});

// Draw tree on background canvas.
document.getElementById('showHideTree').addEventListener('click',(e) => {
    clear(rcBg);
    for (let [point,ball] of qt.walkPoints()) {
        ball.draw(rcBg);
    }
    if ((<HTMLInputElement>e.target).checked) {
        // Draw tree boundaries
        for (let tree of qt.walkTrees()) {
            Box.fromBounds(tree.getBounds()).draw(rcBg);
        }
    } else {
    }
});
let mode="range";
document.querySelectorAll('[name="mode"]').forEach(radio=>radio.addEventListener('click',(e) => {
    const target=<HTMLInputElement>e.target;
    if (target.value==mode) return;
    mode=target.value
    if (target.value=='range') {
        quadTreeAnimator.add(mouseBox);
    } else
    if (target.value=='point') {
        quadTreeAnimator.remove(mouseBox);
    }
}));
// Add stuff to ball animator...

rx.addEventListener('input',adjustMouseBoxSize);
ry.addEventListener('input',adjustMouseBoxSize);
function adjustMouseBoxSize(e) {
    mouseBox.offset=new Point2D(-rx.value/2, -ry.value/2);
    mouseBox.setSize(+rx.value,+ry.value);
    mouseBox.refresh(rc);
}

quadTreeAnimator.tick=(time,surface) => {
    clear(rc);
    // Draw all points every tick.
    // This is very slow. Need to find faster way to walk all points that is just as convenient.
    let x=0;
    let mode=<HTMLInputElement>document.querySelector('[name="mode"]:checked');
    if (mode.value=="range") {
        // Find all points within the box. Box implements Rect. find takes a Rect.
        // Then, loop through each of them, setting color to litght green, refreshing the drawing, drawing, and resetting back.
        qt.find(mouseBox).forEach(p=>p[1].setColor('#99FF99')||p[1].refresh(rc)||p[1].draw(rc)||p[1].setColor("#9999FF")||p[1].refresh(rc));
    } else {
        const tree=qt.findTreeFromPoint(mouse);
        if (tree) {
            tree.getPoints().forEach(p=>p[1].setColor('#99FF99')||p[1].refresh(rc)||p[1].draw(rc)||p[1].setColor("#9999FF")||p[1].refresh(rc));
        }
    }
}

// Draw balls from tree
for (let [point,ball] of qt.walkPoints()) {
    ball.draw(rcBg);
}
// Draw balls from array.
// for (var i=0;i<balls.length;i++) balls[i].draw(rcBg);

function clear(c) {
    // Clear the canvas
    c.ctx.clearRect(0,0,canvas.width,canvas.height);

}
// expose objects to play around.
window.Vector2D = Vector2D;
window.Point2D = Point2D;
window.rc=rc;