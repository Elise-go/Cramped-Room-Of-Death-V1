
import { _decorator, Animation } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { getInitParamsNumber, StateMachine } from '../../Base/StateMachine';
import { DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import AirDeathSubState from './AirDeathSubState';
import AttackSubState from './AttackSubState';
import BlockBackSubState from './BlockBackSubState';
import BlockFrontSubState from './BlockFrontSubState';
import BlockLeftSubState from './BlockLeftSubState';
import BlockRightSubState from './BlockRightSubState';
import BlockTurnLeftSubState from './BlockTurnLeftSubState';
import BlockTurnRightSubState from './BlockTurnRightSubState';
import DeathSubState from './DeathSubState';
import IdleSubState from './IdleSubState';
import TurnLeftSubState from './TurnLeftSubState';
import TurnRightSubState from './TurnRightSubState';
const { ccclass, property } = _decorator;


@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {

    async init() { // 在PlayerManager.ts-- async init()中被调用
        this.animationComponent = this.node.addComponent(Animation);
        this.initParams(); //初始化参数列表
        this.initStateMachines(); //初始化状态机
        this.initAnimationEvent(); // 初始化动画事件
        //等所有图片资源都加载完才退出init()，保证在PlayerManager.ts中 setParamsValue()是在init()后执行
        await Promise.all(this.waitingList); // 由 State.ts 将图片资源的期约推进 waitingList
    }

    initParams() {
        this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber());

    }

    initStateMachines() {
        this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubState(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT, new TurnLeftSubState(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.TURNRIGHT, new TurnRightSubState(this));

        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKFRONT, new BlockFrontSubState(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKBACK, new BlockBackSubState(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKLEFT, new BlockLeftSubState(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKRIGHT, new BlockRightSubState(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT, new BlockTurnLeftSubState(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT, new BlockTurnRightSubState(this));

        this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new AttackSubState(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubState(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.AIRDEATH, new AirDeathSubState(this));
    }


    initAnimationEvent() {
        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip!.name;
            const whiteList = ['block', 'turn', 'attack'];
            if (whiteList.some(v => name.includes(v))) {
                this.node.getComponent(EntityManager)!.state = ENTITY_STATE_ENUM.IDLE;
            }
        });

    }

}




