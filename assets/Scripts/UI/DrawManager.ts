
import { _decorator, Component, Graphics, view, Color, game, BlockInputEvents, UITransform } from 'cc';
import { TILE_HEIGHT } from '../Tile/TileManager';


const { ccclass, property } = _decorator;

const SCREEN_WIDTH = view.getVisibleSize().width;
const SCREEN_HEIGHT = view.getVisibleSize().height;

enum FADE_STATE_ENUM {
    IDLE = 'IDLE',
    FADE_IN = 'FADE_IN',
    FADE_OUT = 'FADE_OUT',
}

export const DEFAULT_DURATION = 200;

@ccclass('DrawManager')
export class DrawManager extends Component {
    private ctx!: Graphics
    private state: FADE_STATE_ENUM = FADE_STATE_ENUM.IDLE;
    private preTime: number = 0;// 之前的时间
    private duration: number = 0;
    private fadeResolve!: (value: number) => void
    private block!: BlockInputEvents


    init() {
        this.block = this.node.addComponent(BlockInputEvents);

        // 添加渲染组件 Graphics
        this.ctx = this.node.addComponent(Graphics);

        const transform = this.node.getComponent(UITransform)!;

        transform.setAnchorPoint(0.5, 0.5);
        transform.setContentSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    }


    setAlpha(percent: number) {
        this.ctx.clear();
        this.ctx.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.ctx.fillColor = new Color(0, 0, 0, 255 * percent);
        this.ctx.fill();
        // 当屏幕纯黑时，启用 BlockInputEvents组件
        this.block.enabled = (percent === 1);
    }


    update() { // 当 this.state!== FADE_STATE_ENUM.IDLE时，就会发生改变
        // percent 其实代表了时间的进度，它控制着透明度的比例
        const percent = (game.totalTime - this.preTime) / this.duration;

        switch (this.state) {
            case FADE_STATE_ENUM.FADE_IN:
                if (percent < 1) {
                    this.setAlpha(percent);
                } else { // 当 percent的值从0增加到1时 
                    this.setAlpha(1);
                    this.state = FADE_STATE_ENUM.IDLE;
                    this.fadeResolve(1); //此时 Promise状态变为fulfilled
                }
                break;
            case FADE_STATE_ENUM.FADE_OUT:
                if (percent < 1) {
                    this.setAlpha(1 - percent);
                } else { // 当 percent的值从0增加到1时 
                    this.setAlpha(0);
                    this.state = FADE_STATE_ENUM.IDLE;
                    this.fadeResolve(1);//此时 Promise状态变为fulfilled
                }
                break;
        }
    }

    fadeIn(duration: number = DEFAULT_DURATION) {
        this.duration = duration;
        this.setAlpha(0);
        this.preTime = game.totalTime;
        this.state = FADE_STATE_ENUM.FADE_IN;
        return new Promise((resolve) => {
            this.fadeResolve = resolve;
        });
    }


    fadeOut(duration: number = DEFAULT_DURATION) {
        this.duration = duration;
        this.setAlpha(1);
        this.preTime = game.totalTime;
        this.state = FADE_STATE_ENUM.FADE_OUT;
        return new Promise((resolve) => {
            this.fadeResolve = resolve;
        });
    }

    mask() {
        this.setAlpha(1);
    }

}