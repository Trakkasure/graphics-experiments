import rough from 'roughjs';
import { Ball, Food, Poison, Obstacle, Player, VLine, vScreen, Axis, Box } from './objects/objects';
import { Animator } from './objects/animator';
import { Point2D, QuadTree, Bounds } from './objects/datastructures';
import { Vector2D } from './objects/physics';
import { random } from './utils';
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

const foodCount = 10;
const poisonCount = 10;
const playerCount = 2;

const obstacles = new Array<Obstacle>(foodCount+poisonCount);
const players = new Array<Player>(playerCount);

for (let i = 0; i < foodCount;i++) {
    obstacles[i]=new Food(random(80,canvasAttributes.width-80),random(80,canvasAttributes.height-80));
}
for (let i = 0; i < poisonCount;i++) {
    obstacles[foodCount+i]=new Poison(random(80,canvasAttributes.width-80),random(80,canvasAttributes.height-80));
}
for (let i = 0; i < playerCount;i++) {
    players[i]=new Player(random(100,canvasAttributes.width-100),random(80,canvasAttributes.height-100));
    players[i].maxSpeed=random(1,5);
    // Since the player is at rest, set the angle without changing the magnitude (0)
    players[i].setAngle(random(0,360));
}
const pline = new VLine(40,0);
pline.setColor('#55FF55');
const pline2 = new VLine(40,0);
pline2.setColor('#FF5555');


const canvasBounds=canvas.getBoundingClientRect();
let offsetX=canvasBounds.x;
let offsetY=canvasBounds.y;

const ballAnimator=new Animator(rc);
const boundsAnimator=new Animator(rc);
const axisAnimator=new Animator(rc);
const quadTreeAnimator=new Animator(rc);

boundsAnimator.clearFrames(false);
quadTreeAnimator.clearFrames(false);


const ball = new Ball(350,350);
const tube = new vScreen(400,400);

ball.velocity=new Vector2D(0,0);
ball.maxSpeed=10;

let mouse=new Point2D(0,0);
canvas.addEventListener("mousemove",function(e) {
    // Set position of the mouse..
    mouse=new Point2D(e.clientX-offsetX,e.clientY-offsetY);
});

// Apply a force to the moving ball..
canvas.addEventListener("click",function(e) {
    // players[0].applyForce(players[0].velocity.scale(-1));
        // console.log(vec);
    ball.applyForce(new Vector2D(0.3,0.1));
});

// Start/stop animation.
document.getElementById('startBall').addEventListener('click',()=>{
    ballAnimator.start();
});
document.getElementById('stopBall').addEventListener('click',()=>{
    ballAnimator.stop();
});

// Start/stop animation.
document.getElementById('startAxis').addEventListener('click',()=>{
    axisAnimator.start();
});
document.getElementById('stopAxis').addEventListener('click',()=>{
    axisAnimator.stop();
});

// Start/stop animation.
document.getElementById('startBounds').addEventListener('click',()=>{
    boundsAnimator.start();
});
document.getElementById('stopBounds').addEventListener('click',()=>{
    boundsAnimator.stop();
});

// Start/stop animation.
document.getElementById('startTree').addEventListener('click',()=>{
    quadTreeAnimator.start();
});
document.getElementById('stopTree').addEventListener('click',()=>{
    quadTreeAnimator.stop();
});

document.getElementById('startTree').addEventListener('click',()=>{
    quadTreeAnimator.start();
});

document.getElementById('showHideTree').addEventListener('click',(e) => {
    clear(rcBg);
    for (var i=0;i<balls.length;i++) balls[i].draw(rcBg);
    if (e.target.checked) {
        // Draw tree boundaries
        // Box.fromBounds(qt.getBounds()).draw(rc);
        for (let tree of qt.walkTrees()) {
            Box.fromBounds(tree.getBounds()).draw(rcBg);
        }
    } else {
    }
})
// Add stuff to ball animator...

ballAnimator.add(ball);
ballAnimator.add(players);
ballAnimator.add(tube);

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

const ball2 = new Ball(350,350);
boundsAnimator.add(tube);
boundsAnimator.add(ball2);

