import rough from 'roughjs';
import {Ball, Food, Poison, Player, Animator, Axis, VLine, Vector2D, Point2D} from './objects.ts';
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
const playerCount = 1;

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
    players[i].maxSpeed=5;
    // players[i].setAngle(random(0,360));
    // players[i].setAngle(0);
}

// requestAnimationFrame(drawing.bind(null,rc));

const canvasBounds=rc.canvas.getBoundingClientRect();
let offsetX=canvasBounds.x;
let offsetY=canvasBounds.y;
rc.canvas.addEventListener("mousemove",function(e) {
    const mouse=new Point2D(e.clientX-offsetX,e.clientY-offsetY);
    players.forEach(p=>{
        p.attractToPoint(mouse);
    });
});

rc.canvas.addEventListener("click",function(e) {
    players[0].applyForce(players[0].velocity.scale(-1));
});
document.getElementById('start').addEventListener('click',()=>{
    ani.start();
});
document.getElementById('stop').addEventListener('click',()=>{
    ani.stop();
});

const ani=new Animator(rc);
const ball = new Ball(350,350)
ball.velocity=new Vector2D(0,0);
ball.applyForce(new Vector2D(0,1));
ball.maxSpeed=25;
// ani.add(obstacles);
ani.add(ball);
// ani.add(players);
// ani.tick=(time,surface)=> {
    
// }

const line= new VLine(150,0);
// players[0].link(line);
// players[1].attach(line);
// players[2].attach(line);
//ani.add(line);
ani.draw(); // draw once

