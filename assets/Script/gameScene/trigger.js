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

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.colliderArray = [];
    },

    start () {

    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
    },


    playDestroyAnimation: function (type = 0) {
        if (type === 0) {
            let scale1 = cc.scaleTo(0.17,1.3);
            let scale2 = cc.scaleTo(0.2,0.2);
            let func = cc.callFunc(()=>{
                let index = this.colliderArray.indexOf(this.node.getComponent(cc.PhysicsPolygonCollider));
                if (index !== -1) {
                    this.colliderArray.splice(index,1);
                };
            });
            let remove = cc.removeSelf();
            let seq = cc.sequence(scale1,scale2,func,remove);
            this.node.runAction(seq);
        }
    },



    // update (dt) {},
});
