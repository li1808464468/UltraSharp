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
        this.initJoinData();
    },

    start () {
        // this.gameLayer.active = false;
    },

    // 初始化关卡数据
    initLevelData() {

        cc.loader.loadRes('data/levelData/level', function (err, object) {
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
    initTerainData() {
        cc.loader.loadRes('data/levelData/terrainData', function (err, object) {
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
    initContentData() {
        cc.loader.loadRes('data/levelData/contentData', function (err, object) {
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
    initTriggerData() {
        cc.loader.loadRes('data/levelData/triggerData', function (err, object) {
            if (err) {
                console.log(err);
                return;
            }

            for (let i = 0; i < object.json.length; i++) {
                USGlobal.ConfigData.triggerData.set(object.json[i].id,object.json[i]);
            }


        });
    },

    // 初始化关节数据
    initJoinData() {
        cc.loader.loadRes('data/levelData/joinData', function (err, object) {
            if (err) {
                console.log(err);
                return;
            }

            for (let i = 0; i < object.json.length; i++) {
                USGlobal.ConfigData.joinData.set(object.json[i].id,object.json[i]);
            }

        });

    },

    // update (dt) {},
});
