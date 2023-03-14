
import { Component, director, Label, NodeEventType, ProgressBar, resources, SpriteFrame, _decorator } from "cc";
import { SCREEN_ENUM } from "../../Enums";
import DataManager from "../../Runtime/DataManager";
import FaderManager from "../../Runtime/FaderManager";

const { ccclass, property } = _decorator;

@ccclass('LoadingManager')

export class LoadingManager extends Component {
    @property(ProgressBar)
    bar: ProgressBar | null = null;
    @property(Label)
    label!: Label

    onLoad() {

        resources.preloadDir('texture', (cur, total) => {
            this.bar!.progress = cur / total;
            this.label.string = Math.floor(cur / total * 100) + ' %';
        }, () => {
            director.loadScene(SCREEN_ENUM.Start);
        });

    }
}