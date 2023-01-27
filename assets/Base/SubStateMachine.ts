

import { _decorator } from 'cc';
import State from './State';
import { StateMachine } from './StateMachine';
const { ccclass, property } = _decorator;


export  abstract class SubStateMachine {

    // 定义属性
    private _currentState: State = null;
    stateMachines: Map<string, State> = new Map();

    constructor(public fsm:StateMachine){ //属性参数的写法 
    }

    get currentState() {
        return this._currentState;
    }

    set currentState(newState: State) {
        
        this._currentState = newState;
        this._currentState.run();
            // State.ts中
            // run() { 
            //     this.fsm.animationComponent.defaultClip = this.animationClip; 
            //     this.fsm.animationComponent.play();
            // }
    }


    abstract run(): void

}




