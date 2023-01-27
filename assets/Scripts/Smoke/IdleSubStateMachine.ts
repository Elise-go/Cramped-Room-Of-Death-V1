
import DirectionSubStateMachine from "../../Base/DirectionSubStateMachine";
import State, { ANIMATION_SPEED } from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { DIRECTION_ENUM } from "../../Enums";

const BASE_URL = 'texture/smoke/idle'

export default class IdleSubStateMachine extends DirectionSubStateMachine{

    constructor(fsm:StateMachine){ 
        super(fsm);
        this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top`, ANIMATION_SPEED / 1.5));
        this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/bottom`, ANIMATION_SPEED / 1.5));
        this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left`, ANIMATION_SPEED / 1.5));
        this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/right`, ANIMATION_SPEED / 1.5));
    }

}