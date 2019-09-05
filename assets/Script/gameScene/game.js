// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let Terrain = require("Terrain");
let Content = require("Content");
let Trigger = require("Trigger");
let Joint  = require("Joint");

const EPSILON = 0.1;
const POINT_SQR_EPSILON = 5;




// 游戏状态
let GameState = cc.Enum({
    // 正常
    Default: 0,
    // 暂停
    Pause:1,
    // 成功
    Succeed:2,
    // 失败
    Failure:3,
});

cc.Class({
    extends: cc.Component,

    properties: {
        tiledLine: cc.Node,
        graphicsNode: cc.Node,
        debugGraphics: cc.Node,
        gameOverLayer: cc.Node,
        normalSprite: cc.SpriteFrame,
        topUi: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    onEnable: function () {
        // this.debugDrawFlags = cc.director.getPhysicsManager().debugDrawFlags;
        // cc.director.getPhysicsManager().debugDrawFlags =
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit;

    },

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0,-800);


        this.touching = false;
        this.touchStartPoint = cc.v2(cc.Vec2.ZERO);
        this.touchPoint = cc.v2(cc.Vec2.ZERO);
        // 绘制线段
        this.ctx = this.graphicsNode.getComponent(cc.Graphics);

        var values = [{num:1},{num:2},{num:3}];
        var valueTag = values.every(function (item,index,array) {
            return (item.num > 2);
        });

        var numbers = values.filter(function (item,index,array) {
            return (item.num > 2);
        });


        var number2 = values.map(function (item,index,array) {
            item.num += 2;
            return item;
        });


        var book = {
            _year: 2004,
            edition: 1,
        };

        Object.defineProperty(book,"year",{
            // configurable: true,

            get: function() {
                return this._year;
            },

        });

        this.initData();


        // book.year = 2005;
        




    },

    initData: function () {
        this.touchId = -1;
        this.levelId = -1;
        this.colliderArray = [];
        this.allColliderArray = [];
        this.terrainArray = [];
        // 可以绑定节点的刚体
        this.jointTerrainArray = [];
        this.triggerArray = [];
        this.jointArray = [];
        this.contentArray = [];
        this.updateContentArray = [];
        this.gameState = GameState.Default;
        this.cutCount = 0;
        // 触发碰撞的检测器
        this.collisionArray = [];
        // 可以成功触发检测器的碰撞体
        this.contentCollisionArray = [];
        // 可切割物体的面积
        this.contentSumArea = 0;
        // 减少的可切割物体的面积
        this.contentSubArea = 0;
    },
   
   

    start () {
        this.addTouchEvent();


        this.tiledLine.setContentSize(this.tiledLine.getContentSize().width,0);
    },

    createLevelData: function (id) {
        this.levelId = id;
        this.levelData = USGlobal.ConfigData.levelData.get(id);
        this.upPosition = this.node.position;
        if (this.levelData.levelType === USGlobal.ConfigData.LevelType.ClearContent) {
            let topUi = this.topUi.getComponent("topUI");
            topUi.clearCountNode.active = true;
            topUi.setClearLabelFont(0,0,this.levelData);
        } else {
            this.topUi.getComponent("topUI").clearCountNode.active = false;
        }

        this.createPhysicsCollider();
    },

    createPhysicsCollider() {


        let contentArray = this.levelData.contentId ? this.levelData.contentId : [];
        let contentIndex = 0;
        contentArray.forEach((id)=>{
            let data = USGlobal.ConfigData.contentData.get(id);
            let points = [];
            data.points.forEach((data)=>{
                let p =  {};
                p.x = data[0];
                p.y = data[1];
                points.push(p);
            });


            let node = new Content(data);
            this.node.addChild(node);
            node.x = this.levelData.contentPosition[contentIndex][0];
            node.y = this.levelData.contentPosition[contentIndex][1];
            contentIndex++;
            node.indexId = id;
            if (node.group === USGlobal.ConfigData.NodeGroup.Content || node.group === USGlobal.ConfigData.NodeGroup.Content2) {
                this.contentCollisionArray.push(node);
            }

            if (node.group !== USGlobal.ConfigData.NodeGroup.Content1)  {
                this.updateContentArray.push(node);
                this.contentSumArea += USGlobal.HelpManager.getPolygonArea(points);
            }


            this.contentArray.push(node);




            this.allColliderArray.push(node);
        });


        let  terrainArray = this.levelData.terrainId ? this.levelData.terrainId : [];
        let terrainIndex = 0;
        terrainArray.forEach((id)=>{
            let data = USGlobal.ConfigData.terainData.get(id);
            let terrain = new Terrain(data);
            this.node.addChild(terrain);
            terrain.x = this.levelData.terrainPosition[terrainIndex][0];
            terrain.y = this.levelData.terrainPosition[terrainIndex][1];
            terrainIndex++;

            if (data.joint) {
                this.jointTerrainArray.push(terrain);
            }


            this.terrainArray.push(terrain);
            this.allColliderArray.push(terrain);
        });





        let triggerArray = this.levelData.triggerId ? this.levelData.triggerId : [];
        let triggerIndex = 0;
        triggerArray.forEach((id)=>{
            let data = USGlobal.ConfigData.triggerData.get(id);
            let node = new Trigger(data);
            this.node.addChild(node);
            node.x = this.levelData.triggerPosition[triggerIndex][0];
            node.y = this.levelData.triggerPosition[triggerIndex][1];
            triggerIndex++;


            this.triggerArray.push(node);
            this.allColliderArray.push(node);
        });

        let jointArray = this.levelData.joinId ? this.levelData.joinId : [];
        let joinIndex = 0;
        jointArray.forEach((id)=>{
            let data = USGlobal.ConfigData.joinData.get(id);
            data.position = cc.v2(this.levelData.joinPosition[joinIndex][0],this.levelData.joinPosition[joinIndex][1]);
            let node = new Joint(data,this);
            this.node.addChild(node);
            // node.x = this.levelData.joinPosition[joinIndex][0];
            // node.y = this.levelData.joinPosition[joinIndex][1];

            if (data.joinType === USGlobal.ConfigData.JoinGroup.RevoluteJoint) {

                node.joint.connectedAnchor = cc.v2(this.levelData.connectedAnchor[joinIndex][0],this.levelData.connectedAnchor[joinIndex][1]);

            } else if (data.joinType === USGlobal.ConfigData.JoinGroup.LineJoint || data.joinType === USGlobal.ConfigData.JoinGroup.LineJoint1) {


                node.joint.connectedAnchor = cc.v2(this.levelData.connectedAnchor[joinIndex][0],this.levelData.connectedAnchor[joinIndex][1]);

                node.endNode.x = node.x + data.endPosition[0];
                node.endNode.y = node.y + data.endPosition[1];



            }

            this.jointArray.push(node);
            this.allColliderArray.push(node);

            joinIndex++;

        });




        this.colliderArray.splice(0,this.colliderArray.length);

        for (let i = 0; i < this.node.children.length; i++) {
            var collider = this.node.children[i].getComponent(cc.PhysicsPolygonCollider);
            if (collider) {
                this.colliderArray.push(collider);
            }

        }
        this.changeJoint();


    },

    createNode: function (data) {
        let node = new cc.Node();
        this.node.addChild(node);
        if (data.color !== undefined) {
            node.color = USGlobal.ConfigData.ColorType[data.color];
        }
        if (data.scale && data.scale.length === 2) {
            node.scaleX = data.scale[0];
            node.scaleY = data.scale[1];
        }

        return node;
    },


    createRigidBody(node,data = null) {
        let body = node.addComponent(cc.RigidBody);
        body.angularDamping = 0.7;
        if (data && data.gravity) {
            body.gravityScale = data.gravity;
        }

        return body;
    },

    createPhysicsBoxCollider: function (node,data) {
        let box = node.addComponent(cc.PhysicsBoxCollider);
        box.size = cc.size(data.size[0],data.size[1]);
        box.apply();
    },

    createPhysicsPolygonCollider: function (node,data,sensor=false) {
        let polygon = node.addComponent(cc.PhysicsPolygonCollider);
        polygon.points = [];
        for (let i = 0; i < data.points.length; i++) {
            polygon.points[i] = cc.v2(data.points[i][0],data.points[i][1]);
        }
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
    },

    addTouchEvent: function () {
        var touchStart = function (touch) {
            if (this.touchId === -1) {
                this.touchId = touch.getID();
                this.tiledLine.active = true;
                var position = this.node.convertToNodeSpaceAR(touch.getLocation());
                // cc.log("touch x = %f, touch y = %f",position.x,position.y);
                this.tiledLine.setPosition(position);
                this.touchStartPoint = this.touchPoint = cc.v2(touch.getLocation());
                this.touching = true;
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
            var distance = p1.sub(p2).mag();
            this.tiledLine.setContentSize(this.tiledLine.getContentSize().width,distance);
            this.tiledLine.scaleY = state;

            var rotation = USGlobal.HelpManager.pPointAngle(p1,p2);

            if (p1.y > p2.y && p1.x < p2.x) {
                rotation *= -1;
            } else if (p1.y < p2.y && p1.x > p2.x) {
                rotation *= -1;
            }
            // cc.log("angle = %f rotation = %f",angle,rotation);
            this.tiledLine.rotation = rotation;

        }.bind(this);

        var touchEnd = function (touch) {
            if (touch.getID() !== this.touchId) {
                return;touchEnd
            }





            this.touchId = -1;
            this.tiledLine.active = false;
            this.tiledLine.setContentSize(this.tiledLine.getContentSize().width,0);
            this.touchPoint = cc.v2(touch.getLocation());
            this.recalcResults();
            this.touching = false;
            let point = cc.v2(touch.getLocation());

            if (this.equals(this.touchStartPoint.sub(point).magSqr(),0)) {
                return;
            }

            // 如果是关卡类型1 切割次数超过关卡要求次数跳过切割
            if (this.levelData.levelType === USGlobal.ConfigData.LevelType.ClearContent && this.cutCount >= this.levelData.count)
            {
                return;
            }

            this.r2.forEach(r => {
                r.fraction = 1 - r.fraction;
            });

            let results = this.results;
            if (results.length > 1) {
                this.cutCount++;
                this.setTopUILabel();
            }






            let pairs = [];
            for (let i = 0; i < results.length; i++) {
                let find = false;
                let result = results[i];
                for (let j = 0; j < pairs.length; j++) {
                    let pair = pairs[j];
                    if (pair[0] && result.collider === pair[0].collider) {
                        find = true;
                        let r = pair.find((r) => {
                            return r.point.sub(result.point).magSqr() <= POINT_SQR_EPSILON;
                        });

                        if (r) {
                            pair.splice(pair.indexOf(r),1);
                        } else {
                            pair.push(result);
                        }

                        break;
                    }
                }

                if (!find) {
                    pairs.push([result]);
                }
            }



            for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i];


                if (pair.length < 2) {
                    continue;
                }

                pair = pair.sort(this.compare);
                let splitResults = [];
                for (let j = 0; j < (pair.length - 1); j += 2) {
                    let r1 = pair[j];
                    let r2 = pair[j+1];
                    if (r1 && r2) {
                        this.split(r1.collider,r1.point,r2.point,splitResults);
                    }
                }
                
                
                if (splitResults.length <=  0) {
                    continue;
                } 
                
                let collider = pair[0].collider;
                let maxPointsResult;
                for (let j = 0; j < splitResults.length; j++) {
                    let splitResult = splitResults[j];
                    for (let k = 0; k < splitResult.length; k++) {
                        if (typeof splitResult[k] === 'number') {
                            splitResult[k] = collider.points[splitResult[k]];
                        } 
                    }

                    let s0 = 0;
                    let s1 = 0;

                    if (maxPointsResult) {
                        s0 = USGlobal.HelpManager.getPolygonArea(maxPointsResult);
                        s1 = USGlobal.HelpManager.getPolygonArea(splitResult);
                    }

                    // 将面积大的保留
                    if (!maxPointsResult || s1 > s0) {
                        maxPointsResult = splitResult;
                    }
                }

                if (maxPointsResult.length < 3) {
                    continue;
                }
                collider.points = maxPointsResult;
                collider.apply();

                let body = collider.body;
                for (let j = 0; j < splitResults.length; j++) {
                    let splitResult = splitResults[j];
                    if (splitResult.length < 3) {
                        continue;
                    }
                    if (splitResult == maxPointsResult) {
                        continue;
                    }

                    let node = new cc.Node();
                    node.group = body.node.group;
                    node.position = this.node.convertToNodeSpaceAR(body.getWorldPosition());
                    node.rotation = body.getWorldRotation();
                    node.parent = this.node;
                    node.color = collider.node.color;

                    let bodyCollider = node.addComponent(cc.RigidBody);
                    bodyCollider.enabledContactListener = true;
                    bodyCollider.gravityScale = body.gravityScale;
                    bodyCollider.linearVelocity = body.linearVelocity;
                    bodyCollider.linearDamping = body.linearDamping;
                    bodyCollider.angularDamping = body.angularDamping;
                    bodyCollider.restitution = body.restitution;
                    bodyCollider.friction = body.friction;
                    node.zIndex = body.node.zIndex;

                    let newCollider = node.addComponent(cc.PhysicsPolygonCollider);
                    newCollider.points = splitResult;

                    newCollider.density = 0.1;
                    newCollider.apply();


                    let data = newCollider.points.filter((p)=>{
                        let worldPosition = newCollider.node.convertToWorldSpaceAR(p);
                        if (worldPosition.x > cc.winSize.width  || worldPosition.x < 0 ) {
                            return p;
                        }

                        if (worldPosition.y > cc.winSize.height || worldPosition.y < 0)
                        {
                            return p;
                        }

                    });

                    if (data.length > 0) {
                        bodyCollider.type = cc.RigidBodyType.Static;
                    }


                    if (node.group === USGlobal.ConfigData.NodeGroup.Content || node.group === USGlobal.ConfigData.NodeGroup.Content2) {
                        this.contentCollisionArray.push(node);
                    }

                    if (node.group !== USGlobal.ConfigData.NodeGroup.Content1) {
                        this.updateContentArray.push(node);
                    }

                    this.contentArray.push(node);
                }
            }



            this.colliderArray.splice(0,this.colliderArray.length);

            for (let i = 0; i < this.node.children.length; i++) {
                var collider = this.node.children[i].getComponent(cc.PhysicsPolygonCollider);
                if (collider) {
                    this.colliderArray.push(collider);
                }

            }

            this.changeJoint();


            
            
        }.bind(this);
        this.node.on("touchstart", touchStart);
        this.node.on('touchmove', touchMove);
        this.node.on('touchend', touchEnd);
        this.node.on('touchcancel', touchEnd);
    },

    // 查找碰撞点并通过圆形图片绘制
    recalcResults: function () {
        if ( this.touching === false) {
            return;
        }
        let startPoint = this.touchStartPoint;
        let point = this.touchPoint;

        let manager = cc.director.getPhysicsManager();
        let r1 = manager.rayCast(this.touchStartPoint, point, cc.RayCastType.All);
        let r2 = manager.rayCast(point, this.touchStartPoint, cc.RayCastType.All);

        let result = r1.concat(r2);
        let results = result.filter((item) => {
           if (item.collider.node.group === USGlobal.ConfigData.NodeGroup.Content || item.collider.node.group === USGlobal.ConfigData.NodeGroup.Content1) {
               return item;
           }
        });
        // this.ctx.clear();
        // for (let i = 0; i < results.length; i++) {
        //     let p = results[i].point;
        //     this.ctx.circle(p.x, p.y, 5);
        // }
        // this.ctx.fill();

        this.r1 = r1;
        this.r2 = r2;
        this.results = results;

    },

    // 判断两点是否小于0.1
    equals: function (a, b, epsilon) {
        epsilon = epsilon === undefined ? EPSILON : epsilon;
        return Math.abs(a-b) < epsilon;
    },

    compare: function(a, b) {
        if (a.fraction > b.fraction) {
            return 1;
        } else if (a.fraction < b.fraction) {
            return -1;

        }
        return 0;
    },

    split: function (collider, p1, p2, splitResults) {
        let body = collider.body;
        let points = collider.points;


        // The manager.rayCast() method returns points in world coordinates, so use the body.getLocalPoint() to convert them to local coordinates.
        p1 = body.getLocalPoint(p1);
        p2 = body.getLocalPoint(p2);

        // 让分割线多出一像素的空白
        let p3 = cc.v2(p1);
        let p4 = cc.v2(p2);
        p1.x -= 0.5;
        p2.x -= 0.5;

        p3.x += 0.5;
        p4.x += 0.5;



        let newSplitResult1 = [p1, p2];
        let newSplitResult2 = [p4, p3];

        let index1, index2;
        for (let i = 0; i < points.length; i++) {
            let pp1 = points[i];
            let pp2 = i === points.length - 1 ? points[0] : points[i+1];

            if (index1 === undefined && this.pointInLine(p1, pp1, pp2)) {
                index1 = i;
            }
            else if (index2 === undefined && this.pointInLine(p2, pp1, pp2)) {
                index2 = i;
            }

            if (index1 !== undefined && index2 !== undefined) {
                break;
            }
        }

        // console.log(index1 + ' : ' + index2);

        if (index1 === undefined || index2 === undefined) {
            debugger
            return;
        }

        let splitResult, indiceIndex1 = index1, indiceIndex2 = index2;
        if (splitResults.length > 0) {
            for (let i = 0; i < splitResults.length; i++) {
                let indices = splitResults[i];
                indiceIndex1 = indices.indexOf(index1);
                indiceIndex2 = indices.indexOf(index2);

                if (indiceIndex1 !== -1 && indiceIndex2 !== -1) {
                    splitResult = splitResults.splice(i, 1)[0];
                    break;
                }
            }
        }

        if (!splitResult) {
            splitResult = points.map((p, i) => {
                return i;
            });
        }

        for (let i = indiceIndex1 + 1; i !== (indiceIndex2+1); i++) {
            if (i >= splitResult.length) {
                i = 0;
            }

            let p = splitResult[i];
            p = typeof p === 'number' ? points[p] : p;

            if (p.sub(p1).magSqr() < POINT_SQR_EPSILON || p.sub(p2).magSqr() < POINT_SQR_EPSILON) {
                continue;
            }

            newSplitResult2.push(splitResult[i]);
        }

        for (let i = indiceIndex2 + 1; i !== indiceIndex1+1; i++) {
            if (i >= splitResult.length) {
                i = 0;
            }

            let p = splitResult[i];
            p = typeof p === 'number' ? points[p] : p;

            if (p.sub(p1).magSqr() < POINT_SQR_EPSILON || p.sub(p2).magSqr() < POINT_SQR_EPSILON) {
                continue;
            }

            newSplitResult1.push(splitResult[i]);
        }

        splitResults.push(newSplitResult1);
        splitResults.push(newSplitResult2);
    },

    pointInLine: function (point, a, b) {
        return cc.Intersection.pointLineDistance(point, a, b, true) < 1;
    },

    update (dt) {
        this.updateAllPosition();
        this.drawAllNode();
        this.updateCollision();
        this.updateContent();
    },

    // 进入游戏场景和退出游戏场景时，手动更新所有的物理组件的坐标
    updateAllPosition() {
        let position = this.node.position;
        if (this.upPosition.x !== position.x || this.upPosition.y !== position.y) {
            for (let i = 0; i < this.allColliderArray.length; i++) {
                let node = this.allColliderArray[i];
                node.x += position.x - this.upPosition.x;
                node.y += position.y - this.upPosition.y;
            }

            this.upPosition = position;
        }
    },


    // 绘制所有物理组件
    drawAllNode () {
        if (this.colliderArray.length === 0) {
            return;
        }


        this.ctx.clear();

        let array = this.colliderArray.sort((collider1,collider2)=>{
            return collider1.node.zIndex - collider2.node.zIndex;
        });

        array.forEach((collider)=>{
            let pointArray = collider.points;
            let id = 0;
            pointArray.forEach((point)=>{
                let worldPosition = collider.node.convertToWorldSpaceAR(cc.v2(point.x,point.y));
                let nodePosition = this.node.convertToNodeSpaceAR(worldPosition);
                this.ctx.fillColor = collider.node.color;
                if (id === 0) {
                    this.ctx.moveTo(nodePosition.x,nodePosition.y);
                } else {
                    this.ctx.lineTo(nodePosition.x,nodePosition.y);
                }
                id++;

            });
            this.ctx.fill();
        });
    },

    updateCollision: function () {

        this.collisionArray = [];
        for (let i = 0; i < this.triggerArray.length; i++) {
            let trigger = this.triggerArray[i];
            let points = trigger.getComponent(cc.PhysicsPolygonCollider).points;
            let tag =points.find((points)=>{
                let contentTag = false;
                let worldPosition = trigger.convertToWorldSpaceAR(points);
                this.contentCollisionArray.forEach((content)=>{
                    let p = content.convertToNodeSpaceAR(worldPosition);
                    let polygon = content.getComponent(cc.PhysicsPolygonCollider);
                    if (cc.Intersection.pointInPolygon(p,polygon.points)) {
                        contentTag = true;
                        return
                    }
                });

                return contentTag;
            });


            if (tag) {
                cc.log("检测到碰撞体");
                this.triggerArray.splice(i,1);
                this.collisionArray.push(trigger);
                i--;
            }

        }


        if (this.collisionArray.length > 0) {
            this.onBeginContact();
        }


    },


    updateContent () {
        if (this.levelData.levelType !== USGlobal.ConfigData.LevelType.ClearContent) {
            return;
        }

        for (let i = this.updateContentArray.length - 1; i >= 0 ; i--) {
            let content = this.updateContentArray[i];
            if (content.y <= -cc.winSize.height * 0.5 - 200) {
                this.updateContentArray.splice(i,1);
                let polygon = content.getComponent(cc.PhysicsPolygonCollider);
                this.contentSubArea += USGlobal.HelpManager.getPolygonArea(polygon.points);
                this.onBeginContact();
                this.setTopUILabel();
            }
        }

    },


    removeAllCollider: function () {
        cc.log("清除所有图形");
        while (this.allColliderArray.length > 0) {
            let collider = this.allColliderArray.pop();
            collider.destroy();
        }

        while (this.colliderArray.length > 0) {
            let collider = this.colliderArray.pop();
            collider.node.destroy();
        }
    },







    onBeginContact: function () {


        this.collisionArray.forEach((collision)=>{
            collision.playDestroyAnimation(0,this.colliderArray);
        });


        if (this.levelData.levelType === USGlobal.ConfigData.LevelType.ClearStar &&  this.triggerArray.length == 0) {
            this.gameState = GameState.Succeed;
            this.popupGameOver();
        } else if (this.levelData.levelType === USGlobal.ConfigData.LevelType.ClearContent)
        {
            if (this.updateContentArray.length === 0)
            {
                this.gameState = GameState.Succeed;
                this.popupGameOver();
            }
        }

    },



    popupGameOver: function () {
        this.gameOverLayer.active = true;
        if (this.gameState === GameState.Succeed) {
            this.gameOverLayer.getComponent("popupGameOver").showSucceedLayer();
        }

    },


    resumeData: function () {
        this.upPosition = cc.Vec2.ZERO;
        this.initData();

    },


    endGame: function () {
        this.removeAllCollider();
        this.resumeData();

    },


    resumeGame: function () {
        let levelId = this.levelId;
        this.endGame();

        this.scheduleOnce(()=>{
            this.createLevelData(levelId);
        },0.01);
    },

    nextGame: function () {
        this.gameOverLayer.active = false;
        this.levelId+= 1;

        this.resumeGame();

    },

    changeJoint() {

        this.contentArray.forEach((node)=>{
            let collider = node.getComponent(cc.PhysicsPolygonCollider);
            if (collider) {
                this.jointArray.forEach((jointNode)=>{
                    let point = jointNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
                    let nodePoint = node.convertToNodeSpaceAR(point);
                    if (cc.Intersection.pointInPolygon(nodePoint,collider.points)) {
                        let rigidBody = node.getComponent(cc.RigidBody);
                        if (rigidBody) {
                            let data = jointNode.data;
                            if (jointNode.jointType === USGlobal.ConfigData.JoinGroup.RevoluteJoint || jointNode.jointType === USGlobal.ConfigData.JoinGroup.LineJoint) {
                                let joint = jointNode.getComponent(cc.RevoluteJoint);
                                joint.connectedBody = rigidBody;
                                joint.apply();
                            } else if (jointNode.jointType === USGlobal.ConfigData.JoinGroup.LineJoint1) {
                                if (jointNode.joint) {
                                    jointNode.joint.connectedBody = rigidBody;
                                    jointNode.joint.connectedAnchor = cc.v2(jointNode.data.endConnectedAnchor[0],jointNode.data.endConnectedAnchor[1]);
                                    jointNode.joint.apply();
                                }

                            }
                        }
                    }
                });

            }
        });



        this.jointTerrainArray.forEach((node)=>{
            let collider = node.getComponent(cc.PhysicsPolygonCollider);
            if (collider) {
                this.jointArray.forEach((jointNode)=>{
                    let point = jointNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
                    let nodePoint = node.convertToNodeSpaceAR(point);
                    if (cc.Intersection.pointInPolygon(nodePoint,collider.points)) {
                        let rigidBody = node.getComponent(cc.RigidBody);
                        if (rigidBody) {
                            let data = jointNode.data;
                            if (jointNode.jointType === USGlobal.ConfigData.JoinGroup.RevoluteJoint || jointNode.jointType === USGlobal.ConfigData.JoinGroup.LineJoint) {
                                let joint = jointNode.getComponent(cc.RevoluteJoint);
                                joint.connectedBody = rigidBody;
                                joint.apply();
                            } else if (jointNode.jointType === USGlobal.ConfigData.JoinGroup.LineJoint1) {
                                if (jointNode.joint) {
                                    jointNode.joint.connectedBody = rigidBody;

                                    jointNode.joint.connectedAnchor = cc.v2(jointNode.data.endConnectedAnchor[0],jointNode.data.endConnectedAnchor[1]);
                                    jointNode.joint.apply();
                                }

                            }
                        }
                    }
                });

            }
        });


    },

    setTopUILabel () {
        if (this.levelData.levelType !== USGlobal.ConfigData.LevelType.ClearContent) {
            return;
        }

        let topUi = this.topUi.getComponent("topUI");
        topUi.setClearLabelFont(this.cutCount,Math.floor(this.contentSubArea / this.contentSumArea * 100),this.levelData);
    },

});
