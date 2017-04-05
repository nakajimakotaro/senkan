import PIXI = require('pixi.js');
import _ = require('lodash');
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Shape,Rectangle} from "./shape";
import {GameObjectGenerator} from "./gameObjectGenerator";
import {WeaponSelectPanel} from "./weaponSelectPanel";
import {Collision} from "./collision";
import {Organization} from "./organization";

import {Player} from "./player";
import {CPU} from "./cpu";


export class Level extends GameObject{
    shape:Rectangle = {kind:"Rectangle", x:0, y:0, width:960, height:540, angle:0};
    collision:Collision;
    view:PIXI.Container;

    levelData:any;
    isLoad = false;

    organizationMap:{[key:string]:Organization} = Object.create(null);

    gameObjectList:GameObject[] = [];
    removeQueueList:GameObject[] = [];

    isGameSet = false;
    winPlayer:Organization|null = null;

    countFrame = 0;

    weaponSelectPanel:WeaponSelectPanel;
    constructor(game: Game){
        super(game);
        this.view = new PIXI.Container();
        this.game.app.stage.addChild(this.view);
        this.collision = new Collision();
    }
    load(levelText: string){
        this.levelData = JSON.parse(levelText);

        for(let config of this.levelData["Organization"]){
            let organization = config.type == "player" ? new Player(this.game, config) : new CPU(this.game, config);
            this.organizationMap[organization.name] = organization;
        }

        //TODO 複数人プレイヤーに対応
        this.weaponSelectPanel = new WeaponSelectPanel(this.game, this.levelData, this.organizationMap["sun"]);

        for(let node of this.levelData["GameObject"]){
            this.addObject(GameObjectGenerator.create(node["type"], this.game, node));
        }
    }
    save(){
    }
    update(){
        if(this.isGameSet == false){
            for(let key in this.organizationMap){
                let organization = this.organizationMap[key];
                organization.update();
            }
            for(let object of this.gameObjectList){
                object.update();
            }
            this.collision.tick();
            this.removeExec();
        }
        this.countFrame++;
    }
    addObject(object:GameObject){
        this.gameObjectList.push(object);
    }

    removeQueue(object:GameObject){
        this.removeQueueList.push(object);
    }
    private removeExec(){
        for(let a of this.removeQueueList){
            _.remove(this.gameObjectList, (b)=>{
                return a===b;
            });
        }
        this.removeQueueList = [];
    }
    draw(renderer: PIXI.Graphics){
        for(let key in this.organizationMap){
            let organization = this.organizationMap[key];
            organization.draw(renderer);
        }
        for(let object of this.gameObjectList){
            object.draw(renderer);
        }
        if(this.isGameSet){
        }
    }

    gameSet(win:Organization){
        this.isGameSet = true;
        this.winPlayer = win;
        let gameSetLayer = new PIXI.Container();

        let darkLayer = new PIXI.Graphics();
        darkLayer.beginFill(0x000000, 0.5);
        darkLayer.drawRect(0, 0, this.shape.width, this.shape.height);
        gameSetLayer.addChild(darkLayer);

        let winName:string;
        if(win.name == "sun"){
            winName = "player";
        }else{
            winName = "cpu";
        }
        let winText = new PIXI.Text(`${winName}の勝ち`, {fontFamily : 'Arial', fontSize: 24, fill : 0xffffff, align : 'center'});
        winText.x = this.shape.x + this.shape.width / 2 - winText.width / 2;
        winText.y = this.shape.y + this.shape.height / 2 - winText.height / 2;
        gameSetLayer.addChild(winText);

        this.game.app.stage.addChild(gameSetLayer);
    }
}

