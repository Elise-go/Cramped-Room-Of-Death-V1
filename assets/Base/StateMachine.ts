

import { _decorator, Component, Animation, SpriteFrame } from 'cc';
import { FSM_PARAMS_TYPE_ENUM } from '../Enums';
import State from './State';
import { SubState } from './SubState';
const { ccclass, property } = _decorator;

/* 
若往后扩展，接口IParamsValue的 value的类型有多种类型，则value设为联合类型
如 type ParamsValueType = boolean | number;*/

export interface IParamsValue {
    type: FSM_PARAMS_TYPE_ENUM,
    value: number
}

// 设置参数列表中的初始参数值
export const getInitParamsNumber = () => {
    return {
        type: FSM_PARAMS_TYPE_ENUM.NUMBER,
        value: 0
    }
}

@ccclass('StateMachine')
export abstract class StateMachine extends Component {

    private _currentSubState!: SubState

    // 参数列表
    params: Map<string, IParamsValue> = new Map();
    // 状态机列表
    stateMachines: Map<string, SubState> = new Map();
    animationComponent!: Animation
    waitingList: Array<Promise<SpriteFrame[]>> = [];


    abstract init(): void

    getParamsValue(paramsName: string) {
        if (this.params.has(paramsName)) {
            return this.params.get(paramsName)!.value
        }
    }

    /* Player的参数列表项： DIRECTION
       Spikes的参数列表项： SPIKES_CUR_CLIP、SPIKES_TOTAL_CLIPS
    */
    setParamsValue(paramsName: string, value: number) {
        if (this.params.has(paramsName)) {
            this.params.get(paramsName)!.value = value;
            // 初始化时this._currentSubState还是undefined,先不用执行run()方法
            if (this._currentSubState) {
                this._currentSubState.run();
            }
        }

    }

    run(paramsName: string) {
        // 拿到相应的子状态
        this._currentSubState = this.stateMachines.get(paramsName)!;
        // 委托给相应子状态的 run() 执行
        this._currentSubState.run();
    }


}




