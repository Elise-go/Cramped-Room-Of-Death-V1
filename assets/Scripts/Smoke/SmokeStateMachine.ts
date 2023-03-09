

import { _decorator, Animation } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { getInitParamsNumber, StateMachine } from '../../Base/StateMachine';
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import DeathSubState from './DeathSubState';
import IdleSubState from './IdleSubState';
const { ccclass, property } = _decorator;


@ccclass('SmokeStateMachine')
export class SmokeStateMachine extends StateMachine {

    async init() {
        this.animationComponent = this.node.addComponent(Animation);
        this.initParams();
        this.initStateMachines();
        this.initAnimationEvent();
        await Promise.all(this.waitingList);
    }

    initParams() {
        this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber());
    }

    initStateMachines() {
        this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubState(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubState(this));
    }


    initAnimationEvent() {
        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip!.name;
            const whiteList = ['smoke/idle'];
            if (whiteList.some(v => name.includes(v))) {
                this.node.getComponent(EntityManager)!.state = ENTITY_STATE_ENUM.DEATH;
            }
        });
    }

}




