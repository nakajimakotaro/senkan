import "pixi.js";
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {GameObjectGenerator} from "./gameObjectGenerator";
export abstract class Organization{
    game:Game;
    name:string;
    direction:"left"|"right";
    money = 0;
    moneyTextSprite:PIXI.Text;
    constructor(game:Game, config:any){
        this.game = game;
        this.name = config.name;
        this.direction = config.direction;

        this.moneyTextSprite = new PIXI.Text(this.money.toString(), {fontFamily : 'Arial', fontSize: 24, fill : 0xffffff, align : 'center'});
        this.game.level.view.addChild(this.moneyTextSprite);
    }
    update(){
        //マネー
        this.money++;
        this.moneyTextSprite.x = this.direction == "right" ? this.game.app.screen.width - this.moneyTextSprite.width : 0;
        this.moneyTextSprite.text = this.money.toString();
    }

    createWeapon(weaponName:string, game:Game, x:number, y:number, direction:"left"|"right"):GameObject|null{
        let cost = this.game.level.levelData["WeaponList"][this.name][weaponName]["cost"];
        if(cost > this.money){
            return null;
        }
        this.money -= cost;
        return GameObjectGenerator.create(weaponName, game, {x: x, y: y, direction: direction, organization: this.name});
    }
}

