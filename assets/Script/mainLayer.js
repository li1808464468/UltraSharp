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
    },

    // LIFE-CYCLE CALLBACKS:

    onDestroy () {
        this.node.off(USGlobal.NotifyManager.Close_Popup_Level,this);
    },

    onLoad () {
        this.node.on(USGlobal.NotifyManager.Close_Popup_Level, function (event) {
            let levelId = event.getUserData();
            this.enterGame(levelId);

        },this);


    },

    start () {

    },

    enterGame: function (levelId) {
        let move1 = cc.moveBy(15,cc.v2(0,cc.winSize.height));
        this.node.runAction(move1);

        this.gameLayer.active = true;
        this.gameLayer.y = -cc.winSize.height;
        let move2 = move1.clone();
        // let move2 = cc.moveBy(15,cc.v2(0,cc.winSize.height * 0.2));
        this.gameLayer.runAction(move2);
        this.gameLayer.getComponent("game").createLevelData(0);


    },


    // update (dt) {},
});
