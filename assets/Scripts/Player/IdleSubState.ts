
import { AnimationClip } from "cc";
import DirectionSubState from "../../Base/DirectionSubState";
import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { DIRECTION_ENUM } from "../../Enums";

const BASE_URL = 'texture/player/idle'

export default class IdleSubState extends DirectionSubState {

    constructor(fsm: StateMachine) { //属性参数的写法，接受父类状态机
        // 注意！！派生类的构造函数必须包含super调用
        super(fsm);
        this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top`, AnimationClip.WrapMode.Loop));
        this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/bottom`, AnimationClip.WrapMode.Loop));
        this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left`, AnimationClip.WrapMode.Loop));
        this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/right`, AnimationClip.WrapMode.Loop));
    }

}