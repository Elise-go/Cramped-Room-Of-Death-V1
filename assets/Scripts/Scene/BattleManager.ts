
import { _decorator, Component, Node, director, UITransform, resources } from 'cc';
import { TileMapManager } from 'db://assets/Scripts/Tile/TileMapManager';
import { createUINode } from 'db://assets/Utils';
import DataManager, { IRecord } from 'db://assets/Runtime/DataManager';
import { TileManager, TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import EventManager from '../../Runtime/EventManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, SCREEN_ENUM, SPRIKES_TYPE_MAP_TOTAL_CLIPS_ENUM } from '../../Enums';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
import { DoorManager } from '../Door/DoorManager';
import { IronSkeletonManager } from '../IronSkeleton.ts/IronSkeletonManager';
import { BurstManager } from '../Burst/BurstManager';
import { SpikesManager } from '../Spikes/SpikesManager';
import { EnemyManager } from '../../Base/EnemyManager';
import levels, { ILevel } from '../../Levels';
import { SmokeManager } from '../Smoke/SmokeManager';
import FaderManager from '../../Runtime/FaderManager';
import { ShakeManager } from '../UI/ShakeManager';
import ResourceManager from '../../Runtime/ResourceManager';

const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {

    level!: ILevel
    stage: Node = createUINode();
    private smokeLayer: Node | null = null;
    private inited = false;

    onLoad() {
        // 绑定事件
        EventManager.Instance.onUnclear(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
        EventManager.Instance.onUnclear(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this);
        EventManager.Instance.onUnclear(EVENT_ENUM.RECORD_STEP, this.record, this);
        EventManager.Instance.onUnclear(EVENT_ENUM.REVOKE_STEP, this.revoke, this);
        EventManager.Instance.onUnclear(EVENT_ENUM.RESTART_LEVEL, this.initLevel, this);
        EventManager.Instance.onUnclear(EVENT_ENUM.OUT_BATTLE, this.outBattle, this);

    }

    onDestroy() {
        EventManager.Instance.clearAll();
    }


    start() {
        this.generateStage();
        this.initLevel();
    }

    generateStage() {
        this.stage = createUINode();
        this.stage.setParent(this.node);
        this.stage.addComponent(ShakeManager);
    }

    async initLevel() {

        const newLevel = levels[`level${DataManager.Instance.levelIndex}`];
        if (newLevel) {

            // 效果：黑幕渐渐显现
            if (this.inited) {
                await FaderManager.Instance.fadeIn();
            } else {
                FaderManager.Instance.mask();
                this.inited = true;
            }

            // RESTART_LEVEL事件让当前关卡重新加载
            this.clearLevel();

            this.level = newLevel;
            DataManager.Instance.playerInfo = this.level.player;
            DataManager.Instance.mapInfo = this.level.mapInfo;
            DataManager.Instance.mapColumnCount = this.level.mapInfo.length || 0;
            DataManager.Instance.mapRowCount = this.level.mapInfo[0].length || 0;

            // 注意：这里的渲染顺序决定了UI节点的遮挡关系
            await this.generateTileMap();
            if (this.level.bursts) {
                await this.generateBursts();
            }
            if (this.level.spikes) {
                await this.generateSpikes();
            }
            await this.generateSmokeLayer();
            await this.generateDoor();
            await this.generateEnemies();
            await this.generatePlayer();

            this.stageAdaptPos();
            EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this);

            // 效果：等所有资源都加载完后，黑幕渐渐消失
            await FaderManager.Instance.fadeOut();

        } else {
            // 为保险起见，若拿不到场景就回到start界面
            this.outBattle();
        }

    }

    nextLevel() {
        DataManager.Instance.levelIndex++;
        this.initLevel();
    }

    clearLevel() {
        this.stage.destroyAllChildren();
        //切换关卡时要移除eventDic里的所有元素,否则切换到下一关时this指向会混乱和报错
        EventManager.Instance.clear();
        DataManager.Instance.reset();
    }

    stageAdaptPos() {
        const { mapRowCount, mapColumnCount } = DataManager.Instance;
        const disX = (TILE_WIDTH * mapColumnCount) / 2;
        const disY = (TILE_HEIGHT * mapRowCount) / 2 + 80;
        this.stage.setPosition(-disX, disY);
    }


    async outBattle() {
        await FaderManager.Instance.fadeIn();
        director.loadScene(SCREEN_ENUM.Start);
    }

    // 检查 player是否到达出口
    checkArrived() {
        const { x: playerX, y: playerY } = DataManager.Instance.player!;
        const { x: doorX, y: doorY, state: doorState } = DataManager.Instance.door!;
        if (doorState === ENTITY_STATE_ENUM.DEATH && playerX === doorX && playerY === doorY) {
            EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL);

        }
    }

    // 生成瓦片地图
    async generateTileMap() {

        const tileMap = createUINode();
        tileMap.setParent(this.stage);
        const tileMapManager = tileMap.addComponent(TileMapManager);
        await tileMapManager.init();
    }


    // 生成地裂
    async generateBursts() {

        const promise = []

        for (let i = 0; i < this.level.bursts.length; i++) {
            const burst = this.level.bursts[i];

            const burstNode = createUINode();
            burstNode.setParent(this.stage);
            const burstmanager = burstNode.addComponent(BurstManager);
            promise.push(burstmanager.init(burst));
            DataManager.Instance.bursts.push(burstmanager);
        }
        //以这种期约数组的形式await，让资源加载更快
        await Promise.all(promise);
    }

    // 生成尖刺
    async generateSpikes() {

        const promise = []

        for (let i = 0; i < this.level.spikes.length; i++) {
            const spike = this.level.spikes[i];

            const spikeNode = createUINode();
            spikeNode.setParent(this.stage);
            const spikesmanager = spikeNode.addComponent(SpikesManager);
            promise.push(spikesmanager.init(spike));
            DataManager.Instance.spikes.push(spikesmanager);
        }
        //以这种期约数组的形式await，让资源加载更快
        await Promise.all(promise);

    }


    // 为了保证 player能盖住烟雾，弄一个烟雾层
    async generateSmokeLayer() {
        this.smokeLayer = createUINode();
        this.smokeLayer.setParent(this.stage);
    }

    // 根据 player的位置来决定烟雾生成的位置
    async generateSmoke(x: number, y: number, direction: DIRECTION_ENUM) {
        const item = DataManager.Instance.smokes.find(smoke => smoke.state === ENTITY_STATE_ENUM.DEATH);
        if (item) {
            item.x = x;
            item.y = y;
            item.direction = direction;
            item.state = ENTITY_STATE_ENUM.IDLE;
            item.node.setPosition(x * TILE_WIDTH - 1.5 * TILE_WIDTH, - y * TILE_HEIGHT + 1.5 * TILE_HEIGHT);
        } else {
            const smoke = createUINode();
            smoke.setParent(this.smokeLayer);
            const smokeManager = smoke.addComponent(SmokeManager);
            await smokeManager.init({
                x: x,
                y: y,
                direction: direction,
                state: ENTITY_STATE_ENUM.IDLE,
                type: ENTITY_TYPE_ENUM.SMOKE,
            });
            DataManager.Instance.smokes.push(smokeManager);
        }

    }


    // 生成门
    async generateDoor() {
        const door = createUINode();
        door.setParent(this.stage);
        const doorManager = door.addComponent(DoorManager);
        await doorManager.init(this.level.door);
        DataManager.Instance.door = doorManager;
    }


    // 生成敌人
    async generateEnemies() {

        const promise = [];

        for (let i = 0; i < this.level.enemies.length; i++) {
            const enemy = this.level.enemies[i];
            const enemyNode = createUINode();
            enemyNode.setParent(this.stage);
            const Manager = (enemy.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN ? WoodenSkeletonManager : IronSkeletonManager);
            const enemyManager = enemyNode.addComponent(Manager);
            promise.push(enemyManager.init(enemy));
            DataManager.Instance.enemies.push(enemyManager);
        }

        //以这种期约数组的形式await，让资源加载更快
        await Promise.all(promise);

    }


    // 生成玩家
    async generatePlayer() {
        const player = createUINode();
        player.setParent(this.stage);
        const playerManager = player.addComponent(PlayerManager);
        await playerManager.init(this.level.player);
        DataManager.Instance.player = playerManager;
    }


    // 数据记录
    record() {
        const item: IRecord = {
            player: {
                x: DataManager.Instance.player!.x,
                y: DataManager.Instance.player!.y,
                type: DataManager.Instance.player!.type,
                direction: DataManager.Instance.player!.direction,
                state: // 除了 DEATH 和 AIRDEATH状态，其他状态结束后都是回到IDLE状态的
                    DataManager.Instance.player!.state === ENTITY_STATE_ENUM.DEATH
                        || DataManager.Instance.player!.state === ENTITY_STATE_ENUM.AIRDEATH ?
                        DataManager.Instance.player!.state : ENTITY_STATE_ENUM.IDLE
            },
            door: {
                x: DataManager.Instance.door!.x,
                y: DataManager.Instance.door!.y,
                type: DataManager.Instance.door!.type,
                direction: DataManager.Instance.door!.direction,
                state: DataManager.Instance.door!.state
            },
            enemies: DataManager.Instance.enemies.map(({ x, y, type, direction, state }) => ({
                x,
                y,
                type,
                direction,
                state
            })),
            bursts: DataManager.Instance.bursts.map(({ x, y, type, direction, state }) => ({
                x,
                y,
                type,
                direction,
                state
            })),
            spikes: DataManager.Instance.spikes.map(({ x, y, type, clip }) => ({
                x,
                y,
                type,
                clip
            })),

        }

        DataManager.Instance.records.push(item);
    }

    // 数据撤回功能
    revoke() {
        const item = DataManager.Instance.records.pop();
        if (item) {
            // 玩家数据
            DataManager.Instance.player!.x = DataManager.Instance.player!.targetX = item.player.x;
            DataManager.Instance.player!.y = DataManager.Instance.player!.targetY = item.player.y;
            DataManager.Instance.player!.direction = item.player.direction;
            if (DataManager.Instance.player!.state !== ENTITY_STATE_ENUM.IDLE) {
                DataManager.Instance.player!.state = item.player.state;
            }


            // 门数据
            DataManager.Instance.door!.state = item.door.state;


            // 敌人数据
            for (let i = 0; i < item.enemies.length; i++) {
                const enemy = DataManager.Instance.enemies[i];
                enemy.x = item.enemies[i].x;
                enemy.y = item.enemies[i].y;
                enemy.type = item.enemies[i].type;
                enemy.direction = item.enemies[i].direction;
                enemy.state = item.enemies[i].state;
            }

            // 地裂数据
            for (let i = 0; i < item.bursts.length; i++) {
                const burst = DataManager.Instance.bursts[i];
                burst.x = item.bursts[i].x;
                burst.y = item.bursts[i].y;
                burst.direction = item.bursts[i].direction;
                burst.state = item.bursts[i].state;
            }

            // 尖刺数据
            for (let i = 0; i < item.spikes.length; i++) {
                const spike = DataManager.Instance.spikes[i];
                spike.x = item.spikes[i].x;
                spike.y = item.spikes[i].y;
                spike.type = item.spikes[i].type;
                spike.clip = item.spikes[i].clip;
            }

        }


    }



}

