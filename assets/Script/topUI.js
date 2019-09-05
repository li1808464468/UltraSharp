// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        gameLayer: cc.Node,
        mainLayer: cc.Node,
        closeButton: cc.Node,

        clearCountNode: cc.Node,
        clearCountLabel1: cc.Label,
        clearCountLabel2: cc.Label,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.closeButton.x = -cc.winSize.width * 0.5 + this.closeButton.getContentSize().width * 0.5 + 20;
    },

    start () {

    },

    closeGame: function () {
        let move1 = cc.moveBy(0.15,cc.v2(0,-cc.winSize.height));
        this.mainLayer.runAction(move1);

        this.gameLayer.getComponent("Game").endGame();
        this.gameLayer.active = false;
        this.gameLayer.y = cc.winSize.height;
        let move2 = move1.clone();
        this.gameLayer.runAction(move2);
    },

    resumeGame: function () {
        this.gameLayer.getComponent("Game").resumeGame();
    },

    setClearLabelFont (count1,count2,levelData) {
        this.clearCountLabel1.string = count1 + "/" + levelData.count;
        this.clearCountLabel2.string = count2 + "/100%";

    },


    // update (dt) {},
});
