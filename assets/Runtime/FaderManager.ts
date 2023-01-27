
import { director, RenderRoot2D } from 'cc';
import Singleton from 'db://assets/Base/Singleton';
import { DEFAUT_DURATION, DrawManager } from '../Scripts/UI/DrawManager';
import { createUINode } from '../Utils';


export default class FaderManager extends Singleton {

  static get Instance(){
    return super.GetInstance<FaderManager>();
  }

  private _fader: DrawManager = null;

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

  fadeIn(duration: number = DEFAUT_DURATION){
    // 此时拿到的 fader，其父节点已经是含有RenderRoot2D组件的了
    return this.fader.fadeIn(duration);
  }

  fadeOut(duration: number = DEFAUT_DURATION){
    // 此时拿到的 fader，其父节点已经是含有RenderRoot2D组件的了
    return this.fader.fadeOut(duration);
  }

  mask(){
    // 此时拿到的 fader，其父节点已经是含有RenderRoot2D组件的了
    return this.fader.mask();
  }
  
}



