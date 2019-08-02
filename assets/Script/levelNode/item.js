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
        levelBg:{
            default: [],
            type: cc.SpriteFrame,
        },

        label: cc.Label,
        levelId: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancelled, this);
    },

    start () {

    },

    initData: function (id) {
        this.levelId = id;
        this.label.string = id + 1;
    },

    onTouchBegan: function () {
    },

    onTouchMoved: function () {
    },

    onTouchEnded: function () {

        let event = new cc.Event.EventCustom(USGlobal.NotifyManager.Close_Popup_Level,true);
        event.setUserData(this.levelId);
        this.node.dispatchEvent(event);

    },

    onTouchCancelled: function () {
    }




    // update (dt) {},
});
