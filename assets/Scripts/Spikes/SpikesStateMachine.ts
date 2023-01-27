
import { _decorator, Animation } from 'cc';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM, SPRIKES_ORDER_MAP_NUMBER_ENUM, SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM } from '../../Enums';
import IdleSubStateMachine from '../WoodenSkeleton/IdleSubStateMachine';
import SpikesFourSubStateMachine from './SpikesFourSubStateMachine';
import { SpikesManager } from './SpikesManager';
import SpikesOneSubStateMachine from './SpikesOneSubStateMachine';
import SpikesThreeSubStateMachine from './SpikesThreeSubStateMachine';
import SpikesTwoSubStateMachine from './SpikesTwoSubStateMachine';

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
        this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_ONE, new SpikesOneSubStateMachine(this));
        this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_TWO, new SpikesTwoSubStateMachine(this));
        this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_THREE, new SpikesThreeSubStateMachine(this));
        this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_FOUR, new SpikesFourSubStateMachine(this));
    }

    initAnimationEvent(){
        this.animationComponent.on(Animation.EventType.FINISHED, ()=>{
            const name = this.animationComponent.defaultClip.name;
            const value = this.getParamsValue(PARAMS_NAME_ENUM.SPIKES_TOTAL_CLIPS);

            if( value === SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM.SPIKES_ONE && name.includes('two')||
                value === SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM.SPIKES_TWO && name.includes('three')||
                value === SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM.SPIKES_THREE && name.includes('four')||
                value === SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM.SPIKES_FOUR && name.includes('five'))
            {
                this.node.getComponent(SpikesManager).clip = 0;
            }  
        });
    }


    
    run() {
        const value = this.getParamsValue(PARAMS_NAME_ENUM.SPIKES_TOTAL_CLIPS);

        switch (this.currentState) {     
            case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE):
            case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_TWO):
            case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_THREE):
            case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_FOUR):

                if ( value === SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM.SPIKES_ONE) {
                    this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE); 

                }else if(value === SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM.SPIKES_TWO){
                    this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_TWO);
                
                }else if(value === SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM.SPIKES_THREE){
                    this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_THREE);
                
                }else if(value === SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM.SPIKES_FOUR){
                    this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_FOUR);
                
                }
                break;
            default:
                this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE);

        }
    }

    

}




