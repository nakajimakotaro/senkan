import {Game} from "./script";
import {Organization} from "./organization";
import {Ship} from "./ship";
export class Player extends Organization{
    constructor(game:Game, config){
        super(game, config);
    }
    update(){
        super.update();
    }
}
