import {Game} from "./script";
import {GameObject} from "./gameObject";

import {Ship} from "./ship";
import {GShip} from "./gship";
import {Bomber} from "./bomber";
import {Infantry} from "./infantry";
import {Lander} from "./lander";
import {Area} from "./area";
import {OverObject,Flag} from "./overObject";

export class GameObjectGenerator{
    static gameObjectList = {
        bomber: Bomber,
        infantry: Infantry,
        lander: Lander,
        ship: Ship,
        flag: Flag,
        land: Area,
        sea: Area,
    };

    static create(type:string, game:Game, config:any):GameObject{

        let areaType = config.type;
        let x = config.x;
        let y = config.y;
        let width = config.width;
        let height = config.height;
        let direction = config.direction;
        let organization = game.level.organizationMap[config.organization];

        switch(type){
            case "bomber":
                return new Bomber(game, x, y, direction, organization);
            case "infantry":
                return new Infantry(game, x, y, direction, organization);
            case "lander":
                return new Lander(game, x, y, direction, organization);
            case "ship":
                return new Ship(game, x, y, direction, organization);
            case "GShip":
                return new GShip(game, x, y, direction, organization);
            case "flag":
                return new Flag(game, x, y, direction, organization);
            case "land":
                return new Area(game, areaType, x, y, width, height);
            case "sea":
                return new Area(game, areaType, x, y, width, height);
            default:
                //TODO エラー処理
                return new Ship(game, x, y, direction, organization);
        }
    }
}
