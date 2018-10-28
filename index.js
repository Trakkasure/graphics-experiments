import rough from 'roughjs';
import {Food, Poison, Player, Animator} from './objects.ts';
import {random} from './utils.ts';

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
        ${canvasContainerSelector} canvas {
            background: black;
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
const playerCount = 5;

const obstacles = new Array(foodCount+poisonCount);
const players = new Array(playerCount);

for (let i = 0; i < foodCount;i++) {
    obstacles[i]=new Food(random(80,canvasAttributes.width-80),random(80,canvasAttributes.height-80));
}
for (let i = 0; i < poisonCount;i++) {
    obstacles[foodCount+i]=new Poison(random(80,canvasAttributes.width-80),random(80,canvasAttributes.height-80));
}
for (let i = 0; i < playerCount;i++) {
    players[i]=new Player(random(100,canvasAttributes.width-100),random(80,canvasAttributes.height-100));
    players[i].setAngle(random(0,360));
}
// requestAnimationFrame(drawing.bind(null,rc));

let mouse={x:0,y:0};

rc.canvas.addEventListener("mousemove",function(e) {
    mouse={x:e.clientX,y:e.clientY};
    players.forEach(p=>{
        // const velocity=Math.sqrt(Math.pow(mouse.x-p.x,2)+Math.pow(mouse.y-p.y,2));
        const angle=Math.atan2((mouse.y-p.p.y),(mouse.x-p.p.x))*180/Math.PI;
        // console.log(p.angle*180/Math.PI,angle);
        p.setAngle(angle);
    });
});

document.getElementById('start').addEventListener('click',()=>{
    ani.start();
});
document.getElementById('stop').addEventListener('click',()=>{
    ani.stop();
});

const ani=new Animator(rc);
ani.add(obstacles);
ani.add(players);
ani.draw(); // draw once

