import {Shape, Rectangle} from "./shape";

import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Weapon} from "./weapon";
import {GameObjectGenerator} from "./gameObjectGenerator";

import {Collision} from "./collision";
import {Player} from "./player";

//Weaponのリストを表示してタッチしたらマップに出す
export class WeaponSelectPanel{
    game:Game;
    weaponCardList:WeaponCard[] = [];
    collision:Collision;
    constructor(game:Game, levelData:Object, public player:Player){
        this.game = game;
        this.collision = new Collision();
        let count = 0;
        for(let weaponTypeName of levelData["CreateWeaponList"]){
            let weaponType = levelData["WeaponList"]["sun"][weaponTypeName];
            this.weaponCardList.push(
                new WeaponCard(game, this, weaponType["name"], {kind:"Rectangle", x: 860 - count * 100, y: 440, width: 100, height: 100, angle: 0})
            );
            count++;
        }

        let canvas = this.game.app.view;
        //マウスとタッチイベントの追加
        let onDown = (e)=>{
            let x = e.pageX - canvas.offsetLeft;
            let y = e.pageY - canvas.offsetTop;
            let clickObject = this.collision.collision({kind:"Point", x: x, y: y})[0];
            if(clickObject){
                let weaponCard = clickObject.object as WeaponCard;
                let weapon = weaponCard.createWeapon();
                if(weapon == null){
                    return;
                }
                this.game.level.addObject(weapon);
            }
        }
        let onUp = (e)=>{
            let x = e.pageX - canvas.offsetLeft;
            let y = e.pageY - canvas.offsetTop;
        }
        canvas.addEventListener('mousedown', onDown);
        canvas.addEventListener('mouseup', onUp);
    }
}
class WeaponCard{
    game:Game;
    weaponSelectPanel:WeaponSelectPanel;

    weaponName:string; //兵器の名前
    entryPoint:{x:number, y:number};

    shape:Rectangle; //カードの場所と形
    backgroundSprite:PIXI.Sprite; //カードの背景画像
    weaponSprite:PIXI.Sprite; //兵器の画像
    costView:PIXI.Graphics;
    constructor(game:Game, weaponSelectPanel:WeaponSelectPanel, weaponName:string, shape:Rectangle){
        this.game = game;
        this.weaponSelectPanel = weaponSelectPanel;
        this.weaponName = weaponName;
        this.entryPoint = this.game.level.levelData["WeaponList"]["sun"][weaponName]["entryPoint"];

        this.shape = shape;
        this.weaponSelectPanel.collision.add(this, this.shape);

        //背景画像
        this.backgroundSprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
        this.game.loader.load(`image/weaponCardBackground.png`).then(
            (texture:PIXI.Texture)=>{
                this.backgroundSprite.texture = texture;
                this.backgroundSprite.x = this.shape.x;
                this.backgroundSprite.y = this.shape.y;
                this.game.level.view.addChild(this.backgroundSprite);
            });

        //兵器の画像
        this.weaponSprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
        this.game.loader.load(`image/${this.weaponSelectPanel.player.name}-${this.weaponName}.png`).then(
            (texture:PIXI.Texture)=>{
                this.weaponSprite.texture = texture;
                this.weaponSprite.x = this.shape.x + this.shape.width / 2 - this.weaponSprite.width / 2;
                this.weaponSprite.y = this.shape.y + this.shape.height / 2 - this.weaponSprite.height / 2;
                this.game.level.view.addChild(this.weaponSprite);
                this.game.level.view.addChild(this.costView);
            });

        //コストを表す円
        this.costView = new PIXI.Graphics();
        this.costView.beginFill(0xff0000);

        let cost = this.game.level.levelData["WeaponList"]["sun"][weaponName]["cost"];
        let costNum = Math.floor(cost / 100);
        for(let i = 0;i < costNum;i++){
            let r = 6;
            let x = this.shape.x + (r * 2 + 3) * i + r + r;
            let y = this.shape.y + r + r;
            this.costView.drawCircle(x, y, r);
        }
    }

    createWeapon():GameObject|null{
        let x = this.entryPoint.x;
        let y = this.entryPoint.y;
        let player = this.weaponSelectPanel.player;

        return player.createWeapon(this.weaponName, this.game, x, y, "left");
    }
}
