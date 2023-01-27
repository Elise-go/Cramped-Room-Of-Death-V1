

import { _decorator } from 'cc';
import {  DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../Enums';
import { IEntity } from '../Levels';
import DataManager from '../Runtime/DataManager';
import EventManager from '../Runtime/EventManager';
import { EntityManager } from './EntityManager';

const { ccclass } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends EntityManager {

    async init(params:IEntity) {

        super.init(params);

        // 触发 PLAYER_BORN 的地方：PlayerManager.ts--updateXY()
        EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this);
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this);
        EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDie, this);
       
    }

    onDestory(){
        super.onDestroy();
        EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection);
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection);
        EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDie);
    }


    onChangeDirection(isInit:boolean = false){
        
        if(this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player){
            return;
        }

        const {x:playerX, y:playerY} = DataManager.Instance.player;
        
        let disX = Math.abs(this.x - playerX);
        let disY = Math.abs(this.y - playerY);

        if(disX === disY && !isInit){
            return;
        }

        if(playerX >= this.x && playerY <= this.y){ //玩家在第一象限
            this.direction = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.RIGHT ;
        }else if(playerX <= this.x && playerY <= this.y){//玩家在第二象限
            this.direction = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.LEFT ;
        }else if(playerX <= this.x && playerY >= this.y){//玩家在第三象限
            this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.LEFT ;
        }else if(playerX >= this.x && playerY >= this.y){//玩家在第四象限
           this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.RIGHT ;
        }
    }


    onDie(id:string){
        if(this.state === ENTITY_STATE_ENUM.DEATH){
            return;
        }

        if(this.id === id){
            this.state = ENTITY_STATE_ENUM.DEATH;
        }
        
    }


}