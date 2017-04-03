import "pixi.js";
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {GameObjectGenerator} from "./gameObjectGenerator";
import {Shape,Circle} from "./shape";
export abstract class Organization{
    game:Game;
    name:string;
    direction:"left"|"right";
    money = 0;
    constructor(game:Game, config:any){
        this.game = game;
        this.name = config.name;
        this.direction = config.direction;

    }
    update(){
        this.moneyUpdate();
    }

    //マネー
    moneyUpdate(){
        if(this.money < 1000){
            this.money++;
        }
    }
    draw(renderer: PIXI.Graphics){
        this.moneyDraw(renderer);
    }

    moneyDraw(renderer:PIXI.Graphics){
        renderer.beginFill(0xff0000);

        let moneyCount = Math.floor(this.money / 100);
        for(let i = 0;i < moneyCount;i++){
            let r = 6;
            let x = this.direction == "right" ? this.game.app.screen.width : 0;
                x += (this.direction == "right" ? -1 : 1) * ((r * 2 + 3) * i + r + r);
            let y = r + r;
            renderer.drawCircle(x, y, r);
        }
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

