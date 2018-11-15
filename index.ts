import rough from 'roughjs';
import {Borders, Ball, Food, Poison, Player, Animator, Axis, VLine, vScreen, Vector2D, Point2D} from './objects/objects.ts';
import {random} from './utils.ts';
import { Obstacle } from './objects';
import { RoughCanvas } from 'roughjs/bin/canvas';

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
    const text=document.createTextNode(`
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

const rc = rough
    .canvas(document.querySelector(canvasContainerSelector)
        .appendChild(Object.keys(canvasAttributes)
            .reduce((c,k)=>{c.setAttribute(k,canvasAttributes[k]);return c},document.createElement('canvas'))
        )
    );
window.rc=rc;
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
const velocity=new Vector2D(0,0);
const accelleration=velocity;
for (let i = 0; i < playerCount;i++) {
    players[i]=new Player(random(100,canvasAttributes.width-100),random(80,canvasAttributes.height-100),velocity);
    players[i].accelleration=accelleration;
    players[i].maxSpeed=3;
    // players[i].setAngle(random(0,360));
    // players[i].setAngle(0);
}

// requestAnimationFrame(drawing.bind(null,rc));

const canvasBounds=rc.canvas.getBoundingClientRect();
let offsetX=canvasBounds.x;
let offsetY=canvasBounds.y;
rc.canvas.addEventListener("mousemove",function(e) {
    // const mouse=new Point2D(e.clientX-offsetX,e.clientY-offsetY);
    // ball.position=new Point2D(e.clientX-offsetX,e.clientY-offsetY);
    // ball.setColor(ball.intersects(tube.getBounds())?'#FF5555':'white');
});

rc.canvas.addEventListener("click",function(e) {
    // players[0].applyForce(players[0].velocity.scale(-1));
        // console.log(vec);
    ball.applyForce(new Vector2D(0.3,0.1));
});
document.getElementById('start').addEventListener('click',()=>{
    ani.start();
});
document.getElementById('stop').addEventListener('click',()=>{
    ani.stop();
});


const ani=new Animator(rc);
const ball = new Ball(350,350);
const tube = new vScreen(400,400);
ball.velocity=new Vector2D(0,0);
ball.maxSpeed=10;
// ani.add(obstacles);
ani.add(ball);
ani.add(players);
ani.tick=(time,surface)=> {
    players.forEach(p=>{
        p.attractToPoint(ball.position);
    });
    refresh();
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

// const axis = new Axis(200,200);
const line = new VLine(1,0);
const line2 = new VLine(0,0);
line.setRoot(new Point2D(rc.canvas.width/2,rc.canvas.height/2));
line2.setRoot(new Point2D(rc.canvas.width/2,rc.canvas.height/2));
// line.draw(rc);
// axis.draw(rc);

function refresh(x,y) {
    rc.ctx.clearRect(0,0,rc.canvas.width,rc.canvas.height);
    // // axis.draw(rc);
    tube.draw(rc);
    // let vec=new Vector2D((x-rc.canvas.width/2),(y-rc.canvas.height/2));
    // if (vec.my==0) return;
    // console.log("Angle: %s",vec.angle*(180/Math.PI))
    // line.setVec(vec)
    // vec=new Vector2D({angle:2*Math.PI-vec.angle,magnitude:vec.magnitude});
    // // console.log("Angle 2: %s",Math.abs(vec.angle*(180/Math.PI)));
    // console.log("Angle 2: %s",vec.mx,vec.my);
    // line2.setVec(vec);
    // line.refresh(rc)
    // line.draw(rc);
    // line2.refresh(rc);
    // line2.draw(rc);
    ball.refresh(rc);
    ball.draw(rc);
    const b=ball.getBounds();
    const p=tube.getBounds();
    rc.rectangle(b.x1,b.y1,b.x2-b.x1,b.y2-b.y1,{stroke:'#FF5555'});
    rc.rectangle(p.x1,p.y1,p.x2-p.x1,p.y2-p.y1,{stroke:'#55FF55'});
}

// players[0].link(line);
// players[1].attach(line);
// players[2].attach(line);
ani.add(tube);
ani.draw(); // draw once

window.Vector2D = Vector2D;
window.Point2D = Point2D;