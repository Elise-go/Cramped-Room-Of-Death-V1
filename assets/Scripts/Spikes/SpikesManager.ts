
import { _decorator, Component, Sprite, UITransform } from 'cc';
import { StateMachine } from '../../Base/StateMachine';
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM, SPIKES_TYPE_ENUM, SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM } from '../../Enums';
import { ISpikes } from '../../Levels';
import DataManager from '../../Runtime/DataManager';
import EventManager from '../../Runtime/EventManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { SpikesStateMachine } from './SpikesStateMachine';

const { ccclass, property } = _decorator;


@ccclass('SpikesManager')
export class SpikesManager extends Component {

    x: number = 0;
    y: number = 0;
    fsm!: StateMachine  //具体值待定
    type!: SPIKES_TYPE_ENUM
    private _clip: number = 0;
    private _totalClips: number = 0;

    get clip() {
        return this._clip;
    }

    set clip(newClip: number) {
        this._clip = newClip;
        this.fsm.setParamsValue(PARAMS_NAME_ENUM.SPIKES_CUR_CLIP, this._clip);
    }

    get totalClips() {
        return this._totalClips;
    }

    set totalClips(newClips: number) {
        this._totalClips = newClips;
        //SpikesStateMachine中initAnimationEvent()需用到
        this.fsm.setParamsValue(PARAMS_NAME_ENUM.SPIKES_TOTAL_CLIPS, this._totalClips);
        this.fsm.run(SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM[this._totalClips]);
    }

    async init(params: ISpikes) {

        const sprite = this.node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        const transform = this.node.getComponent(UITransform);
        transform!.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

        this.fsm = this.node.addComponent(SpikesStateMachine);
        await this.fsm.init();

        this.x = params.x;
        this.y = params.y;
        this.type = params.type;
        this.clip = params.clip;
        this.totalClips = SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM[this.type];

        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop, this);

    }

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop);
    }

    update() {
        this.node.setPosition(this.x * TILE_WIDTH - 1.5 * TILE_WIDTH, - this.y * TILE_HEIGHT + 1.5 * TILE_HEIGHT);
    }

    onLoop() {
        if (this.clip === this.totalClips) {
            this.clip = 1;
        } else {
            this.clip++;
        }

        this.onAttack();

    }

    onAttack() {
        if (!DataManager.Instance.player) {
            return;
        }

        const { x: playerX, y: playerY } = DataManager.Instance.player;
        if (this.x === playerX && this.y === playerY && this.clip === this.totalClips) {
            EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, [ENTITY_STATE_ENUM.DEATH]);
        }
    }


} 