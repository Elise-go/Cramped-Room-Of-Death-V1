import { PARAMS_NAME_ENUM, SPRIKES_ORDER_MAP_NUMBER_ENUM } from "../Enums";
import { SubState } from "./SubState";


export default class SpritesSubState extends SubState {

    run() {
        const value = this.fsm.getParamsValue(PARAMS_NAME_ENUM.SPIKES_CUR_CLIP);
        this._currentState = this.stateMachines.get(SPRIKES_ORDER_MAP_NUMBER_ENUM[value as number])!;
        this._currentState.run();
    }

}