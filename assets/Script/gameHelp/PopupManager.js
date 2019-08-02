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
        mainNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        // this.node = this.popupNode;
        // cc.log("popupNode size = " + this.popupNode.width + this.popupNode.height);
        this.node.setContentSize(cc.winSize);
        // cc.log("popupNode size = " + this.popupNode.width + this.popupNode.height);



        this.node.on(cc.Node.EventType.TOUCH_START,()=>{
           cc.log("触摸 start");
       },this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE,()=>{
            cc.log("触摸 move");
        },this);

        this.node.on(cc.Node.EventType.TOUCH_END,()=>{
            cc.log("触摸 end");
        },this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL,()=>{
            cc.log("触摸 cancel");
        });
    },

    onDestroy () {

    },

    start () {

    },

    playAnimation(type = 0) {
        cc.log("play Animation");
        if (type == 0) {
            this.mainNode.y = -cc.winSize.height;
            let move1 = cc.moveTo(0.15,cc.v2(0,5));
            let move2 = cc.moveTo(0.1,cc.v2(0,-2));
            let move3 = cc.moveTo(0.1,cc.v2(0,0));
            let seq = cc.sequence(move1,move2,move3);
            this.mainNode.runAction(seq);
        }

    }


});



