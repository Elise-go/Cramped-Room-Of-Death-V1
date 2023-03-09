
import { _decorator } from 'cc';
import State from './State';
import { StateMachine } from './StateMachine';
const { ccclass, property } = _decorator;


export abstract class SubState {

    // 定义属性
    protected _currentState!: State;
    get currentState() {
        return this._currentState;
    }
    
    stateMachines: Map<string, State> = new Map();

    constructor(protected fsm: StateMachine) { //属性参数的写法 
    }

    //委托给相应状态的 run() 执行, 具体由子类实现
    abstract run(): void 

}




