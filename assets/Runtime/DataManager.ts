
import { ILevel, ITile } from 'db://assets/Levels';
import Singleton from 'db://assets/Base/Singleton';
import { TileManager } from '../Scripts/Tile/TileManager';
import { PlayerManager } from '../Scripts/Player/PlayerManager';
import { DoorManager } from '../Scripts/Door/DoorManager';
import { EnemyManager } from '../Base/EnemyManager';
import { BurstManager } from '../Scripts/Burst/BurstManager';
import { SpikesManager } from '../Scripts/Spikes/SpikesManager';
import { SmokeManager } from '../Scripts/Smoke/SmokeManager';

export type IRecord = Omit<ILevel, 'mapInfo'>

export default class DataManager extends Singleton {
  static DataManager: any; // 有关当前level的数据

  static get Instance() {
    // 重写 Singleton.ts中 GetInstance方法
    return super.GetInstance<DataManager>();
  }

  mapInfo: Array<Array<ITile>>
  tileInfo: Array<Array<TileManager>>
  mapRowCount: number = 0
  mapColumnCount: number = 0
  levelIndex: number = 1
  player: PlayerManager
  enemies: EnemyManager[]
  door: DoorManager
  bursts: BurstManager[]
  spikes: SpikesManager[]
  smokes: SmokeManager[]
  records: IRecord[]


  reset() {
    this.mapInfo = []
    this.tileInfo = []
    this.mapRowCount = 0
    this.mapColumnCount = 0
    this.player = null
    this.enemies = []
    this.door = null
    this.bursts = []
    this.spikes = []
    this.smokes = []
    this.records = []
  }

}



