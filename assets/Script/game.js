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
        tiledLine: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
    },

    start () {
        this.initData();
        this.addTouchEvent();


        this.tiledLine.setContentSize(this.tiledLine.getContentSize().width,0);
    },

    initData: function () {
        this.touchId = -1;
    },

    addTouchEvent: function () {
        var touchStart = function (touch) {
            if (this.touchId === -1) {
                this.touchId = touch.getID();
                this.tiledLine.active = true;
                var position = this.node.convertToNodeSpaceAR(touch.getLocation());
                cc.log("touch x = %f, touch y = %f",position.x,position.y);
                this.tiledLine.setPosition(position);
            }

        }.bind(this);


        var touchMove = function (touch) {
            if (touch.getID() !== this.touchId) {
                return;
            }

            var state = touch.getLocation().y >= touch.getStartLocation().y ? 1 : -1;
            var xValue = touch.getLocation().x <= touch.getStartLocation().x ? 1 : -1;
            var distance = cc.pDistance(touch.getLocation(),touch.getStartLocation());
            this.tiledLine.setContentSize(this.tiledLine.getContentSize().width,distance);
            this.tiledLine.setScaleY(state);
            this.tiledLine.rotation = Math.cos((touch.getLocation().y -  touch.getStartLocation().y) / distance) / Math.PI * 180;

        }.bind(this);

        var touchEnd = function (touch) {
            if (touch.getID() === this.touchId) {
                this.touchId = -1;
                this.tiledLine.active = false;
                this.tiledLine.setContentSize(this.tiledLine.getContentSize().width,0);
            }

        }.bind(this);
        this.node.on("touchstart", touchStart);
        this.node.on('touchmove', touchMove);
        this.node.on('touchend', touchEnd);
        this.node.on('touchcancel', touchEnd);
    },

    // update (dt) {
    //
    // },
});
