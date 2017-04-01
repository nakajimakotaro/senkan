import "pixi.js";
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Shape,Circle,Rectangle} from "./shape";
import {Weapon} from "./weapon";
import {Organization} from "./organization";
import {Particle,Firework} from "./particle";
import {Bullet} from "./bullet";
import {Area} from "./area";

export class Ship extends Weapon{
    shape:Rectangle;
    stopRange:Rectangle;
    stopRangeCollision:Object[] = [];
    target:GameObject|null = null;

    constructor(game:Game, x:number, y:number, direction:"left"|"right", organization:Organization){
        super(game, {kind:"Rectangle", x:x, y:y, width:20, height:20, angle:0}, direction, organization);
        let imagePath = this.game.level.levelData["WeaponList"][this.organization.name]["ship"]["imagePath"];
        this.setSprite(imagePath);

        this.hp = this.game.level.levelData["WeaponList"][this.organization.name]["ship"]["hp"];

        this.shotInterval = this.game.level.levelData["WeaponList"][this.organization.name]["ship"]["shot-interval"];
        this.stopRange = {kind:"Rectangle", x: 0, y: 0, width: 200, height: 30, angle: 0};
        this.game.level.collision.add(null, this.stopRange, this.stopRangeCollision);
    }
    update(){
        super.update();
        this.target = this.targetSelect();
        //画面からはみ出したら消す
        if(
            this.shape.x < -300 ||
            this.shape.x > 1300 ||
            this.shape.y < -300 ||
            this.shape.y > 1000){
            this.remove(); 
        }

        if(this.game.level.countFrame % this.shotInterval == 0){
            this.fire();
        }
        this.moveOn();

        this.stopRange.x = this.shape.x + this.shape.width / 2 + (this.direction == "left" ? -200 : 0);
        this.stopRange.y = this.shape.y;
    }
    remove(){
        super.remove();
        this.game.level.collision.remove(null, this.stopRange, this.stopRangeCollision);
    }
    moveOn(){
        //地面にぶつかったら破壊
        for(let object of this.collisionList){
            if(object instanceof Area && object.type == "land"){
                this.remove();
                return;
            }
        }
        //敵が近くにいると止まる
        for(let object of this.stopRangeCollision){
            if(object instanceof Weapon && object.organization != this.organization){
                return;
            }
        }
        switch(this.direction){
            case "right":
                this.move.x++;
                break;
            case "left":
                this.move.x--;
                break;
        }
    }
    targetSelect():GameObject|null{
        let target:GameObject|null = null;
        for(let object of this.game.level.gameObjectList){
            //Weaponを継承していて
            if(!(object instanceof Weapon)){
                continue;
            }
            //進行方向にいる
            if(
                (this.direction == "left"  && object.shape.x - this.shape.x >= 0) ||
                    (this.direction == "right" && object.shape.x - this.shape.x <= 0)
            ){
                continue;
            }
            //自分のチームではなく
            if(object.organization == this.organization){
                continue;
            }
            //現在のターゲットがnullなら
            if(target == null){
                target = object;
                continue;
            }
            //現在のターゲットの方が遠ければ
            let targetRange = Math.hypot(this.shape.x - target.shape.x, this.shape.y - target.shape.y);
            let objectRange = Math.hypot(this.shape.x - object.shape.x, this.shape.y - object.shape.y);
            if(Math.min(targetRange, objectRange) == targetRange){
                continue;
            }
            target = object;
        }
        return target;
    }

    fire(){
        let gravity = 0.03;
        let speed   = 4;
        let angle0:number = 0;

        if(this.target == null){
            return;
        }
        let targetPos:{x:number, y:number};
        if(this.target.shape.kind == "Circle" || this.target.shape.kind == "Point"){
            targetPos = {x: this.target.shape.x, y: this.target.shape.y};
        }else if(this.target.shape.kind == "Rectangle"){
            targetPos = {x: this.target.shape.x + this.target.shape.width / 2, y: this.target.shape.y + this.target.shape.height / 2};
        }else{
            return;
        }
        for(let i = 0;i < 3;i++){
            let angle = this.targetAngleOfparabola({x: this.shape.x + this.shape.width / 2, y: this.shape.y + this.shape.height / 2}, targetPos, speed, gravity);
            if(angle == null){
                return;
            }
            angle0 = angle[0];
            let flightTime = (targetPos.x - this.shape.x) / (Math.cos(angle0) * speed);
            targetPos.x = this.target.shape.x + this.target.moveAverage().x * flightTime;
        }
        this.game.level.addObject(new Bullet(this.game, this, this.shape.x + this.shape.width / 2, this.shape.y + this.shape.height / 2, angle0, speed, gravity));
    }
    //現在の位置とターゲットの位置
    targetAngleOfparabola(thisPos:{x:number, y:number}, targetPos:{x:number, y:number}, speed:number, gravity:number):[number, number]|null{
        let reversal = false;
        let width  = targetPos.x - thisPos.x;
        let height = -1 * (targetPos.y - thisPos.y);
        if(width == 0 && height == 0){
            return [0, 0];
        }
        if(width == 0 && height > 0){
            return [Math.PI / 2, Math.PI / 2];
        }
        if(width == 0 && height < 0){
            return [Math.PI / 2, Math.PI + Math.PI / 2];
        }
        if(width < 0){
            reversal = true;
            width *= -1;
        }
        let P = (width * width) / (2 * speed * speed) * gravity;
        let angle0 = Math.atan((-width + Math.sqrt(width * width - 4 * (-P * (-P - height)))) / (2 * -P));
        let angle1 = Math.atan((-width - Math.sqrt(width * width - 4 * (-P * (-P - height)))) / (2 * -P));
        if(reversal){
            angle0 = Math.PI - angle0;
            angle1 = Math.PI - angle1;
        }
        if(Number.isNaN(angle0)){
            return null;
        }
        return [angle0, angle1];
    }
}

