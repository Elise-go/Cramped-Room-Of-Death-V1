

import { _decorator, Component, Animation, SpriteFrame } from 'cc';
import { FSM_PARAMS_TYPE_ENUM } from '../Enums';
import State from './State';
import { SubStateMachine } from './SubStateMachine';
const { ccclass, property } = _decorator;

type ParamsValueType = boolean | number;

export interface IParamsValue {
    type: FSM_PARAMS_TYPE_ENUM,
    value: ParamsValueType
}

export const getInitParamsTrigger = () => {
    return {
        type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
        value: false
    }
}

export const getInitParamsNumber = () => {
    return {
        type: FSM_PARAMS_TYPE_ENUM.NUMBER,
        value: 0
    }
}

@ccclass('StateMachine')
export  abstract class StateMachine extends Component {

    // 定义属性
    private _currentState: State | SubStateMachine = null;
    params: Map<string, IParamsValue> = new Map();
    stateMachines: Map<string, State | SubStateMachine> = new Map();
    animationComponent: Animation
    waitingList: Array<Promise<SpriteFrame[]>> = []


    abstract init(): void
    abstract run(): void


    get currentState() {
        return this._currentState;
    }

    set currentState(newState: State | SubStateMachine) {
        // 更换新的状态
        this._currentState = newState;
        // 更换新状态的动画剪辑，随后立即播放动画
        this._currentState.run();
        // DirectionSubStateMachine.ts中
        // run(){
        //     const value = this.fsm.getParamsValue(PARAMS_NAME_ENUM.DIRECTION);
        //     this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number]);// 联合类型强转number类型
        // }
    }

    getParamsValue(paramsName: string) { //在类 PlayerManager中调用
        if (this.params.has(paramsName)) {
            return this.params.get(paramsName).value
        }
    }

    setParamsValue(paramsName: string, value: ParamsValueType) { //在类 PlayerManager中调用
        if (this.params.has(paramsName)) {
            this.params.get(paramsName).value = value;
            this.run();
            this.resetTrigger();
        }
    }

  
    // 重置Trigger，使之回到初始状态
    resetTrigger(){
        for (const [_,value] of this.params) {
            if(value.type === FSM_PARAMS_TYPE_ENUM.TRIGGER){
                value.value = false;
            }
        }
    }

}




