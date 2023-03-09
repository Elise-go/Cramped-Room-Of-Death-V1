
import { Node, UITransform, Layers, SpriteFrame } from 'cc';

export const createUINode = (name: string = '') => {
    const node = new Node(name);
    const transform = node.addComponent(UITransform);
    //调整节点的锚点为左上角
    transform.setAnchorPoint(0, 1);
    //设置节点的layer属性
    node.layer = 1 << Layers.nameToLayer('UI_2D');
    return node;
    //...各个节点自行决定setParent
}


export const randomByRange = (start: number, end: number) => {
    return Math.floor(start + (end - start) * Math.random());
};


export const randomByLen = (len: number) => Array.from({ length: len }).reduce<string>((total, item) => total + Math.floor(Math.random() * 10), '');


const reg = /\((\d+)\)/;
const getNumberWithinString = (str: string) => parseInt(str.match(reg)![1] || '0');


export const sortSpriteFrames = (spriteFrames: SpriteFrame[]) =>
    // 命名中的数字从小到大排序
    spriteFrames.sort((a: SpriteFrame, b: SpriteFrame) => getNumberWithinString(a.name) - getNumberWithinString(b.name));


/*
 
*/