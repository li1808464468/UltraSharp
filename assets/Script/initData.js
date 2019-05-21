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
            ConfigData: require("ConfigData"),
            NotifyManager: require("NotifyManager"),
            HelpManager: require("HelpManager"),
            GameManager: require("GameManager"),
        }
          

        this.initLevelData();
        this.initTerainData();
        this.initContentData();
        this.initTriggerData();
    },

    start () {
        // this.gameLayer.active = false;
    },

    // 初始化关卡数据
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

    // 初始化地形数据
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

    // 初始化可切割数据
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

    // 初始化检测器
    initTriggerData: function () {
        cc.loader.loadRes('data/levelData/triggerData.json', function (err, object) {
            if (err) {
                console.log(err);
                return;
            }

            for (let i = 0; i < object.json.length; i++) {
                USGlobal.ConfigData.triggerData.set(object.json[i].id,object.json[i]);
            }


        });
    },


    // update (dt) {},
});
