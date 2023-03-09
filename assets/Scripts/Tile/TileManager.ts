
import { _decorator, Component, Node, Sprite, SpriteFrame, resources, UITransform, Layers } from 'cc';
const { ccclass, property } = _decorator;
import Levels from 'db://assets/Levels';
import { TILE_TYPE_ENUM } from '../../Enums';

export const TILE_WIDTH = 46;
export const TILE_HEIGHT = 46;

@ccclass('TileManager')
export class TileManager extends Component {

    type: TILE_TYPE_ENUM | undefined
    moveable = false
    turnable = false

    //相当于 TileMapManager 把所需的资源和数据都准备好了，TileManager负责把它们安置在合适的位置
    init(type: TILE_TYPE_ENUM, spriteFrame: SpriteFrame, i: number, j: number) {

        this.type = type;

        if (
            type === TILE_TYPE_ENUM.WALL_ROW ||
            type === TILE_TYPE_ENUM.WALL_COLUMN ||
            type === TILE_TYPE_ENUM.WALL_LEFT_TOP ||
            type === TILE_TYPE_ENUM.WALL_LEFT_BOTTOM ||
            type === TILE_TYPE_ENUM.WALL_RIGHT_TOP ||
            type === TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM
        ) {
            this.moveable = false;
            this.turnable = false;

        } else if (
            type === TILE_TYPE_ENUM.CLIFF_LEFT ||
            type === TILE_TYPE_ENUM.CLIFF_CENTER ||
            type === TILE_TYPE_ENUM.CLIFF_RIGHT
        ) {
            this.moveable = false;
            this.turnable = true;

        } else if (type === TILE_TYPE_ENUM.FLOOR) {
            this.moveable = true;
            this.turnable = true;
        }

        //Sprite组件的相关设置
        const sprite = this.node.addComponent(Sprite);
        sprite.spriteFrame = spriteFrame;

        //设置瓦片尺寸
        const transform = this.node.getComponent(UITransform);
        transform?.setContentSize(TILE_WIDTH, TILE_HEIGHT);
        
        //设置瓦片在tileMap中的位置
        this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT);

    }

}
