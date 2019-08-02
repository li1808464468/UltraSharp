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

class Content extends PhysicsNode {
    constructor(data) {
        super(data);

        if (!data.group) {
            this.group = USGlobal.ConfigData.NodeGroup.Content;
        }




        if ((data.state !== undefined) && data.state === USGlobal.ConfigData.RigidBodyType.Static) {
            this.body.type = cc.RigidBodyType.Static;
        } else {
            this.body.type = cc.RigidBodyType.Dynamic;
        }

    };



}

module.exports = Content;