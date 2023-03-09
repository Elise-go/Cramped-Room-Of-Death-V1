

import { animation, AnimationClip, Sprite, SpriteFrame } from "cc";
import { EVENT_ENUM, SHAKE_DIRECTION_ENUM } from "../Enums";
import EventManager from "../Runtime/EventManager";
import ResourceManager from "../Runtime/ResourceManager";
import { sortSpriteFrames } from "../Utils";
import { StateMachine } from "./StateMachine";

export const ANIMATION_SPEED = 1 / 8;

/*    State类要满足以下条件：
      1.需要知道自己的animationClip
      2.需要播放动画的能力
    */
export default class State {

    private animationClip!: AnimationClip;

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
        const promise = ResourceManager.Instance.LoadDir(this.path);
        // 把这个状态机所声明的所有状态对应的图片资源都推进waitingList数组里
        this.fsm.waitingList.push(promise);
        const spriteFrames = await promise;

        // 制作动画剪辑
        this.animationClip = new AnimationClip();

        //对象轨道的创建
        const track = new animation.ObjectTrack();
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');
        const frames: Array<[number, SpriteFrame]> =
            sortSpriteFrames(spriteFrames).map((item, index) => [this.speed * index, item]);
        track.channel.curve.assignSorted(frames);//为通道的曲线添加关键帧

        // 最后将轨道添加到动画剪辑以应用
        this.animationClip.addTrack(track);
        this.animationClip.name = this.path;// 供动画事件使用，在initAnimationEvent()里被调用
        this.animationClip.wrapMode = this.wrapMode;
        this.animationClip.duration = frames.length * this.speed; // 整个动画剪辑的周期
        
    }

    run() {
        let defaultClip = this.fsm.animationComponent.defaultClip;
        // 若将要播放的动画剪辑就是当前播放的动画剪辑，则不做操作
        if (defaultClip && (defaultClip.name === this.animationClip.name)) {
            return;
        }
        this.fsm.animationComponent.defaultClip = this.animationClip;
        this.fsm.animationComponent.play();
    }


}