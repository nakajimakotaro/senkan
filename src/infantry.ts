import "pixi.js";
import {Weapon} from "./weapon";
import {Flag} from "./overObject";
import {Area} from "./area";
import {Collision} from "./collision";
import {Organization} from "./organization";
import {Shape,Circle,Rectangle} from "./shape";
import {Game} from "./script";
import {Bullet} from "./bullet";

export class Infantry extends Weapon{
    shape:Circle;
    constructor(game:Game, x:number, y:number, direction:"left"|"right", organization:Organization){
        super(game, {kind:"Rectangle", x:x, y:y, width:5, height:20, angle:0}, direction, organization);

        let imagePath = this.game.level.levelData["WeaponList"][this.organization.name]["infantry"]["imagePath"];
        this.setSprite(imagePath);

        this.shotInterval = this.game.level.levelData["WeaponList"][this.organization.name]["infantry"]["shot-interval"];
        this.hp = this.game.level.levelData["WeaponList"][this.organization.name]["infantry"]["hp"];
    }
    update(){
        super.update();

        //画面からはみ出したら消す
        if(
            this.shape.x < -300 ||
            this.shape.x > 1300 ||
            this.shape.y < -300 ||
            this.shape.y > 1000){
            this.remove(); 
        }
        for(let object of this.collisionList){
            if(object instanceof Flag){
                this.game.level.gameSet(this.organization);
            }
        }
        this.moveOn();
    }
    moveOn(){
        let isLand = false;
        for(let object of this.collisionList){
            if(object instanceof Area && object.type == "land"){
                isLand = true;
            }
        }
        if(isLand){
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

    fire(){
        this.game.level.addObject(new Bullet(this.game, this, this.shape.x, this.shape.y, Math.PI, 3, 0));
    }
}
