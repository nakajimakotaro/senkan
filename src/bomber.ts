import "pixi.js";
import {Weapon} from "./weapon";
import {Shape} from "./shape";
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Organization} from "./organization";
import {Bullet} from "./bullet";

export class Bomber extends Weapon{
    shape:Shape;
    direction:"left"|"right" = "left";

    constructor(game:Game, x:number, y:number, direction:"left"|"right", organization:Organization){
        super(game, {kind:"Circle", x:x, y:y, r:10, angle:0}, direction, organization);

        let imagePath = this.game.level.levelData["WeaponList"][this.organization.name]["bomber"]["imagePath"];
        this.setSprite(imagePath);

        this.shotInterval = this.game.level.levelData["WeaponList"][this.organization.name]["bomber"]["shot-interval"];
        this.hp = this.game.level.levelData["WeaponList"][this.organization.name]["bomber"]["hp"];
    }
    update(){
        super.update();
        this.move.x += (this.direction === "right" ? 1 : -1) * 2;
        if(this.game.level.countFrame % this.shotInterval == 0){
            this.fire();
        }
        if(this.shape.x < 200){
            this.direction = "right";
        }
        if(this.shape.x > 400){
            this.direction = "left";
        }
        this.shape.x += this.move.x;
    }

    fire(){
        let gravity = 0.03;
        let speed   = 2;
        this.game.level.addObject(new Bullet(this.game, this, this.shape.x, this.shape.y, Math.PI + Math.PI / 2, speed, gravity));
    }
}
