
import { AnimationClip } from "cc";
import DirectionSubState from "../../Base/DirectionSubState";
import State, { ANIMATION_SPEED } from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { EVENT_ENUM,DIRECTION_ENUM, SHAKE_DIRECTION_ENUM } from "../../Enums";
import EventManager from "../../Runtime/EventManager";

const BASE_URL = 'texture/player/attack'

export default class DeathSubState extends DirectionSubState {

    constructor(fsm: StateMachine) {
        super(fsm);
        this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top`));
        this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/bottom`));
        this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left`));
        this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/right`));

    }

}