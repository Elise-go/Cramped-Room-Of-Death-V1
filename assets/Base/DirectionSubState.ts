
import { DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from "../Enums";
import { SubState } from "./SubState";



export default class DirectionSubState extends SubState {

    // 委托给相应状态的 run() 执行
    run() {
        // 拿到当前节点的方向值
        const value = this.fsm.getParamsValue(PARAMS_NAME_ENUM.DIRECTION);
        // 在stateMachines映射表里，将方向值映射到对应的状态state
        this._currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])!;// 联合类型强转number类型
        // 委托给相应状态的 run() 执行
        this._currentState.run();
    }
}