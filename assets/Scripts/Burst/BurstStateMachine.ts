
import { _decorator, Animation } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import State from '../../Base/State';
import { StateMachine } from '../../Base/StateMachine';
import { SubState } from '../../Base/SubState';
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../../Enums';


const { ccclass, property } = _decorator;
const BASE_URL = 'texture/burst';

@ccclass('BurstStateMachine')
export class BurstStateMachine extends StateMachine {
    private _currentState!: State
    subStates: Map<string, State> = new Map();

    async init() {
        this.animationComponent = this.node.addComponent(Animation);
        this.initSubStates();
        await Promise.all(this.waitingList);
    }


    initSubStates() {
        this.subStates.set(PARAMS_NAME_ENUM.IDLE, new State(this, `${BASE_URL}/idle`));
        this.subStates.set(PARAMS_NAME_ENUM.ATTACK, new State(this, `${BASE_URL}/attack`));
        this.subStates.set(PARAMS_NAME_ENUM.DEATH, new State(this, `${BASE_URL}/death`));
    }

    run(paramsName: string) {
        this._currentState = this.subStates.get(paramsName)!;
        this._currentState.run();
    }

}




