// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var PopupManager = require("PopupManager");

cc.Class({
    extends: PopupManager,

    properties: {
        gameNode: cc.Node,
        starNode: {
            default: [],
            type: cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
    },

    onDestroy () {

    },

    start () {

    },

    showSucceedLayer: function () {
        this.createStar();
        this.playAnimation();
    },


    createStar: function () {
        let gameJs = this.gameNode.getComponent("game");
        if (gameJs.levelData.levelType === USGlobal.GameManager.LevelType.ClearStar) {

            let starCount = 3;
            for (let i = 0; i < gameJs.levelData.count.length; i++) {

                if (gameJs.cutCount === gameJs.levelData.count[i] || (i === gameJs.levelData.count.length - 1)) {
                    starCount -= i;
                    break;
                }
            }

            for (let i = 0; i < this.starNode.length; i++) {
                if (i <= starCount - 1) {
                    this.starNode[i].active = true;
                } else {
                    this.starNode[i].active = false;
                }
            }




        }
    },



});
