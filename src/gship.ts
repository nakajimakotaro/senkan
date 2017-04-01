import "pixi.js";
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Shape,Circle,Rectangle} from "./shape";
import {Organization} from "./organization";
import {Ship} from "./ship";

export class GShip extends Ship{
    constructor(game:Game, x:number, y:number, direction:"left"|"right", organization:Organization){
        super(game, x, y, direction, organization);
        let imagePath = this.game.level.levelData["WeaponList"][this.organization.name]["GShip"]["imagePath"];
        this.shape.width  = 40;
        this.shape.height = 40;
        this.setSprite(imagePath);

        this.hp = this.game.level.levelData["WeaponList"][this.organization.name]["GShip"]["hp"];

        this.shotInterval = this.game.level.levelData["WeaponList"][this.organization.name]["GShip"]["shot-interval"];
    }
}
