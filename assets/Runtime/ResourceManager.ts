
import Singleton from 'db://assets/Base/Singleton';
import { resources, SpriteFrame } from 'cc';

export default class ResourceManager extends Singleton {

  static get Instance(){
    // 重写 Singleton.ts中 GetInstance方法
    return super.GetInstance<ResourceManager>();
  }

  loadDir(path: string, type: typeof SpriteFrame = SpriteFrame){
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
