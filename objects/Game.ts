import {Animator} from './graphics/Animator';

export type EventLoopCallback = (tick: number,time: number)=>void;

export class Game {

    /** What a standard timestep should represent. */
    timestep: number = 1/20; // game block processing time step
    animationTimeStep: number=1/30; // animation timestep.
    delta: number = 0;
    lastFrameTimeMs: number=0;
    /** if true, animate frames between delta overflow */
    animateDelayedUpdate: boolean = false;
    animators: Array<Animator>=[];
    events: {
        begin: Array<EventLoopCallback>,
        main: Array<EventLoopCallback>,
        end: Array<EventLoopCallback>
    }={
        begin:[],
        main:[],
        end:[]
    };
 
    gameTick: number = 0;
    mainLoop=(timestamp)=>{
        // Track the accumulated time that hasn't been simulated yet
        this.delta += timestamp - this.lastFrameTimeMs / 1000;
        this.lastFrameTimeMs = timestamp;
    
        // Simulate the total elapsed time in fixed-size chunks
        const step=Math.min(this.timestep,this.animationTimeStep);
        while (this.delta >= step) {
            if (this.delta-this.animationTimeStep<this.animationTimeStep)
                this.animate(this.gameTick,timestamp-this.delta);
            if (this.delta-this.timestep<this.timestep)
                this.gameLoop(this.gameTick,timestamp-this.delta);
            this.delta -= step;
        }
        requestAnimationFrame(this.mainLoop);
    }

    gameLoop(gameTick:number,timestamp:number):void {
        this.gameTick++; // increment the game tick (one tick per timestep)
        this.trigger('begin', gameTick, timestamp);
        this.trigger('main', gameTick, timestamp);
        this.trigger('end', gameTick, timestamp);
    }

    trigger(event: string,gameTick: number, timestamp: number):void{
        this.events[event].forEach(e=>e(gameTick, timestamp));
    }

    animate(gameTick: number,timestamp: number):void {
        this.animators.forEach(a=>a.animate(gameTick,timestamp))
    }

    addAnimator(ani: Animator):void {
        if(this.animators.includes(ani)) return;
        this.animators.push(ani);
    }

    removeAnimator(ani: Animator):void {
        if(!this.animators.includes(ani)) return;
        this.animators.splice(this.animators.indexOf(ani),1);
    }


    addEventListener(type: string, func: EventLoopCallback):void {
        if(this.events[type].includes(func)) return;
        this.events[type].push(func);
    }

    removeEventListener(type: string, func: EventLoopCallback):void {
        if(!this.events[type].includes(func)) return;
        this.events[type].splice(this.events[type].indexOf(func),1);
    }

}