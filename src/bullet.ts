import "pixi.js";
import {Game} from "./script";
import {Weapon} from "./weapon";
import {Area} from "./area";
import {GameObject} from "./gameObject";
import {Collision} from "./collision";
import {Shape,Circle} from "./shape";

export class Bullet extends GameObject{
    shape:Shape = {kind:"Circle", x:0, y:0, r:0, angle:0};
    shotter:Weapon;
    collisionList:any = [];
    x = 0;
    y = 0;
    prevVector = {"x": 0, "y": 0};
    angle = 0;
    speed = 0;
    gravity = 0;
    color = 0xff00ff;

    constructor(game:Game, shotter:Weapon, x:number, y:number, angle:number, speed:number, gravity:number){
        super(game);
        this.shotter = shotter;
        this.shape.x = x;
        this.shape.y = y;
        this.angle = angle;
        this.speed = speed;
        this.gravity = gravity;
        this.color = 0xff00ff;
        this.prevVector.x =      Math.cos(this.angle) * this.speed;
        this.prevVector.y = -1 * Math.sin(this.angle) * this.speed;
        this.game.level.collision.add(this, this.shape, this.collisionList);
    }
    update(){
        super.update();
        if(
            this.shape.x < -300 ||
            this.shape.x > 1300 ||
            this.shape.y < -300 ||
            this.shape.y > 1000){
            this.remove(); 
        }
        this.prevVector.y += this.gravity;
        this.move.x = this.prevVector.x;
        this.move.y = this.prevVector.y;
        let isAttack = false;
        for(let hitObject of this.collisionList){
            if(hitObject instanceof Area){
                this.remove();
            }
            if(hitObject instanceof Weapon && hitObject.organization != this.shotter.organization && isAttack == false){
                isAttack = true;
                this.remove();
                hitObject.hp--;
            }
        }
    }
    remove(){
        super.remove();
        this.game.level.collision.remove(this, this.shape, this.collisionList);
    }
    draw(renderer: PIXI.Graphics){
        renderer.beginFill(this.color);
        renderer.drawPolygon(
            [
                new PIXI.Point(this.shape.x +  2, this.shape.y -  1),
                new PIXI.Point(this.shape.x -  2, this.shape.y -  1),
                new PIXI.Point(this.shape.x -  5, this.shape.y +  1),
                new PIXI.Point(this.shape.x -  2, this.shape.y +  1),
                new PIXI.Point(this.shape.x +  2, this.shape.y +  1),
            ]
        );
    }
}
