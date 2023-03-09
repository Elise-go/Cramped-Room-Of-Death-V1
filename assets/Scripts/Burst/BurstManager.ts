
import { UITransform, _decorator } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, SHAKE_DIRECTION_ENUM } from '../../Enums';
import { IEntity } from '../../Levels';
import DataManager from '../../Runtime/DataManager';
import EventManager from '../../Runtime/EventManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { BurstStateMachine } from './BurstStateMachine';

const { ccclass, property } = _decorator;


@ccclass('BurstManager')
export class BurstManager extends EntityManager {

    async init(params: IEntity) {

        this.fsm = this.node.addComponent(BurstStateMachine);
        await this.fsm.init();

        super.init(params);
        const transform = this.node.getComponent(UITransform);
        transform!.setContentSize(TILE_WIDTH, TILE_HEIGHT);

        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst, this);

    }

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst);
    }


    onBurst() {
        ('inonBurst');
        const { x: playerX, y: playerY, state: playerState } = DataManager.Instance.player!;
        if (this.x === playerX && this.y === playerY && this.state === ENTITY_STATE_ENUM.IDLE) {
            this.state = ENTITY_STATE_ENUM.ATTACK;
        } else if (this.state === ENTITY_STATE_ENUM.ATTACK) {
            this.state = ENTITY_STATE_ENUM.DEATH;
            EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, [SHAKE_DIRECTION_ENUM.BOTTOM]);
            if (this.x === playerX && this.y === playerY) { // 玩家仍站在上面
                EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, [ENTITY_STATE_ENUM.AIRDEATH]);
            }
        }

    }


    update() {
        // setPosition 的作用是将虚拟坐标映射到 Map上的实际坐标
        // !!!注意: 为了Entity在地图里的纵坐标为正，这里的纵坐标取相反值
        this.node.setPosition(this.x * TILE_WIDTH, - this.y * TILE_HEIGHT);

    }


}