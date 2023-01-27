
import { _decorator } from 'cc';
import { EnemyManager } from '../../Base/EnemyManager';
import { IEntity } from '../../Levels';
import { IronSkeletonStateMachine } from './IronSkeletonStateMachine';

const { ccclass } = _decorator;

@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends EnemyManager {
    // IronSkeleton 与 WoodenSkeleton 的区别：IronSkeleton没有攻击能力
    async init(params:IEntity) {

        this.fsm = this.node.addComponent(IronSkeletonStateMachine);
        await this.fsm.init();
        super.init(params);

    }


}