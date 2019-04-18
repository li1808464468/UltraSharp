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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.USGlobal = {
            MathHelp: require("MathHelp"),
            ConfigData: require("ConfigData"),
            NotifyManager: require("NotifyManager"),
        }
          

        this.initLevelData();
        this.initTerainData();
        this.initContentData();
    },

    start () {
        // this.gameLayer.active = false;
    },

    initLevelData: function () {

        cc.loader.loadRes('data/levelData/level.json', function (err, object) {
            if (err) {
                console.log(err);
                return;
            }

            for (let i = 0; i < object.json.length; i++) {
                USGlobal.ConfigData.levelData.set(object.json[i].levelId,object.json[i]);
            }



        });
    },

    initTerainData: function () {
        cc.loader.loadRes('data/levelData/terrainData.json', function (err, object) {
            if (err) {
                console.log(err);
                return;
            }

            for (let i = 0; i < object.json.length; i++) {
                USGlobal.ConfigData.terainData.set(object.json[i].id,object.json[i]);
            }



        });
    },

    initContentData: function () {
        cc.loader.loadRes('data/levelData/contentData.json', function (err, object) {
            if (err) {
                console.log(err);
                return;
            }

            for (let i = 0; i < object.json.length; i++) {
                USGlobal.ConfigData.contentData.set(object.json[i].id,object.json[i]);
            }



        });
    },


    // update (dt) {},
});