ballAnimator.tick=(time,surface)=> {
    // Players that will follow the ball. Adjust follow point to the new position of the ball.
    players.forEach(p=>{
        p.attractToPoint(ball.position);
    });

    // Clear the canvas
    clear();

    // If the ball is exiting the tube...
    if (ball.exits(tube)) {
        const bb=ball.getBounds();
        const tb=tube.getBounds();
        let vec = ball.velocity;
        if (bb.x2>tb.x2) { // At right
            vec=new Vector2D({angle:Math.PI-vec.angle,magnitude:vec.magnitude});
        } else
        if (bb.x1<tb.x1) { // At left
            vec=new Vector2D({angle:Math.PI-vec.angle,magnitude:vec.magnitude});
        } else
        if (bb.y1<tb.y1) { // At top
            vec=new Vector2D({angle:2*Math.PI-vec.angle,magnitude:vec.magnitude});
        } else
        if (bb.y2>tb.y2) { // At bottom
            vec=new Vector2D({angle:2*Math.PI-vec.angle,magnitude:vec.magnitude});
        }
        ball.velocity=vec;
    }
}

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
let demoMode="";

boundsAnimator.tick=(time,surface) => {
    clear();
    ball2.position=mouse;
    ball2.setColor(ball2.intersects(tube.getBounds())?'#FF5555':'white');
    // This maually draws bounding rects around the ball that will be drawn by the ball.
    const b=ball2.getBounds();
    // const p=tube.getBounds();
    ball2.refresh(surface);
    surface.rectangle(b.x1,b.y1,b.x2-b.x1,b.y2-b.y1,{stroke:'#FF5555'});
    // surface.rectangle(p.x1,p.y1,p.x2-p.x1,p.y2-p.y1,{stroke:'#55FF55'});
    // console.log(b.x1,b.y1,b.x2-b.x1,b.y2-b.y1)
}

const qt=new QuadTree(<Bounds>{x1:0,y1:0,x2:canvas.width,y2:canvas.height},5);
const balls: Array<Ball>=[];
for (let i=0;i<1000;i++) {
    const ball=new Ball(random(1,canvas.width-1),random(1,canvas.height-1),2);
    ball.setColor('#9999FF');
    balls.push(ball);
    qt.insert(ball.position,ball);
}
let rx=<HTMLInputElement>document.querySelector('[name="x"]')
let ry=<HTMLInputElement>document.querySelector('[name="y"]')

quadTreeAnimator.tick=(time,surface) => {
    clear(rc);
    // Draw all points every tick.
    // This is very slow. Need to find faster way to walk all points that is just as convenient.
    let x=0;
    let mode=<HTMLInputElement>document.querySelector('[name="mode"]:checked');
    if (mode.value=="range") {
        // Create and draw our box that will be "find what's inside"
        let box=new Box(mouse.x-(rx.value/2),mouse.y-(ry.value/2),mouse.x+(rx.value/2),mouse.y+(ry.value/2));
        // Make it red
        box.setColor('red');
        // Draw ut.
        box.draw(rc);
        // Find all points within the box. Box implements Rect. find takes a Rect.
        // Then, loop through each of them, setting color to litght green, refreshing the drawing, drawing, and resetting back.
        qt.find(box).forEach(p=>p[1].setColor('#99FF99')||p[1].refresh(rc)||p[1].draw(rc)||p[1].setColor("#9999FF")||p[1].refresh(rc));
    } else {
        const tree=qt.findTreeFromPoint(mouse);
        if (tree) {
            tree.getPoints().forEach(p=>p[1].setColor('#99FF99')||p[1].refresh(rc)||p[1].draw(rc)||p[1].setColor("#9999FF")||p[1].refresh(rc));
        }
    }
}


// Draw balls.
for (var i=0;i<balls.length;i++) balls[i].draw(rcBg);

function clear(c=rc) {
    // Clear the canvas
    c.ctx.clearRect(0,0,canvas.width,canvas.height);

}
// Demo attachments. No need to add to animator. Attached items render with object attached to.
players[0].link(pline);
players[1].attach(pline2);

// expose objects to play around.
window.Vector2D = Vector2D;
window.Point2D = Point2D;
window.rc=rc;