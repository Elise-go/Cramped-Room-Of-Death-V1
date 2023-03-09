
import { _decorator } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import { IEntity } from '../../Levels';
import DataManager from '../../Runtime/DataManager';
import EventManager from '../../Runtime/EventManager';
import { DoorStateMachine } from './DoorStateMachine';


const { ccclass, property } = _decorator;


@ccclass('DoorManager')
export class DoorManager extends EntityManager {

    async init(params: IEntity) {

        this.fsm = this.node.addComponent(DoorStateMachine);
        await this.fsm.init();
        super.init(params);

        EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN, this.onOpen, this);

    }

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN, this.onOpen);
    }

    onOpen() {

        if (DataManager.Instance.enemies.every(enemy => enemy.state === ENTITY_STATE_ENUM.DEATH)) {
            this.state = ENTITY_STATE_ENUM.DEATH;
        }

    }



}