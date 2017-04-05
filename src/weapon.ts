import PIXI = require('pixi.js');
import {Game} from "./script";
import {Shape} from "./shape";
import {GameObject} from "./gameObject";
import {Organization} from "./organization";
import {Particle,Firework} from "./particle";

export abstract class Weapon extends GameObject{
    public sprite:PIXI.Sprite;
    public hp:number;
    collisionList:Object[] = [];
    shotInterval:number;

    constructor(game:Game, public shape:Shape, public direction:"left"|"right", public organization:Organization){
        super(game);
        this.sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
        this.game.level.view.addChild(this.sprite);
        this.game.level.collision.add(this, this.shape, this.collisionList);
    }
    update(){
        super.update();
        if(this.hp <= 0){
            this.remove();
        }
        this.sprite.x = this.shape.x;
        this.sprite.y = this.shape.y;
    }
    remove(){
        super.remove();
        this.game.level.view.removeChild(this.sprite);
        this.game.level.collision.remove(this, this.shape, this.collisionList);
        this.explosion();
    }
    explosion(){
        this.game.level.addObject(new Particle(this.game, 
            {
                type: "firework",
                pos: {
                    kind:"Point",
                    x: this.shape.x,
                    y: this.shape.y,
                },
                posRandom: {
                    xmin: -10,
                    xmax:  10,
                    ymin: -10,
                    ymax:  10,
                },
                color: 0xff0000,
                sparkNum: 20,
                initialVelocity: {
                    x:0,
                    y:-3,
                },
                randomVelocity: {
                    xmin: -10,
                    xmax:  10,
                    ymin: -10,
                    ymax:  10,
                },
                endTime: 60 + this.game.level.countFrame,
            }));
    }
    setSprite(path:string){
        this.game.loader.load(path).then(
            (texture:PIXI.Texture)=>{
                this.sprite.texture = texture;
            });
    }
}
