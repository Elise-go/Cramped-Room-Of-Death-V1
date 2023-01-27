
import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { PARAMS_NAME_ENUM, SPIKES_SHOW_ORDER_ENUM, SPRIKES_ORDER_MAP_NUMBER_ENUM } from "../../Enums";
import SpritesSubStateMachine from "./SpikesSubStateMachine";

const BASE_URL = 'texture/spikes/spikesone'

export default class SpikesOneSubStateMachine extends SpritesSubStateMachine {

    constructor(fsm:StateMachine){ 
        super(fsm);
        this.stateMachines.set(SPIKES_SHOW_ORDER_ENUM.ZERO, new State(fsm, `${BASE_URL}/zero`));
        this.stateMachines.set(SPIKES_SHOW_ORDER_ENUM.ONE, new State(fsm, `${BASE_URL}/one`));
        this.stateMachines.set(SPIKES_SHOW_ORDER_ENUM.TWO, new State(fsm, `${BASE_URL}/two`));
    }

    run(){
        const value = this.fsm.getParamsValue(PARAMS_NAME_ENUM.SPIKES_CUR_CLIP);
        this.currentState = this.stateMachines.get(SPRIKES_ORDER_MAP_NUMBER_ENUM[value as number]);
    }

}