# Cramped-Room-Of-Death-V2
本游戏使用CocosCreator V3.6.2 制作，参考自SLI97用户复刻的Steam同名游戏《Cramped Room Of Death》，并在此基础上作了些修改  
[参考来源](https://github.com/SLI97/cocos-cramped-room-of-death)  

# 在线试玩
[手机端](https://elise-go.github.io/CrampedRoomOfDeath/)

# 优化&修改
1. 以提高代码复用率和可维护性为出发点编码，尽量用程序化代替可视化编辑  
2. 运用状态模式，实现各角色状态切换后对应的动画播放  
3. 运用单例模式和观察者模式，通过事件中心统一管理事件的绑定、触发、解绑  
4. 为了逐渐增加通关难度，提高通关趣味性，修改了一些角色的布局
