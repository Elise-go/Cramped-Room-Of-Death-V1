
import { AnimationClip } from "cc";
import DirectionSubStateMachine from "../../Base/DirectionSubStateMachine";
import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { DIRECTION_ENUM } from "../../Enums";

const BASE_URL = 'texture/ironskeleton/idle'

export default class IdleSubStateMachine extends DirectionSubStateMachine{

    constructor(fsm:StateMachine){ //接受顶层状态机
        // 在类构造函数中使用super可以调用父类构造函数
        super(fsm);
        this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top`,AnimationClip.WrapMode.Loop));
        this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/bottom`,AnimationClip.WrapMode.Loop));
        this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left`,AnimationClip.WrapMode.Loop));
        this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/right`,AnimationClip.WrapMode.Loop));
    }

}