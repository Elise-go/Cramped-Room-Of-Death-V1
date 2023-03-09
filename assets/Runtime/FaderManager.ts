
import { director, RenderRoot2D } from 'cc';
import { DEFAULT_DURATION, DrawManager } from '../Scripts/UI/DrawManager';
import { createUINode } from '../Utils';
import ResourceManager from './ResourceManager';


export default class FaderManager {

  private static _instance: FaderManager | null = null;

  private constructor() {}

  static get Instance(){
    if (this._instance === null) {
      this._instance = new FaderManager();
    }

    return this._instance;
  }

  private _fader: DrawManager | null = null;

  get fader(){
    if(this._fader !== null){
      return this._fader;
    }

    const renderRoot = createUINode();
    renderRoot.addComponent(RenderRoot2D);

    const fadeNode = createUINode();
    fadeNode.setParent(renderRoot);
    this._fader = fadeNode.addComponent(DrawManager);
    this._fader.init();

    director.addPersistRootNode(renderRoot);

    return this._fader;

  }

  fadeIn(duration: number = DEFAULT_DURATION){
    // 此时拿到的 fader，其父节点已经是含有RenderRoot2D组件的了
    return this.fader.fadeIn(duration);
  }

  fadeOut(duration: number = DEFAULT_DURATION){
    // 此时拿到的 fader，其父节点已经是含有RenderRoot2D组件的了
    return this.fader.fadeOut(duration);
  }

  mask(){
    // 此时拿到的 fader，其父节点已经是含有RenderRoot2D组件的了
    return this.fader.mask();
  }
  
}


