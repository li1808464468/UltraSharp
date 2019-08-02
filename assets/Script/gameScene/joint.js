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

class Joint extends PhysicsNode {
    constructor(data,game) {
        super(data);

        this.jointArray = [];
        this.data = data;
        // 两端都连接东西时，添加的另一个可以连接东西的节点
        this.joint = null;
        this.body.type = cc.RigidBodyType.Static;
        this.game = game;
        this.endNode = null;
        this.x = data.position.x;
        this.y = data.position.y;

        this.createJoint();
    };

    createJoint() {
        let sprite = this.addComponent(cc.Sprite);
        sprite.spriteFrame = this.game.normalSprite;
        this.setContentSize(cc.size(8,8));

        if (this.data.joinType === USGlobal.ConfigData.JoinGroup.RevoluteJoint) {
            this.jointType = USGlobal.ConfigData.JoinGroup.RevoluteJoint;
            this.joint = this.addComponent(cc.RevoluteJoint);
            this.joint.distance = 1;
            this.joint.collideConnected = true;
            this.jointArray.push(this.joint);
            this.body.type = cc.RigidBodyType.Static;

        } else if (this.data.joinType === USGlobal.ConfigData.JoinGroup.LineJoint || this.data.joinType === USGlobal.ConfigData.JoinGroup.LineJoint1) {
            this.jointType = USGlobal.ConfigData.JoinGroup.LineJoint;

            this.joint = this.addComponent(cc.RevoluteJoint);
            this.jointArray.push(this.joint);
            this.body.type = cc.RigidBodyType.Dynamic;
            let y = this.data.endPosition[1];
            let x = this.data.endPosition[0];

            let tan = x/y;
            let upPosition = cc.v2(0,0);


            let lineLength = 10;
            // 从下向上
            let jointArray = [];
            for (let i = 0; i < this.data.length; i++) {
                let childNode = new cc.Node();
                let sprite = childNode.addComponent(cc.Sprite);
                sprite.spriteFrame = this.game.normalSprite;
                this.addChild(childNode);
                childNode.setAnchorPoint(cc.v2(0.5, 0));
                childNode.setContentSize(cc.size(4, lineLength + 2));
                childNode.color = USGlobal.ConfigData.ColorType[this.data.color];
                if (tan === 0) {
                    childNode.setPosition(cc.v2(0, i * lineLength));
                } else {

                    if (i === 0) {
                        childNode.setPosition(cc.v2(0, 0));
                    } else {
                        let p = cc.v2(upPosition.x + Math.sin(tan) * lineLength, upPosition.y + Math.cos(tan) * lineLength);
                        upPosition = p;
                        childNode.setPosition(p);
                    }

                    childNode.rotation = tan * 180 / Math.PI;
                }


                let childBody = this.createRigidBody(childNode);
                childBody.type = cc.RigidBodyType.Dynamic;
                this.game.allColliderArray.push(childNode);
                childBody.gravityScale = 0.5;


                let box = childNode.addComponent(cc.PhysicsBoxCollider);
                box.density = 2;
                box.friction = 0.2;
                box.size = childNode.getContentSize();
                box.offset = cc.v2(0, childNode.getContentSize().height * 0.5);
                box.apply();

                let joint = childNode.addComponent(cc.RevoluteJoint);
                if (i === 0) {
                    joint.connectedBody = this.body;
                    joint.connectedAnchor = cc.v2(0, 0);
                } else {
                    joint.connectedBody = jointArray[jointArray.length - 1];
                    joint.connectedAnchor = cc.v2(0, lineLength);
                }
                jointArray.push(childBody);
                joint.apply();

            }

            let endNode = this.createNode(this.data);
            this.endNode = endNode;
            this.game.node.addChild(endNode);
            this.endNode.jointType = USGlobal.ConfigData.JoinGroup.LineJoint1;

            let sprite = endNode.addComponent(cc.Sprite);
            sprite.spriteFrame = this.game.normalSprite;
            endNode.setContentSize(cc.size(8,8));

            let endBody = this.createRigidBody(endNode,this.data);
            endBody.type = cc.RigidBodyType.Static;
            let endJoint = endBody.addComponent(cc.RevoluteJoint);
            endJoint.connectedBody = jointArray[jointArray.length - 1];
            endJoint.connectedAnchor = cc.v2(0,lineLength);
            this.game.allColliderArray.push(endNode);
            endJoint.apply();

            if (this.data.joinType === USGlobal.ConfigData.JoinGroup.LineJoint1) {
                // 两端都连接东西的绳子节点
                endBody.type = cc.RigidBodyType.Dynamic;
                endNode.data = this.data;
                let revoluteJosint = endBody.addComponent(cc.RevoluteJoint);
                endNode.joint = revoluteJosint;
                this.game.jointArray.push(endNode);
            }


        }
    };



};


module.exports = Joint;