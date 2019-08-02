// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html


// 物理组件基类
class PhysicsNode extends cc.Node {
    constructor(data) {
        super();

        this.data = data;
        if (data.color !== undefined) {
            this.color = USGlobal.ConfigData.ColorType[data.color];
        }

        if (data.scale && data.scale.length === 2) {
            this.scaleX = data.scale[0];
            this.scaleY = data.scale[1];
        }


        this.body = this.addComponent(cc.RigidBody);
        this.body.angularDamping = 0.7;
        if (data && data.gravity) {
            this.body.gravityScale = data.gravity;
        }


        if (data.group) {
            this.group = data.group;
        }



        if (data.type === USGlobal.ConfigData.TerrainType.Polygon) {
            this.createPhysicsPolygonCollider(data);
        } else if (data.type === USGlobal.ConfigData.TerrainType.Box) {
            this.createPhysicsBoxCollider(data);
        } else {
            cc.log("类型错误");
        }




    };




    createPhysicsBoxCollider (data) {
        let box = this.addComponent(cc.PhysicsBoxCollider);

        if (data.size && data.size.length === 2) {
            box.size = cc.size(data.size[0],data.size[1]);
            box.apply();
        }


        this.polygon = box;
    };

    createPhysicsPolygonCollider  (data,sensor=false) {
        let polygon = this.addComponent(cc.PhysicsPolygonCollider);
        polygon.points = [];
        for (let i = 0; i < data.points.length; i++) {
            polygon.points[i] = cc.v2(data.points[i][0],data.points[i][1]);
        }
        polygon.sensor = sensor;
        if (data.restitution) {
            polygon.restitution = data.restitution;
        } else {
            polygon.restitution = USGlobal.GameManager.gameRestitution;
        }


        if (data.density) {
            polygon.density = data.density;
        }

        if (data.friction) {
            polygon.friction = data.friction;
        } else {
            polygon.friction = USGlobal.GameManager.gamefriction;
        }


        polygon.apply();

        this.polygon = polygon;


    };

    createRigidBody(node,data = null) {
        let body = node.addComponent(cc.RigidBody);
        body.angularDamping = 0.7;
        if (data && data.gravity) {
            body.gravityScale = data.gravity;
        }

        return body;
    };


    createNode (data) {
        let node = new cc.Node();
        if (data.color !== undefined) {
            node.color = USGlobal.ConfigData.ColorType[data.color];
        }
        if (data.scale && data.scale.length === 2) {
            node.scaleX = data.scale[0];
            node.scaleY = data.scale[1];
        }

        return node;
    };



}

module.exports = PhysicsNode;


