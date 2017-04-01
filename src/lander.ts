import "pixi.js";
import {Weapon} from "./weapon";
import {Area} from "./area";
import {Shape,Rectangle} from "./shape";
import {Organization} from "./organization";
import {Game} from "./script";
import {Infantry} from "./infantry";

export class Lander extends Weapon{
    shape:Rectangle;
    istakeDown = false;

    constructor(game:Game, x:number, y:number, direction:"left"|"right", organization:Organization){
        super(game, {kind:"Rectangle", x:x, y:y, width:20, height:20, angle:0}, direction, organization);
        let imagePath = this.game.level.levelData["WeaponList"][this.organization.name]["lander"]["imagePath"];
        this.setSprite(imagePath);
        this.shotInterval = this.game.level.levelData["WeaponList"][this.organization.name]["lander"]["shot-interval"];
        this.hp = this.game.level.levelData["WeaponList"][this.organization.name]["lander"]["hp"];
    }
    update(){
        super.update();
        let isLand = false;
        for(let object of this.collisionList){
            if(object instanceof Area && object.type == "land"){
                isLand = true;
            }
        }
        if(isLand){
            if(this.istakeDown == false){
                //陸地についたらInfantryを降ろす
                this.takeDown();
                this.remove();
            }
        }else{
            this.moveOn();
        }
    }
    moveOn(){
        switch(this.direction){
            case "right":
                this.move.x++;
                break;
            case "left":
                this.move.x--;
                break;
        }
    }
    draw(renderer: PIXI.Graphics){
    }
    takeDown(){
        this.game.level.addObject(
            new Infantry(
                this.game,
                this.shape.x - 20,
                this.shape.y,
                this.direction,
                this.organization));
        this.istakeDown = true;
    }
}
