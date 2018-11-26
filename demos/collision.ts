import rough from 'roughjs';
import { Ball, Player, VLine, vScreen } from '../objects/objects';
import { Animator } from '../objects/graphics/Animator';
import { Point2D } from '../objects/DataModel/DataStructures';
import { Vector2D } from '../objects/DataModel/Physics';
import { random } from '../objects/utils/utils'
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
let offsetX=canvasBounds.x;
let offsetY=canvasBounds.y;


const playerCount = 2;

const players = new Array<Player>(playerCount);
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

const ballAnimator=new Animator(rc);
const boundsAnimator=new Animator(rc);
const axisAnimator=new Animator(rc);
const quadTreeAnimator=new Animator(rc);

boundsAnimator.clearFrames(false);
quadTreeAnimator.clearFrames(false);


const ball = new Ball(350,350);
const tube = new vScreen(400,400);
tube.offset=new Point2D(canvas.width/2-tube.getBounds().x2/2,canvas.height/2-tube.getBounds().y2/2);

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

// Add stuff to ball animator...
ballAnimator.add(ball);
ballAnimator.add(players);
ballAnimator.add(tube);

ballAnimator.tick=(time,surface)=> {
    // Players that will follow the ball. Adjust follow point to the new position of the ball.
    players.forEach(p=>{
        p.attractToPoint(ball.getPosition());
    });

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
// Demo attachments. No need to add to animator. Attached items render with object attached to.
players[0].link(pline);
players[1].attach(pline2);

// expose objects to play around.
window.Vector2D = Vector2D;
window.Point2D = Point2D;
window.rc=rc;