
import { _decorator, Component, Node, Event } from 'cc';
import { CONTROLLER_ENUM, EVENT_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
const { ccclass, property } = _decorator;

@ccclass('ControllerManager')
export class ControllerManager extends Component {
  handleCtrl(evt: Event, type: string) { // 此处 type参数即接收从编辑器里CustomEventData传入的字符串
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL, [type as CONTROLLER_ENUM]);
  }
}