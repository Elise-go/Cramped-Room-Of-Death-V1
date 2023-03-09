
import { _decorator, Component, Node, Sprite, SpriteFrame, resources, UITransform, Layers } from 'cc';
const { ccclass, property } = _decorator;
import DataManager from '../../Runtime/DataManager';
import ResourceManager from '../../Runtime/ResourceManager';
import { createUINode, randomByRange } from '../../Utils';
import { TileManager } from './TileManager';

@ccclass('TileMapManager')
export class TileMapManager extends Component {
    async init() {

        const spriteFrames = await ResourceManager.Instance.LoadDir("texture/tile/tile");
        const { mapInfo } = DataManager.Instance;

        for (let i = 0; i < mapInfo.length; i++) {
            // 取地图中的一列
            const column = mapInfo[i];
            DataManager.Instance.tileInfo[i] = [];

            for (let j = 0; j < column.length; j++) {
                const item = column[j]; // item为ITile类型

                // 如果瓦片为空，怎不生成节点
                if (item.src === null || item.type === null) {
                    continue;
                }

                // 创建瓦片节点
                const tileNode = createUINode();
                tileNode.setParent(this.node);
                const tileManager = tileNode.addComponent(TileManager);

                //设置效果：瓦片图片按照一定的条件随机显示
                let num = item.src;
                if ((num === 1 || num === 5 || num === 9) && i % 2 === 0 && j % 2 === 0) {
                    num += randomByRange(0, 4);
                }
                const imgSrc = `tile (${num})`; //!!!注意命名格式中 tile后有一个空格!
                const spriteFrame = spriteFrames.find(e => e.name === imgSrc) || spriteFrames[0]; //若找不到图片资源，则拿取第一张

                tileManager.init(item.type, spriteFrame, i, j);
                DataManager.Instance.tileInfo[i][j] = tileManager;
            }
        }

    }

}



