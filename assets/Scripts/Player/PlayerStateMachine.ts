
import { _decorator, Animation } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import AirDeathSubStateMachine from './AirDeathSubStateMachine';
import AttackSubStateMachine from './AttackSubStateMachine';
import BlockBackSubStateMachine from './BlockBackSubStateMachine';
import BlockFrontSubStateMachine from './BlockFrontSubStateMachine';
import BlockLeftSubStateMachine from './BlockLeftSubStateMachine';
import BlockRightSubStateMachine from './BlockRightSubStateMachine';
import BlockTurnLeftSubStateMachine from './BlockTurnLeftSubStateMachine';
import BlockTurnRightSubStateMachine from './BlockTurnRightSubStateMachine';
import DeathSubStateMachine from './DeathSubStateMachine';
import IdleSubStateMachine from './IdleSubStateMachine';
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine';
import TurnRightSubStateMachine from './TurnRightSubStateMachine';
const { ccclass, property } = _decorator;


@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {

    async init() { // 在PlayerManager.ts-- async init()中被调用
        this.animationComponent = this.node.addComponent(Animation);
        this.initParams();
        this.initStateMachines();
        this.initAnimationEvent();
        //等所有资源都加载完才退出init()，保证在PlayerManager.ts中 setParamsValue()是在init()后执行
        await Promise.all(this.waitingList);
    }

    initParams() {
        this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber());

        this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.TURNLEFT, getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.TURNRIGHT, getInitParamsTrigger());
        
        this.params.set(PARAMS_NAME_ENUM.BLOCKFRONT,getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.BLOCKBACK,getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.BLOCKLEFT,getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.BLOCKRIGHT,getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT,getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT,getInitParamsTrigger());

        this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.AIRDEATH, getInitParamsTrigger());
 
    }

    initStateMachines() {
        this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT, new TurnLeftSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.TURNRIGHT, new TurnRightSubStateMachine(this));

        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKFRONT, new BlockFrontSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKBACK, new BlockBackSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKLEFT, new BlockLeftSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKRIGHT, new BlockRightSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT, new BlockTurnLeftSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT, new BlockTurnRightSubStateMachine(this));

        this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new AttackSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.AIRDEATH, new AirDeathSubStateMachine(this));
    }


    initAnimationEvent(){
        this.animationComponent.on(Animation.EventType.FINISHED, ()=>{
            const name = this.animationComponent.defaultClip.name;
            const whiteList = ['block','turn','attack'];
            if(whiteList.some(v => name.includes(v) )){
                this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE;
            }  
        });
    }


    // 根据当前 TURNLEFT / IDLE 对应的 TRIGGER的value值，将currentState切换成相应的子状态机
    run() {
        switch (this.currentState) {
            case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
            case this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT):
            case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):

            case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT):
            case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKBACK):
            case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKLEFT):
            case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKRIGHT):
            case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT):
            case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT):

            case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
            case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
            case this.stateMachines.get(PARAMS_NAME_ENUM.AIRDEATH):
                
                if (this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value) { //TURNLEFT 对应的 TRIGGER为True,下同...
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT); // 触发调用setter,下同...
                }else if (this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value) { 
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT); 
                }else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE); 

                }else if (this.params.get(PARAMS_NAME_ENUM.BLOCKFRONT).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT); 
                }else if (this.params.get(PARAMS_NAME_ENUM.BLOCKBACK).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKBACK); 
                }else if (this.params.get(PARAMS_NAME_ENUM.BLOCKLEFT).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKLEFT); 
                }else if (this.params.get(PARAMS_NAME_ENUM.BLOCKRIGHT).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKRIGHT); 
                }else if (this.params.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT); 
                }else if (this.params.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT); 

                }else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK); 
                }else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH); 
                }else if (this.params.get(PARAMS_NAME_ENUM.AIRDEATH).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.AIRDEATH); 
                }


                break;

            default:
                this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE); // 初始化currentState
        }
    }

    

}




