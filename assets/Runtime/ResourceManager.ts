
import { resources, SpriteFrame } from 'cc';

export default class ResourceManager {

  private static _instance: ResourceManager| null = null

  private constructor() {}

  static get Instance(){
    if (this._instance === null) {
      this._instance = new ResourceManager();
    }

    return this._instance;
  }

  LoadDir(path: string, type = SpriteFrame){

    return new Promise<SpriteFrame[]>((resolve,reject)=>{
      // 相同路径下的资源批量加载 resources.loadDir()
       resources.loadDir(path, type, function (err, assets) {

          if(err){
            reject(err);
            return;
           }

           resolve(assets);

        });

    });

}


}

