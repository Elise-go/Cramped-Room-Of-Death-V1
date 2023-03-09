
import { IEntity, ILevel, ITile } from 'db://assets/Levels';
import { TileManager } from '../Scripts/Tile/TileManager';
import { PlayerManager } from '../Scripts/Player/PlayerManager';
import { DoorManager } from '../Scripts/Door/DoorManager';
import { EnemyManager } from '../Base/EnemyManager';
import { BurstManager } from '../Scripts/Burst/BurstManager';
import { SpikesManager } from '../Scripts/Spikes/SpikesManager';
import { SmokeManager } from '../Scripts/Smoke/SmokeManager';

export type IRecord = Omit<ILevel, 'mapInfo'>

export default class DataManager {

  private static _instance: DataManager | null = null;
  private constructor() { }

  static get Instance() {
    if (this._instance === null) {
      this._instance = new DataManager();
    }

    return this._instance;
  }

  // 由 TileMapManager.ts 传入
  tileInfo: Array<Array<TileManager>> = [];
  //由 BattleManager.ts---initLevel()传入
  levelIndex: number = 1;
  mapInfo: Array<Array<ITile>> = [];
  playerInfo: IEntity | undefined = undefined;
  mapRowCount: number = 0;
  mapColumnCount: number = 0;
  // 由 BattleManager.ts---初始化各节点的 Manager后传入
  player: PlayerManager | undefined = undefined;
  enemies: EnemyManager[] = [];
  door: DoorManager | undefined = undefined;;
  bursts: BurstManager[] = [];
  spikes: SpikesManager[] = [];
  smokes: SmokeManager[] = [];
  records: IRecord[] = [];


  reset() {
    this.tileInfo = [];
    this.mapInfo = [];
    this.playerInfo = undefined;
    this.mapRowCount = 0;
    this.mapColumnCount = 0;
    this.player = undefined;
    this.enemies = [];
    this.door = undefined;
    this.bursts = [];
    this.spikes = [];
    this.smokes = [];
    this.records = [];

  }

}



