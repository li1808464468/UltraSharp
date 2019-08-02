// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
//地形类
let PhysicsNode = require("PhysicsNode");


class Terrain extends PhysicsNode {
    constructor(data) {
        super(data)


        if (!data.group) {
            this.group = USGlobal.ConfigData.NodeGroup.Terrain;
        }

        if ((data.state !== undefined ) && data.state === USGlobal.ConfigData.RigidBodyType.Dynamic) {
            this.body.type = cc.RigidBodyType.Dynamic;
        } else {
            this.body.type = cc.RigidBodyType.Static;
        }


    }

}

module.exports = Terrain;

