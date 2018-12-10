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
        cc.log("game");
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
                // cc.log("touch x = %f, touch y = %f",position.x,position.y);
                this.tiledLine.setPosition(position);
            }

        }.bind(this);


        var touchMove = function (touch) {
            if (touch.getID() !== this.touchId) {
                return;
            }

            var p1 = this.node.convertToWorldSpaceAR(touch.getLocation());
            var p2 = this.node.convertToWorldSpaceAR(touch.getStartLocation());
            var state = p1.y >= p2.y ? 1 : -1;
            var xValue = p1.x <= p2.x ? 1 : -1;
            var distance = cc.pDistance(p1,p2);
            this.tiledLine.setContentSize(this.tiledLine.getContentSize().width,distance);
            this.tiledLine.setScaleY(state);

            var rotation = USGlobal.MathHelp.pPointAngle(p1,p2);

            if (p1.y > p2.y && p1.x < p2.x) {
                rotation *= -1;
            } else if (p1.y < p2.y && p1.x > p2.x) {
                rotation *= -1;
            }
            // cc.log("angle = %f rotation = %f",angle,rotation);
            this.tiledLine.rotation = rotation;

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
