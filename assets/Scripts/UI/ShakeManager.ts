
import { _decorator, Component, game } from 'cc';
import { EVENT_ENUM, SHAKE_DIRECTION_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';

const { ccclass, property } = _decorator;

@ccclass('ShakeManager')
export class ShakeManager extends Component {
    private isShaking : boolean = false
    private direction : SHAKE_DIRECTION_ENUM
    private oldTime: number = 0
    private oldPos: {x:number, y:number} = {x:0, y:0}

    init(){
        EventManager.Instance.on(EVENT_ENUM.SCREEN_SHAKE, this.onShake, this);
    }

    onDestory(){
        EventManager.Instance.off(EVENT_ENUM.SCREEN_SHAKE, this.onShake);
    }

    onShake(type: SHAKE_DIRECTION_ENUM){
        if(this.isShaking){
            return;
        }

        this.oldTime = game.totalTime;
        this.isShaking = true;
        this.direction = type;
        this.oldPos.x = this.node.position.x;
        this.oldPos.y = this.node.position.y;
    }

    update(){
        if(this.isShaking){
            const duration = 200;
            const amount = 1.6;
            const frequency = 12;
            const curSecond = (game.totalTime - this.oldTime) / 1000;
            const totalTime = duration / 1000;
            const offset = amount * Math.sin( frequency * Math.PI * curSecond);

            // 设置偏移的方向
            if(this.direction === SHAKE_DIRECTION_ENUM.TOP){
                this.node.setPosition(this.oldPos.x, this.oldPos.y - offset);
            }else if(this.direction === SHAKE_DIRECTION_ENUM.BOTTOM){
                this.node.setPosition(this.oldPos.x, this.oldPos.y + offset);
            }else if(this.direction === SHAKE_DIRECTION_ENUM.LEFT){
                this.node.setPosition(this.oldPos.x - offset, this.oldPos.y );
            }else if(this.direction === SHAKE_DIRECTION_ENUM.RIGHT){
                this.node.setPosition(this.oldPos.x + offset, this.oldPos.y );
            }
            

            if( curSecond > totalTime){
                this.isShaking = false;
                this.node.setPosition(this.oldPos.x, this.oldPos.y);
            }
        }
    }

    stop(){
        this.isShaking = false;
    }

}