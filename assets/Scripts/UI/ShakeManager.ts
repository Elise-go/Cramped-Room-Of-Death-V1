
import { _decorator, Component, game } from 'cc';
import { EVENT_ENUM, SHAKE_DIRECTION_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';


const { ccclass, property } = _decorator;

@ccclass('ShakeManager')
export class ShakeManager extends Component {
    private isShaking: boolean = false;
    private direction!: SHAKE_DIRECTION_ENUM
    private oldTime: number = 0;
    private oldPos: { x: number, y: number } = { x: 0, y: 0 };

    onLoad() {
        EventManager.Instance.onUnclear(EVENT_ENUM.SCREEN_SHAKE, this.onShake, this);
    }

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.SCREEN_SHAKE, this.onShake);
    }

    onShake(type: SHAKE_DIRECTION_ENUM) {
        // 若舞台已正在震动中，此时应阻止二次震动
        if (this.isShaking) {
            return;
        }
        this.oldTime = game.totalTime;
        this.isShaking = true;
        this.direction = type;
        this.oldPos.x = this.node.position.x;
        this.oldPos.y = this.node.position.y;
    }

    update() {
        if (this.isShaking) {
            // 使用sin正弦函数实现震动效果
            const amount = 1.6; //振幅
            const frequency = 12; //频率
            const curTime = (game.totalTime - this.oldTime) / 1000; // 自变量为当前时间
            const duration = 200 / 1000;
            const offset = amount * Math.sin(frequency * Math.PI * curTime);//偏移距离

            // 设置震动偏移的方向
            if (this.direction === SHAKE_DIRECTION_ENUM.TOP) {
                this.node.setPosition(this.oldPos.x, this.oldPos.y - offset);
            } else if (this.direction === SHAKE_DIRECTION_ENUM.BOTTOM) {
                this.node.setPosition(this.oldPos.x, this.oldPos.y + offset);
            } else if (this.direction === SHAKE_DIRECTION_ENUM.LEFT) {
                this.node.setPosition(this.oldPos.x - offset, this.oldPos.y);
            } else if (this.direction === SHAKE_DIRECTION_ENUM.RIGHT) {
                this.node.setPosition(this.oldPos.x + offset, this.oldPos.y);
            }


            if (curTime > duration) {
                this.isShaking = false;
                this.node.setPosition(this.oldPos.x, this.oldPos.y);
            }
        }

    }

}