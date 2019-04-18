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
        item: cc.Prefab,
    },



    onLoad () {


    },

    start () {
        this.createLevelNode();
    },


    createLevelNode: function () {
        var parent = this.getComponent(cc.ScrollView);
        for (let i = 0; i < 40; i++) {
            let node = cc.instantiate(this.item);
            parent.content.addChild(node);
            node.x = -190 +  Math.floor(i%4) * 125;
            node.y = -80 + -125 * Math.floor(i/4);
            let js = node.getComponent("item");
            js.initData(i);


        }


        cc.log("滚动的最大距离x = %f,y = %f",parent.getMaxScrollOffset().x,parent.getMaxScrollOffset().y);
    },

    // update (dt) {},
});
