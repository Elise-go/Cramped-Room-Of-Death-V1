

import { animation, AnimationClip, Sprite, SpriteFrame } from "cc";
import ResourceManager from "../Runtime/ResourceManager";
import { sortSpriteFrames } from "../Utils";
import { StateMachine } from "./StateMachine";

export const ANIMATION_SPEED = 1 / 8;

export default class State {

    private animationClip: AnimationClip

    constructor(
        private fsm: StateMachine,
        private path: string,
        private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
        private speed: number = ANIMATION_SPEED,
    ) {
        this.init();
    }

    async init() {

        // 图片资源加载
        const promise = ResourceManager.Instance.loadDir(this.path);
        this.fsm.waitingList.push(promise);
        const spriteFrames = await promise;

        // 制作动画剪辑
        this.animationClip = new AnimationClip();
        //创建轨道对象
        const track = new animation.ObjectTrack(); 
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');
        const frames: Array<[number, SpriteFrame]> = sortSpriteFrames(spriteFrames).map((item: SpriteFrame, index: number) => [this.speed * index, item]);
        track.channel.curve.assignSorted(frames);

        // 最后将轨道添加到动画剪辑以应用
        this.animationClip.addTrack(track);
        this.animationClip.name = this.path;
        this.animationClip.duration = frames.length * this.speed; // 整个动画剪辑的周期
        this.animationClip.wrapMode = this.wrapMode;
    }

    /*
      1.需要知道自己的animationClip
      2.需要播放动画的能力
    */
    run() { //在SubStateMachine.ts中调用
        if(this.fsm.animationComponent?.defaultClip?.name === this.animationClip.name){ // 若无组件或默认剪辑则返回undefined
            return;
        }
        this.fsm.animationComponent.defaultClip = this.animationClip; //相当于player节点的Animation.defaultClip
        this.fsm.animationComponent.play();  //相当于player节点的Animation.play()
    }

}