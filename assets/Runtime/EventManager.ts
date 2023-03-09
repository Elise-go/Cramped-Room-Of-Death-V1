import { EVENT_ENUM } from "../Enums";

interface IItem {
  func: Function,
  ctx: unknown
}

export default class EventManager {

  private static _instance: EventManager | null = null;
  private constructor() { }

  static get Instance() {
    if (this._instance === null) {
      this._instance = new EventManager();
    }

    return this._instance;
  }

  // 事件对象
  private eventDic: Map<string, Array<IItem>> = new Map();
  //整个关卡切换中都不执行 clear()的事件对象
  private unClearEventDic: Map<string, Array<IItem>> = new Map();


  // 注册事件以及事件对应的方法（注意！为了清楚this的指向，要绑定context）
  on(eventName: string, func: Function, ctx?: unknown) {
    if (this.eventDic.has(eventName)) {
      this.eventDic.get(eventName)?.push({ func, ctx });
    } else {
      this.eventDic.set(eventName, [{ func, ctx }]);
    }
  }

  onUnclear(eventName: string, func: Function, ctx?: unknown) {
    if (this.unClearEventDic.has(eventName)) {
      this.unClearEventDic.get(eventName)?.push({ func, ctx });
    } else {
      this.unClearEventDic.set(eventName, [{ func, ctx }]);
    }
  }

  
  // 解绑事件对应的方法和this指向
  off(eventName: string, func: Function) {

    if (this.eventDic.has(eventName)) { //确定是否有此事件
      // 确定此事件上是否有注册此函数
      const index = this.eventDic.get(eventName)?.findIndex(i => i.func === func);
      if (index && index > -1) {
       this.eventDic.get(eventName)?.splice(index, 1);
      }
    }

  }

  // 事件发生后触发调用的方法
  emit(eventName: string, ...params: unknown[]) {
    if (this.eventDic.has(eventName)) {
      this.eventDic.get(eventName)?.forEach(({ func, ctx }) => {
        ctx ? func.apply(ctx, ...params) : func(...params);
      });
    }

    if (this.unClearEventDic.has(eventName)) {
      this.unClearEventDic.get(eventName)?.forEach(({ func, ctx }) => {
        ctx ? func.apply(ctx, ...params) : func(...params);
      });
    }
    
  }

  
  clear() {
    this.eventDic.clear();
  }

   // 移除所有Map对象中的所有元素
   clearAll() {
    this.eventDic.clear();
    this.unClearEventDic.clear();
  }

}