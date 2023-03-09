
import { Component, director, NodeEventType, _decorator } from "cc";
import { SCREEN_ENUM } from "../../Enums";
import DataManager from "../../Runtime/DataManager";
import FaderManager from "../../Runtime/FaderManager";

const { ccclass, property } = _decorator;

@ccclass('StartManager')
export class StartManager extends Component {
    onLoad() {
        FaderManager.Instance.fadeOut(1000);
        this.node.once(NodeEventType.TOUCH_END, this.handleStart, this);
    }

    async handleStart() {
        await FaderManager.Instance.fadeIn(200);
        DataManager.Instance.levelIndex = 1;
        director.loadScene(SCREEN_ENUM.Battle);

    }
}