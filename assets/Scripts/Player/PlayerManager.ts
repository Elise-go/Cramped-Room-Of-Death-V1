
import { _decorator } from 'cc';
import { EnemyManager } from '../../Base/EnemyManager';
import { EntityManager } from '../../Base/EntityManager';
import { EVENT_ENUM, CONTROLLER_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, SHAKE_DIRECTION_ENUM } from '../../Enums';
import { IEntity } from '../../Levels';
import DataManager from '../../Runtime/DataManager';
import EventManager from '../../Runtime/EventManager';
import { BurstManager } from '../Burst/BurstManager';
import { PlayerStateMachine } from './PlayerStateMachine';
const { ccclass } = _decorator;


@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
    
    targetX: number = 0
    targetY: number = 0
    isMoving: boolean = false 
    private readonly speed = 1 / 10

    async init(params:IEntity) {

        this.fsm = this.node.addComponent(PlayerStateMachine);
        await this.fsm.init();
        super.init(params);

        this.targetX = this.x;
        this.targetY = this.y;


        // 给控制组件controller绑定事件
        EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this);
        EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER, this.onDie, this);

    }

    onDestory(){
        super.onDestroy();
        EventManager.Instance.off(EVENT_ENUM.PLAYER_CTRL, this.inputHandle);
        EventManager.Instance.off(EVENT_ENUM.ATTACK_PLAYER, this.onDie);
    }

    update() {
        this.updateXY();
        super.update();
    }

    updateXY() {
        if (this.x < this.targetX) {
            this.x += this.speed;
        } else if (this.x > this.targetX) {
            this.x -= this.speed;
        }

        if (this.y < this.targetY) {
            this.y += this.speed;
        } else if (this.y > this.targetY) {
            this.y -= this.speed;
        }

        // 防止动作鬼畜
        if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1 && this.isMoving) {
            // 每次 player 执行一次移动后，此函数只会执行一次
            this.isMoving = false;
            this.x = this.targetX;
            this.y = this.targetY;
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END);
        }
    }

    onDie(type:ENTITY_STATE_ENUM){
        this.state = type;
    }

    onAttackShake(type:SHAKE_DIRECTION_ENUM){
        EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, type);
    }

    inputHandle(inputDirection: CONTROLLER_ENUM){
        
        if(this.isMoving){
            return;
        }

        if(this.state === ENTITY_STATE_ENUM.DEATH || 
           this.state === ENTITY_STATE_ENUM.AIRDEATH ||
           this.state === ENTITY_STATE_ENUM.ATTACK){
            return;
        }

        const id = this.willAttack(inputDirection);
        if(id){
            EventManager.Instance.emit(EVENT_ENUM.RECORD_STEP);
            EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY,id);
            EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN);
            return;
        }

        if( this.willBlock(inputDirection)){

            // 判断stage震动的方向
            if(inputDirection === CONTROLLER_ENUM.TOP){
                EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_DIRECTION_ENUM.TOP);
            }else if(inputDirection === CONTROLLER_ENUM.BOTTOM){
                EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_DIRECTION_ENUM.BOTTOM);
            }else if(inputDirection === CONTROLLER_ENUM.LEFT){
                EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_DIRECTION_ENUM.LEFT);
            }else if(inputDirection === CONTROLLER_ENUM.RIGHT){
                EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_DIRECTION_ENUM.RIGHT);

            }else if(inputDirection === CONTROLLER_ENUM.TURNLEFT){
                if(this.direction === DIRECTION_ENUM.TOP){
                    EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_DIRECTION_ENUM.LEFT);
                }else if(this.direction === DIRECTION_ENUM.LEFT){
                    EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_DIRECTION_ENUM.BOTTOM);
                }else if(this.direction === DIRECTION_ENUM.BOTTOM){
                    EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_DIRECTION_ENUM.RIGHT);
                }else if(this.direction === DIRECTION_ENUM.RIGHT){
                    EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_DIRECTION_ENUM.TOP);
                }

            }else if(inputDirection === CONTROLLER_ENUM.TURNRIGHT){
                if(this.direction === DIRECTION_ENUM.TOP){
                    EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_DIRECTION_ENUM.RIGHT);
                }else if(this.direction === DIRECTION_ENUM.RIGHT){
                    EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_DIRECTION_ENUM.BOTTOM);
                }else if(this.direction === DIRECTION_ENUM.BOTTOM){
                    EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_DIRECTION_ENUM.LEFT);
                }else if(this.direction === DIRECTION_ENUM.LEFT){
                    EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_DIRECTION_ENUM.TOP);
                }
            }
            
            return;

        }

        // 以上情况都不满足时，才执行move()
        this.move(inputDirection);
    }

    move(inputDirection: CONTROLLER_ENUM) {

        EventManager.Instance.emit(EVENT_ENUM.RECORD_STEP);

        if (inputDirection === CONTROLLER_ENUM.TOP) {
            this.targetY -= 1;
            this.isMoving = true;
            this.showSmoke(DIRECTION_ENUM.TOP);
        } else if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
            this.targetY += 1;
            this.isMoving = true;
            this.showSmoke(DIRECTION_ENUM.BOTTOM);
        } else if (inputDirection === CONTROLLER_ENUM.LEFT) {
            this.targetX -= 1;
            this.isMoving = true;
            this.showSmoke(DIRECTION_ENUM.LEFT);
        } else if (inputDirection === CONTROLLER_ENUM.RIGHT) {
            this.targetX += 1;
            this.isMoving = true;
            this.showSmoke(DIRECTION_ENUM.RIGHT);
        } else if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
            if(this.direction === DIRECTION_ENUM.TOP){
                this.direction = DIRECTION_ENUM.LEFT;
            }else if(this.direction === DIRECTION_ENUM.BOTTOM){
                this.direction = DIRECTION_ENUM.RIGHT;
            }else if(this.direction === DIRECTION_ENUM.LEFT){
                this.direction = DIRECTION_ENUM.BOTTOM;
            }else if(this.direction === DIRECTION_ENUM.RIGHT){
                this.direction = DIRECTION_ENUM.TOP;
            }
            this.state = ENTITY_STATE_ENUM.TURNLEFT;
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END); //为了触发 Burst的attack状态 
            
        }else if  (inputDirection === CONTROLLER_ENUM.TURNRIGHT) {
            if(this.direction === DIRECTION_ENUM.TOP){
                this.direction = DIRECTION_ENUM.RIGHT;
            }else if(this.direction === DIRECTION_ENUM.BOTTOM){
                this.direction = DIRECTION_ENUM.LEFT;
            }else if(this.direction === DIRECTION_ENUM.LEFT){
                this.direction = DIRECTION_ENUM.TOP;
            }else if(this.direction === DIRECTION_ENUM.RIGHT){
                this.direction = DIRECTION_ENUM.BOTTOM;
            }
            this.state = ENTITY_STATE_ENUM.TURNRIGHT;
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END);//为了触发 Burst的attack状态
        
        }
    }

    showSmoke(type: DIRECTION_ENUM){
        EventManager.Instance.emit(EVENT_ENUM.SHOW_SMOKE, this.x, this.y, type);
    }

    
    willAttack(inputDirection: CONTROLLER_ENUM){

       const enemies = DataManager.Instance.enemies.filter(enemy => enemy.state !== ENTITY_STATE_ENUM.DEATH);
       for (let i = 0; i < enemies.length; i++) {
        const { x:enemyX, y:enemyY, id:enemyID} = enemies[i];

        if(inputDirection === CONTROLLER_ENUM.TOP && this.direction === DIRECTION_ENUM.TOP &&
          enemyX === this.targetX && enemyY === this.targetY - 2 ){
            this.state = ENTITY_STATE_ENUM.ATTACK;
            return enemyID;
          }else if(inputDirection === CONTROLLER_ENUM.BOTTOM && this.direction === DIRECTION_ENUM.BOTTOM &&
            enemyX === this.targetX && enemyY === this.targetY + 2 ){
             this.state = ENTITY_STATE_ENUM.ATTACK;
             return enemyID;
          }else if(inputDirection === CONTROLLER_ENUM.LEFT && this.direction === DIRECTION_ENUM.LEFT &&
                   enemyX === this.targetX - 2 && enemyY === this.targetY ){
                    this.state = ENTITY_STATE_ENUM.ATTACK;
                    return enemyID;
          }else if(inputDirection === CONTROLLER_ENUM.RIGHT && this.direction === DIRECTION_ENUM.RIGHT &&
                   enemyX === this.targetX + 2 && enemyY === this.targetY ){
                    this.state = ENTITY_STATE_ENUM.ATTACK;
                    return enemyID;
          }
        
       }

       return '';
    }



    willBlock(inputDirection: CONTROLLER_ENUM){
        const {targetX:x, targetY:y, direction} = this;
        const {tileInfo, mapRowCount:row, mapColumnCount:column} = DataManager.Instance;
        const {x:doorX, y:doorY, state:doorState} = DataManager.Instance.door;
        // !!注意: 每执行一次 willBlock(),都会重新获取一次 enemies 和 bursts
        const enemies: EnemyManager[] = DataManager.Instance.enemies.filter(
            enemy => enemy.state !== ENTITY_STATE_ENUM.DEATH);
        const bursts: BurstManager[] = DataManager.Instance.bursts.filter(burst => burst.state !== ENTITY_STATE_ENUM.DEATH);

        // 包含逻辑：若瓦片可走，则肯定可转 ； 若瓦片不可转，则肯定不可走


        // ********************按钮方向向上********************
        if(inputDirection === CONTROLLER_ENUM.TOP){
            const playerNextY = y - 1;
            const weaponNextY_1 = y - 1;
            const weaponNextY_2 = y - 2;


            // 判断player是否越过上边界
            if(playerNextY < 0){  
                this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
                return true;
            }

            // 判断是否遇到 door
            if(doorState !== ENTITY_STATE_ENUM.DEATH){
                if( direction === DIRECTION_ENUM.TOP && (doorX === x && doorY === playerNextY - 1) ){
                    this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
                    return true;
                }

                if( direction !== DIRECTION_ENUM.TOP && (doorX === x && doorY === playerNextY) ){
                    this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
                    return true;
                }
            }


            // 判断是否遇到未死的 IronSkeleton
            for (let i = 0; i < enemies.length; i++) {
                const { x:enemyX, y:enemyY } = enemies[i];

                if( direction !== DIRECTION_ENUM.TOP && (enemyX === x && enemyY === playerNextY) ){
                    this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
                    return true;
                }
                
            }


            // 判断是否遇到未消失的 Burst
            for (let i = 0; i < bursts.length; i++) {
                const { x:burstX, y:burstY } = bursts[i];

                if(burstX === x && burstY === playerNextY){

                    if(direction === DIRECTION_ENUM.TOP){
                        const weaponTile = tileInfo[x]?.[weaponNextY_2];
                        if (!weaponTile || weaponTile.turnable){
                               return false;
                        }

                    }else if(direction === DIRECTION_ENUM.BOTTOM){
                        return false;
                            
                    }else if(direction === DIRECTION_ENUM.LEFT){
                        const weaponTile = tileInfo[x - 1]?.[weaponNextY_1];
                        if (!weaponTile || weaponTile.turnable){
                            return false;
                        }

                    }else if(direction === DIRECTION_ENUM.RIGHT){
                        const weaponTile = tileInfo[x + 1]?.[weaponNextY_1];
                        if (!weaponTile || weaponTile.turnable){
                            return false;
                        }
                    }
                }        
                
            }
            

            // 判断地图瓦片元素
            const playerTile = tileInfo[x]?.[playerNextY];

            if(direction === DIRECTION_ENUM.TOP){
                const weaponTile = tileInfo[x]?.[weaponNextY_2];
                if( playerTile && playerTile.moveable &&
                    (!weaponTile || weaponTile.turnable)){
                    //空函数
                }else{
                    this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
                    return true;
                }

            }else if(direction === DIRECTION_ENUM.BOTTOM){
                if( playerTile && playerTile.moveable ){
                    //空函数
                }else{
                    this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
                    return true;
                }

            }else if(direction === DIRECTION_ENUM.LEFT){
                const weaponTile = tileInfo[x - 1]?.[weaponNextY_1];
                if( playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable )){
                    //空函数
                }else{
                    this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
                    return true;
                }

            }else if(direction === DIRECTION_ENUM.RIGHT){
                const weaponTile = tileInfo[x + 1]?.[weaponNextY_1];
                if( playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable )){
                    //空函数
                }else{
                    this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
                    return true;
                }
            }
                
            return false;
        }


         // ********************按钮方向向下********************
        if(inputDirection === CONTROLLER_ENUM.BOTTOM){
            const playerNextY = y + 1;
            const weaponNextY_1 = y + 1;
            const weaponNextY_2 = y + 2;


            // 判断player是否越过下边界
            if(playerNextY > column - 1 ){
                this.state = ENTITY_STATE_ENUM.BLOCKBACK;
                return true; 
            }


            // 判断是否遇到 door
            if(doorState !== ENTITY_STATE_ENUM.DEATH){
                if( direction === DIRECTION_ENUM.BOTTOM && (doorX === x && doorY === playerNextY + 1) ){
                    this.state = ENTITY_STATE_ENUM.BLOCKBACK;
                    return true;
                }

                if( direction !== DIRECTION_ENUM.BOTTOM && (doorX === x && doorY === playerNextY) ){
                    this.state = ENTITY_STATE_ENUM.BLOCKBACK;
                    return true;
                }
            }


            // 判断是否遇到未死的 IronSkeleton
            for (let i = 0; i < enemies.length; i++) {
                const { x:enemyX, y:enemyY } = enemies[i];

                if( direction !== DIRECTION_ENUM.BOTTOM && (enemyX === x && enemyY === playerNextY) ){
                    this.state = ENTITY_STATE_ENUM.BLOCKBACK;
                    return true;
                }
                
            }
            

            // 判断是否遇到未消失的 Burst
            for (let i = 0; i < bursts.length; i++) {
                const { x:burstX, y:burstY } = bursts[i];

                if(burstX === x && burstY === playerNextY){

                    if(direction === DIRECTION_ENUM.TOP){
                        return false;

                    }else if(direction === DIRECTION_ENUM.BOTTOM){
                        const weaponTile = tileInfo[x]?.[weaponNextY_2];
                        if (!weaponTile || weaponTile.turnable){
                               return false;
                        }
                            
                    }else if(direction === DIRECTION_ENUM.LEFT){
                        const weaponTile = tileInfo[x - 1]?.[weaponNextY_1];
                        if (!weaponTile || weaponTile.turnable){
                            return false;
                        }

                    }else if(direction === DIRECTION_ENUM.RIGHT){
                        const weaponTile = tileInfo[x + 1]?.[weaponNextY_1];
                        if (!weaponTile || weaponTile.turnable){
                            return false;
                        }
                    }
                }        
                
            }


            // 判断地图瓦片元素
            const playerTile = tileInfo[x]?.[playerNextY];

            if(direction === DIRECTION_ENUM.TOP){
                if( playerTile && playerTile.moveable ){
                    //空函数
                }else{  
                    this.state = ENTITY_STATE_ENUM.BLOCKBACK;
                    return true; 
                }

            }else if(direction === DIRECTION_ENUM.BOTTOM){
                const weaponTile = tileInfo[x]?.[weaponNextY_2];
                if( playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable )){
                    //空函数
                }else{  
                    this.state = ENTITY_STATE_ENUM.BLOCKBACK;
                    return true; 
                }

            }else if(direction === DIRECTION_ENUM.LEFT){
                const weaponTile = tileInfo[x - 1]?.[weaponNextY_1];
                if( playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable )){
                    //空函数
                }else{  
                    this.state = ENTITY_STATE_ENUM.BLOCKBACK;
                    return true; 
                }

            }else if(direction === DIRECTION_ENUM.RIGHT){
                const weaponTile = tileInfo[x + 1]?.[weaponNextY_1];
                if( playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable )){
                    //空函数
                }else{  
                    this.state = ENTITY_STATE_ENUM.BLOCKBACK;
                    return true; 
                }
            }
                
            return false;

        }


         // ********************按钮方向向左********************
        if(inputDirection === CONTROLLER_ENUM.LEFT){
            const playerNextX = x - 1;
            const weaponNextX_1 = x - 1;
            const weaponNextX_2 = x - 2;
    

            // 判断 player是否越过左边界
            if(playerNextX < 0){ 
                this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
                return true;
        
            }


            // 判断是否遇到 door
            if(doorState !== ENTITY_STATE_ENUM.DEATH){

                if( direction === DIRECTION_ENUM.LEFT && (doorY === y && doorX === playerNextX - 1) ){
                    this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
                    return true;
                }

                if( direction !== DIRECTION_ENUM.LEFT && (doorY === y && doorX === playerNextX) ){
                    this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
                    return true;
                }
            }


            // 判断是否遇到未死的 IronSkeleton
            for (let i = 0; i < enemies.length; i++) {
                const { x:enemyX, y:enemyY } = enemies[i];

                if( direction !== DIRECTION_ENUM.LEFT && (enemyY === y && enemyX === playerNextX) ){
                    this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
                    return true;
                }
                
            }
            

            // 判断是否遇到未消失的 Burst
            for (let i = 0; i < bursts.length; i++) {
                const { x:burstX, y:burstY } = bursts[i];

                if(burstY === y && burstX === playerNextX){

                    if(direction === DIRECTION_ENUM.TOP){
                        const weaponTile = tileInfo[weaponNextX_1]?.[y - 1];
                        if (!weaponTile || weaponTile.turnable){
                            return false;
                     }
                        

                    }else if(direction === DIRECTION_ENUM.BOTTOM){
                        const weaponTile = tileInfo[weaponNextX_1]?.[y + 1];
                        if (!weaponTile || weaponTile.turnable){
                               return false;
                        }
                            
                    }else if(direction === DIRECTION_ENUM.LEFT){
                        const weaponTile = tileInfo[weaponNextX_2]?.[y];
                        if (!weaponTile || weaponTile.turnable){
                            return false;
                        }

                    }else if(direction === DIRECTION_ENUM.RIGHT){
                        return false;
                    }
                }        
                
            }
            

            // 判断地图瓦片元素
            const playerTile = tileInfo[playerNextX]?.[y];

            if(direction === DIRECTION_ENUM.TOP){
                const weaponTile = tileInfo[weaponNextX_1]?.[y - 1];
                if( playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable ) ){
                    //空函数
                }else{  
                    this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
                    return true; 
                }

            }else if(direction === DIRECTION_ENUM.BOTTOM){
                const weaponTile = tileInfo[weaponNextX_1]?.[y + 1];
                if( playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable )){
                    //空函数
                }else{  
                    this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
                    return true; 
                }

            }else if(direction === DIRECTION_ENUM.LEFT){
                const weaponTile = tileInfo[weaponNextX_2]?.[y];
                if( playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable )){
                    //空函数
                }else{  
                    this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
                    return true; 
                }

            }else if(direction === DIRECTION_ENUM.RIGHT){
                if( playerTile && playerTile.moveable){
                    //空函数
                }else{  
                    this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
                    return true; 
                }
            }
                
            return false;

        }


         // ********************按钮方向向右********************
        if(inputDirection === CONTROLLER_ENUM.RIGHT){
            const playerNextX = x + 1;
            const weaponNextX_1 = x + 1;
            const weaponNextX_2 = x + 2;
            

            // 判断 player是否越过右边界
            if(playerNextX > row - 1){
                this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
                return true;
        
            }


            // 判断是否遇到 door
            if(doorState !== ENTITY_STATE_ENUM.DEATH){

                if( direction === DIRECTION_ENUM.RIGHT && (doorY === y && doorX === playerNextX + 1) ){
                    this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
                    return true;
                }

                if( direction !== DIRECTION_ENUM.RIGHT && (doorY === y && doorX === playerNextX) ){
                    this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
                    return true;
                }
            }


            // 判断是否遇到未死的 IronSkeleton
            for (let i = 0; i < enemies.length; i++) {
                const { x:enemyX, y:enemyY } = enemies[i];

                if( direction !== DIRECTION_ENUM.RIGHT && (enemyY === y && enemyX === playerNextX) ){
                    this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
                    return true;
                }
                
            }
            

            // 判断是否遇到未消失的 Burst
            for (let i = 0; i < bursts.length; i++) {
                const { x:burstX, y:burstY } = bursts[i];

                if(burstY === y && burstX === playerNextX){

                    if(direction === DIRECTION_ENUM.TOP){
                        const weaponTile = tileInfo[weaponNextX_1]?.[y - 1];
                        if (!weaponTile || weaponTile.turnable){
                            return false;
                     }
                        

                    }else if(direction === DIRECTION_ENUM.BOTTOM){
                        const weaponTile = tileInfo[weaponNextX_1]?.[y + 1];
                        if (!weaponTile || weaponTile.turnable){
                               return false;
                        }
                            
                    }else if(direction === DIRECTION_ENUM.LEFT){
                        return false;
                        
                    }else if(direction === DIRECTION_ENUM.RIGHT){
                        const weaponTile = tileInfo[weaponNextX_2]?.[y];
                        if (!weaponTile || weaponTile.turnable){
                            return false;
                        }
                    }
                }        
                
            }


            
            // 判断地图瓦片元素
            const playerTile = tileInfo[playerNextX]?.[y];

            if(direction === DIRECTION_ENUM.TOP){
                const weaponTile = tileInfo[weaponNextX_1]?.[y - 1];
                if( playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable ) ){
                    //空函数
                }else{  
                    this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
                    return true; 
                }

            }else if(direction === DIRECTION_ENUM.BOTTOM){
                const weaponTile = tileInfo[weaponNextX_1]?.[y + 1];
                if( playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable )){
                    //空函数
                }else{  
                    this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
                    return true; 
                }

            }else if(direction === DIRECTION_ENUM.LEFT){
                if( playerTile && playerTile.moveable){
                    //空函数
                }else{  
                    this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
                    return true; 
                }

            }else if(direction === DIRECTION_ENUM.RIGHT){
                const weaponTile = tileInfo[weaponNextX_2]?.[y];
                if(playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable )){
                    //空函数
                }else{  
                    this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
                    return true; 
                }
            }
                
            return false;

        }
    
        
         // ********************按钮方向向左转********************
        if(inputDirection === CONTROLLER_ENUM.TURNLEFT){
            let nextX
            let nextY
            if(direction === DIRECTION_ENUM.TOP){
                nextX = x - 1;
                nextY = y - 1;
            }else if(direction === DIRECTION_ENUM.BOTTOM){
                nextX = x + 1;
                nextY = y + 1;
            }else if(direction === DIRECTION_ENUM.LEFT){
                nextX = x - 1;
                nextY = y + 1;
            }else if(direction === DIRECTION_ENUM.RIGHT){
                nextX = x + 1;
                nextY = y - 1;
            }


            // 未死 Skeleton与瓦片元素一起考虑的情况
            for (let i = 0; i < enemies.length; i++) {
                const { x:enemyX, y:enemyY } = enemies[i];
                
                // 列出所有能转的情况
                if( (!tileInfo[x]?.[nextY] || tileInfo[x][nextY].turnable) && !(enemyX === x && enemyY === nextY) &&
                    (!tileInfo[nextX]?.[nextY] || tileInfo[nextX][nextY].turnable) &&  !(enemyX === nextX && enemyY === nextY) &&
                    (!tileInfo[nextX]?.[y] || tileInfo[nextX][y].turnable) &&  !(enemyX === nextX && enemyY === y))
                {
                    // 空函数
                }else{
                   this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT;
                   return true;
                }    

                //所有未死的 Skeleton 都满足能转的情况
                if( i === enemies.length - 1){
                    return false;
                }
            }



            // 所有Skeleton都死后，只考虑瓦片元素的情况
            if( (!tileInfo[x]?.[nextY] || tileInfo[x][nextY].turnable) && 
                (!tileInfo[nextX]?.[nextY] || tileInfo[nextX][nextY].turnable)&&
                (!tileInfo[nextX]?.[y] || tileInfo[nextX][y].turnable) )
                {
                   return false;
                }else{
                   this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT;
                   return true;
                }   
           
        }


        // ********************按钮方向向右转********************
        if(inputDirection === CONTROLLER_ENUM.TURNRIGHT){
            let nextX
            let nextY
            if(direction === DIRECTION_ENUM.TOP){
                nextX = x + 1;
                nextY = y - 1;
            }else if(direction === DIRECTION_ENUM.BOTTOM){
                nextX = x - 1;
                nextY = y + 1;
            }else if(direction === DIRECTION_ENUM.LEFT){
                nextX = x - 1;
                nextY = y - 1;
            }else if(direction === DIRECTION_ENUM.RIGHT){
                nextX = x + 1;
                nextY = y + 1;
            }

            // Skeleton与瓦片元素一起考虑的情况
            for (let i = 0; i < enemies.length; i++) {
                const { x:enemyX, y:enemyY } = enemies[i];
                
                // 列出所有能转的情况
                if( (!tileInfo[x]?.[nextY] || tileInfo[x][nextY].turnable) && !(enemyX === x && enemyY === nextY) &&
                    (!tileInfo[nextX]?.[nextY] || tileInfo[nextX][nextY].turnable) &&  !(enemyX === nextX && enemyY === nextY) &&
                    (!tileInfo[nextX]?.[y] || tileInfo[nextX][y].turnable) &&  !(enemyX === nextX && enemyY === y))
                    {
                        // 空函数
                    }else{
                       this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT;
                       return true;
                    }     

                //所有未死的 Skeleton 都满足能转的情况
                if( i === enemies.length - 1){
                    return false;
                }
            }


            // 所有Skeleton都死后，只考虑瓦片元素的情况
            if( (!tileInfo[x]?.[nextY] || tileInfo[x][nextY].turnable) && 
                (!tileInfo[nextX]?.[nextY] || tileInfo[nextX][nextY].turnable)&&
                (!tileInfo[nextX]?.[y] || tileInfo[nextX][y].turnable) )
                {
                   return false;
                }else{
                   this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT;
                   return true;
                }   

        }
    
    }

}