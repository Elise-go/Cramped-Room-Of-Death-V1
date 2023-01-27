
import Singleton from 'db://assets/Base/Singleton';

interface IItem {
  func: Function
  ctx: unknown
}

export default class EventManager extends Singleton {

  static get Instance() {
    // 重写 Singleton.ts中 GetInstance方法
    return super.GetInstance<EventManager>();
  }

  // 事件字典
  private eventDic: Map<string, Array<IItem>> = new Map();

  // 绑定函数
  on(eventName: string, func: Function, ctx: unknown) {
    if (this.eventDic.has(eventName)) {
      this.eventDic.get(eventName).push({ func, ctx });
    } else {
      this.eventDic.set(eventName, [{ func, ctx }]);
    }
  }

  // 解绑函数
  off(eventName: string, func: Function) {
    if (this.eventDic.has(eventName)) {
      const index = this.eventDic.get(eventName).findIndex(i => i.func === func);
      if (index > -1) {
        this.eventDic.get(eventName).splice(index, 1);
      }
    }
  }

  // 触发函数
  emit(eventName: string, ...params: unknown[]) {
    if (this.eventDic.has(eventName)) {
      this.eventDic.get(eventName).forEach(({ func, ctx }) => {
        ctx ? func.apply(ctx, params) : func(...params);
      });
    }
  }

  // 移除 Map对象中的所有元素，包括this的指向
  clear() {
    this.eventDic.clear();
  }

}