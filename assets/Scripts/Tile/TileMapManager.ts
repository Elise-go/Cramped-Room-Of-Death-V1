
import { _decorator, Component, Node, Sprite, SpriteFrame, resources, UITransform, Layers } from 'cc';
const { ccclass, property } = _decorator;
import  DataManager from '../../Runtime/DataManager';
import ResourceManager from '../../Runtime/ResourceManager';
import { createUINode, randomByRange } from '../../Utils';
import { TileManager } from './TileManager';

@ccclass('TileMapManager')
export class TileMapManager extends Component {
    async init(){

    const spriteFrames = await ResourceManager.Instance.loadDir("texture/tile/tile");
    const {mapInfo} = DataManager.Instance;
    DataManager.Instance.tileInfo = [];


    for(let i = 0; i < mapInfo.length; i++){
        const column = mapInfo[i];
        DataManager.Instance.tileInfo[i] = [];

        for(let j = 0; j < column.length; j++){
            const item = column[j]; // item为ITile类型
            if(item.src === null || item.type === null){
                continue;
            }

            const tileNode = createUINode();
            tileNode.setParent(this.node);

            //设置符合一定条件的瓦片图片会随机显示不同效果
            let num = item.src;
            if((num === 1 || num === 5|| num === 9) && i%2 === 0 && j%2 === 0){
                num += randomByRange(0,4);
            }
            const imgSrc = `tile (${num})`; //!!!注意命名格式中tile后有一个空格!
            const spriteFrame = spriteFrames.find(e => e.name === imgSrc)||spriteFrames[0];
            const tileManager = tileNode.addComponent(TileManager);
            const type = item.type;
            tileManager.init(type,spriteFrame,i,j);
            
            DataManager.Instance.tileInfo[i][j] = tileManager;

        }
    }

    }

}



