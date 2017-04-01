import {Game} from "./script";
import {Organization} from "./organization";
import {Ship} from "./ship";
import {GameObjectGenerator} from "./gameObjectGenerator";
export class CPU extends Organization{
    constructor(game:Game, config){
        super(game, config);
    }
    update(){
        super.update();
        if(this.game.level.countFrame % 120 == 0){
            let createWeapon:string;
            if(Math.random() > 0.1){
                createWeapon = "ship";
            }else{
                createWeapon = "lander";
            }
            let x = this.game.level.levelData["WeaponList"][this.name][createWeapon]["entryPoint"]["x"];
            let y = this.game.level.levelData["WeaponList"][this.name][createWeapon]["entryPoint"]["y"];
            let ship = this.createWeapon(createWeapon, this.game, x, y, "right");
            if(ship == null){
                return;
            }
            this.game.level.addObject(ship);
        }
    }
}
