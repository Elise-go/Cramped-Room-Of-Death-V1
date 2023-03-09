
import { _decorator, Animation } from 'cc';
import { getInitParamsNumber, StateMachine } from '../../Base/StateMachine';
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM, SPIKES_TYPE_ENUM, SPRIKES_ORDER_MAP_NUMBER_ENUM, SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM } from '../../Enums';
import IdleSubState from '../WoodenSkeleton/IdleSubState';
import SpikesFourSubState from './SpikesFourSubState';
import { SpikesManager } from './SpikesManager';
import SpikesOneSubState from './SpikesOneSubState';
import SpikesThreeSubState from './SpikesThreeSubState';
import SpikesTwoSubState from './SpikesTwoSubState';

const { ccclass, property } = _decorator;


@ccclass('SpikesStateMachine')
export class SpikesStateMachine extends StateMachine {

    async init() {
        this.animationComponent = this.node.addComponent(Animation);
        this.initParams();
        this.initStateMachines();
        this.initAnimationEvent();
        await Promise.all(this.waitingList);
    }

    initParams() {

        this.params.set(PARAMS_NAME_ENUM.SPIKES_CUR_CLIP, getInitParamsNumber());
        this.params.set(PARAMS_NAME_ENUM.SPIKES_TOTAL_CLIPS, getInitParamsNumber());

    }

    initStateMachines() {
        this.stateMachines.set(SPIKES_TYPE_ENUM.SPIKES_ONE, new SpikesOneSubState(this));
        this.stateMachines.set(SPIKES_TYPE_ENUM.SPIKES_TWO, new SpikesTwoSubState(this));
        this.stateMachines.set(SPIKES_TYPE_ENUM.SPIKES_THREE, new SpikesThreeSubState(this));
        this.stateMachines.set(SPIKES_TYPE_ENUM.SPIKES_FOUR, new SpikesFourSubState(this));
    }

    initAnimationEvent() {
        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip!.name;
            const value = this.getParamsValue(PARAMS_NAME_ENUM.SPIKES_TOTAL_CLIPS);

            if (value === SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM.SPIKES_ONE && name.includes('two') ||
                value === SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM.SPIKES_TWO && name.includes('three') ||
                value === SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM.SPIKES_THREE && name.includes('four') ||
                value === SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM.SPIKES_FOUR && name.includes('five')) {
                this.node.getComponent(SpikesManager)!.clip = 0;
            }
        });
    }

}




