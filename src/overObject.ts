import "pixi.js";
import {Shape,Circle} from "./shape";
import {Collision} from "./collision";
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Organization} from "./organization";

export class OverObject{
}

export class Flag extends GameObject{
    shape:Circle = {kind:"Circle", x:0, y:0, r:0, angle:0};
    constructor(game:Game, x:number, y:number, direction:"left"|"right", organization:Organization){
        super(game);
        this.shape.x = x;
        this.shape.y = y;
        this.shape.r = 1;
        this.game.level.collision.add(this, this.shape);
    }
    draw(renderer: PIXI.Graphics){
        renderer.beginFill(0xFDD835);
        renderer.drawPolygon(
            [
                new PIXI.Point(this.shape.x -  2, this.shape.y + 10),
                new PIXI.Point(this.shape.x +  2, this.shape.y + 10),
                new PIXI.Point(this.shape.x +  2, this.shape.y +  2),
                new PIXI.Point(this.shape.x + 10, this.shape.y -  4),
                new PIXI.Point(this.shape.x +  2, this.shape.y - 10),
                new PIXI.Point(this.shape.x -  2, this.shape.y - 10),
            ]
        );
    }
}
