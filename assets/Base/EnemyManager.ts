

import { _decorator } from 'cc';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../Enums';
import { IEntity } from '../Levels';
import DataManager from '../Runtime/DataManager';
import EventManager from '../Runtime/EventManager';
import { EntityManager } from './EntityManager';

const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends EntityManager {

    async init(params: IEntity) {

        super.init(params);

        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this);
        EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDie, this);

        // 需求：当enemy比player先生成时，enemy也能朝向玩家的初始位置
        this.onChangeDirection(true);
    }

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection);
        EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDie);
    }


    onChangeDirection(isInit: boolean = false) {
        // 当enemy为死亡状态时，停止改变朝向
        if (this.state === ENTITY_STATE_ENUM.DEATH) {
            return;
        }

        // 获取player的位置
        let playerX = 0, playerY = 0;
        if (isInit) {
            playerX = DataManager.Instance.playerInfo!.x;
            playerY = DataManager.Instance.playerInfo!.y;
        } else {
            playerX = DataManager.Instance.player!.x;
            playerY = DataManager.Instance.player!.y;
        }

        // 分别计算出敌人和玩家在x坐标上、y坐标上的差值
        let disX = Math.abs(this.x - playerX);
        let disY = Math.abs(this.y - playerY);

        //需求：关卡初始化后，player若走到了enemy位置的对角线上时，enmey的朝向不变
        if (disX === disY && !isInit) {
            return;
        }

        if (playerX > this.x && playerY <= this.y) { //玩家在敌人位置的第一象限时
            this.direction = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.RIGHT;
        } else if (playerX <= this.x && playerY < this.y) {//玩家在第二象限
            this.direction = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.LEFT;
        } else if (playerX < this.x && playerY >= this.y) {//玩家在第三象限
            this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.LEFT;
        } else if (playerX >= this.x && playerY > this.y) {//玩家在第四象限
            this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.RIGHT;
        }

    }


    onDie(id: string) {

        if (this.id === id) {
            this.state = ENTITY_STATE_ENUM.DEATH;
        }

    }


}