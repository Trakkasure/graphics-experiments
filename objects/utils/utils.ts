

export function random(start: number,end: number): number {return !end&&start==1?Math.random():!end&&((end=start),(start=0)),Math.round(Math.random()*Math.abs(end-start))+start}
export function newChar(): string {let c=random(63,122);c=(c===63?32:c===64?46:c);return String.fromCharCode(c)}

export function distance(x1: number,y1: number,x2: number,y2: number): number {return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2))}

export default function():void {console.log("no default here");}