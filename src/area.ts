import PIXI = require('pixi.js');
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Shape,Rectangle} from "./shape";

export class Area extends GameObject{
    shape:Rectangle = {kind:"Rectangle", x:0, y:0, width:0, height:0, angle:0};
    type:string;

    constructor(game:Game, type:string, x:number, y:number, width:number, height:number){
        super(game);
        this.shape.x = x;
        this.shape.y = y;
        this.shape.width = width;
        this.shape.height = height;
        this.type = type;
        this.game.level.collision.add(this, this.shape);
    }

    update(){
    }
    draw(renderer: PIXI.Graphics){
        let color = 0xffffff;
        if(this.type == "land"){
            color = 0xd700ff;
        }else if(this.type == "sea"){
            color = 0x00cdff;
        }
        renderer.beginFill(color);
        renderer.drawRect(this.shape.x, this.shape.y, this.shape.width, this.shape.height);
    }
}
