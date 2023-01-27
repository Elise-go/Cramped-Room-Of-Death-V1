
import { DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from "../Enums";
import { SubStateMachine } from "./SubStateMachine";



export default class DirectionSubStateMachine extends SubStateMachine{

    run(){
        const value = this.fsm.getParamsValue(PARAMS_NAME_ENUM.DIRECTION);
        this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number]);// 联合类型强转number类型
    }
}