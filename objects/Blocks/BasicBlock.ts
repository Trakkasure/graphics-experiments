import {Block} from "./Block";

export abstract class BasicBlock extends Block {

    abstract generate(seed: number);
    // Primary action. What happens when you use the primary action key/button on this block.
    action(modifier?: any): void {

    }
    // Seconday action. What happens when you use the seconday action key/button on this block.
    altAction(modifier?: any): void {

    }

    // Custom actions allowed for this block.
    customAction(actionKey:string, actionValue:string,modifier?: any) {

    }

}