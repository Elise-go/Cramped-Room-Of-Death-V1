
import { SubStateMachine } from "../../Base/SubStateMachine";
import { PARAMS_NAME_ENUM, SPRIKES_ORDER_MAP_NUMBER_ENUM } from "../../Enums";


export default class SpritesSubStateMachine extends SubStateMachine {
    
    run(){
        const value = this.fsm.getParamsValue(PARAMS_NAME_ENUM.SPIKES_CUR_CLIP);
        this.currentState = this.stateMachines.get(SPRIKES_ORDER_MAP_NUMBER_ENUM[value as number]);
    }
    
}