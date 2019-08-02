// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let PhysicsNode = require("PhysicsNode");


class Trigger extends  PhysicsNode{
    constructor(data) {
        super(data);
        this.colliderArray = [];
        if (!data.group) {
            this.group = USGlobal.ConfigData.NodeGroup.Trigger;
        }


        this.body.enabledContactListener = true;
        this.body.type = cc.RigidBodyType.Static;
        this.polygon.sensor = true;

    };





    playDestroyAnimation (type = 0,colliderArray) {

        this.colliderArray = colliderArray;
        if (type === 0) {
            let scale1 = cc.scaleTo(0.17,1.3);
            let scale2 = cc.scaleTo(0.2,0.2);
            let func = cc.callFunc(()=>{
                let index = this.colliderArray.indexOf(this.polygon);
                if (index !== -1) {
                    this.colliderArray.splice(index,1);
                };
            });
            let remove = cc.removeSelf();
            let seq = cc.sequence(scale1,scale2,func,remove);
            this.runAction(seq);
        }
    };




};

module.exports = Trigger;

