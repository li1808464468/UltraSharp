// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

const EPSILON = 0.1;
const POINT_SQR_EPSILON = 5;

// 物理组件类型
let TerrainType = cc.Enum({
    // 盒子
    Box: 0,
    // 多边形
    Polygon: 1,
});

// content 可切割可碰撞
// content1 可切割不能和触发器碰撞
let NodeGroup = cc.Enum({
    Default: "default",
    Terrain: "terrain",
    Content: "content",
    Trigger: "trigger",
    Content1: "content1",
});

let GameState = cc.Enum({
    Default: 0,
    Pause:1,
    Succeed:2,
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

            // set: function(newValue) {
            //     cc.log("设置 new value");
            //     if (newValue > 2004) {
            //         this._year = newValue;
            //         this.edition += newValue - 2004;
            //     }
            // },

            // configurable: true,


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
        this.gameState = GameState.Default;
        this.cutCount = 0;
    },
   
   

    start () {
        this.addTouchEvent();


        this.tiledLine.setContentSize(this.tiledLine.getContentSize().width,0);
    },

    createLevelData: function (id) {
        this.levelId = id;
        this.levelData = USGlobal.ConfigData.levelData.get(id);
        this.upPosition = this.node.position;
        this.createPhysicsCollider();
    },

    createPhysicsCollider() {

        let  terrainArray = this.levelData.terrainId;
        for (let i = 0; i < terrainArray.length; i++) {
            let data = USGlobal.ConfigData.terainData.get(terrainArray[i]);
            let node = this.createNode(data);
            node.x = this.levelData.terrainPosition[i][0];
            node.y = this.levelData.terrainPosition[i][1];
            node.group = NodeGroup.Terrain;
            let body = node.addComponent(cc.RigidBody);
            body.type = cc.RigidBodyType.Static;

            if (data.type === TerrainType.Box) {
                this.createPhysicsBoxCollider(node,data);
            } else if (data.type === TerrainType.Polygon) {
                this.createPhysicsPolygonCollider(node,data);
            }

            let collider = node.getComponent(cc.PhysicsBoxCollider);
            this.allColliderArray.push(node);


        }

        let contentArray = this.levelData.contentId;
        for (let i = 0; i < contentArray.length; i++) {
            let data = USGlobal.ConfigData.contentData.get(contentArray[i]);
            console.log(data);
            let node = this.createNode(data);
            node.group = NodeGroup.Content;
            node.x = this.levelData.contentPosition[i][0];
            node.y = this.levelData.contentPosition[i][1];
            let body = node.addComponent(cc.RigidBody);
            body.gravityScale = 3;
            body.enabledContactListener = true;
            body.type = cc.RigidBodyType.Dynamic;
            if (data.type === TerrainType.Box) {
                this.createPhysicsBoxCollider(node,data);
            } else if (data.type === TerrainType.Polygon) {
                this.createPhysicsPolygonCollider(node,data);
            }

            if (data.state) {
                if (data.state === 1) {
                    body.type = cc.RigidBodyType.Static;
                }
            }

            if (data.group) {
                if (data.group === 1) {
                    node.group = NodeGroup.Content1;
                }
            }


            this.allColliderArray.push(node);
        }

        let triggerArray = this.levelData.triggerId;
        for (let i = 0; i < triggerArray.length; i++) {
            let data = USGlobal.ConfigData.triggerData.get(triggerArray[i]);
            let node = this.createNode(data);
            node.group = NodeGroup.Trigger;
            node.x = this.levelData.triggerPosition[i][0];
            node.y = this.levelData.triggerPosition[i][1];
            let body = node.addComponent(cc.RigidBody);
            body.enabledContactListener = true;
            body.type = cc.RigidBodyType.Static;
            let js = node.addComponent("trigger");
            js.onBeginContact = this.onBeginContact.bind(this);


            if (data.type === TerrainType.Box) {
                this.createPhysicsBoxCollider(node,data);
            } else if (data.type === TerrainType.Polygon) {
                this.createPhysicsPolygonCollider(node,data,true);
            }

            this.terrainArray.push(node);
            this.allColliderArray.push(node);
        }




        this.colliderArray.splice(0,this.colliderArray.length);

        for (let i = 0; i < this.node.children.length; i++) {
            var collider = this.node.children[i].getComponent(cc.PhysicsPolygonCollider);
            if (collider) {
                this.colliderArray.push(collider);
            }

        }





    },

    createNode: function (data) {
        let node = new cc.Node();
        this.node.addChild(node);
        if (data.color && data.color.length === 3) {
            node.color = cc.color(data.color[0],data.color[1],data.color[2]);
        }
        if (data.scale && data.scale.length === 2) {
            node.scaleX = data.scale[0];
            node.scaleY = data.scale[1];
        }

        return node;
    },

    createPhysicsBoxCollider: function (node,data) {
        let box = node.addComponent(cc.PhysicsBoxCollider);
        box.size = cc.size(data.size[0],data.size[1]);
        box.apply();
    },

    createPhysicsPolygonCollider: function (node,data,sensor=false) {
        let polygon = node.addComponent(cc.PhysicsPolygonCollider);
        for (let i = 0; i < data.points.length; i++) {
            polygon.points[i] = cc.v2(data.points[i][0],data.points[i][1]);
        }
        polygon.sensor = sensor;

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
                return;
            }

            this.cutCount++;
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


            this.r2.forEach(r => {
                r.fraction = 1 - r.fraction;
            });

            let results = this.results;
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
                    
                    if (!maxPointsResult || splitResult.length > maxPointsResult.length) {
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

                    let newCollider = node.addComponent(cc.PhysicsPolygonCollider);
                    newCollider.points = splitResult;
                    newCollider.apply();
                }
            }


            this.colliderArray.splice(0,this.colliderArray.length);

            for (let i = 0; i < this.node.children.length; i++) {
                var collider = this.node.children[i].getComponent(cc.PhysicsPolygonCollider);
                if (collider) {
                    this.colliderArray.push(collider);
                }

            }



            
            
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
           if (item.collider.node.group === NodeGroup.Content || item.collider.node.group === NodeGroup.Content1) {
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


        let newSplitResult1 = [p1, p2];
        let newSplitResult2 = [p2, p1];

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


        let position = this.node.position;
        if (this.upPosition.x !== position.x || this.upPosition.y !== position.y) {
            for (let i = 0; i < this.allColliderArray.length; i++) {
                let node = this.allColliderArray[i];
                node.x += position.x - this.upPosition.x;
                node.y += position.y - this.upPosition.y;
            }

            this.upPosition = position;
        }





        if (this.colliderArray.length === 0) {
            return;
        }


        this.ctx.clear();

        for (let i = 0; i < this.colliderArray.length; i++) {
            let dataArray = this.colliderArray[i].points;
            for (let j = 0; j < dataArray.length; j++) {
                var worldPosition = this.colliderArray[i].node.convertToWorldSpaceAR(cc.v2(dataArray[j].x,dataArray[j].y));
                var nodePosition = this.node.convertToNodeSpaceAR(worldPosition);

                this.ctx.fillColor = this.colliderArray[i].node.color;
                if (j === 0) {
                    this.ctx.moveTo(nodePosition.x,nodePosition.y);

                } else {
                    this.ctx.lineTo(nodePosition.x,nodePosition.y);
                }

            }

            this.ctx.fill();

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



    onBeginContact: function (contact, selfCollider, otherCollider) {

        if (this.gameState !== GameState.Default) {
            return;
        }


        for (let i = 0; i < this.terrainArray.length; i++) {
            if (selfCollider.node == this.terrainArray[i]){
                selfCollider.node.getComponent("trigger").playDestroyAnimation(0);
                this.terrainArray.splice(i,1);
                break;
            }
        }

        if (this.terrainArray.length == 0) {
            this.gameState = GameState.Succeed;
            this.popupGameOver();
        }

    },



    popupGameOver: function () {
        this.gameOverLayer.active = true;
        if (this.gameState === GameState.Succeed) {
            this.gameOverLayer.getComponent("popupGameOver").showSucceedLayer();
        }

    },


    resumeData: function () {
        this.terrainArray = [];
        this.touchId = -1;
        this.upPosition = cc.Vec2.ZERO;
        this.gameState = GameState.Default;
        this.levelId = -1;
        this.cutCount = 0;
    },


    endGame: function () {

        this.resumeData();
        this.removeAllCollider();

    },


    resumeGame: function () {
        let levelId = this.levelId;
        this.resumeData();
        this.removeAllCollider();

        this.scheduleOnce(()=>{
            this.createLevelData(levelId);
        },0.01);
    },

    nextGame: function () {
        this.gameOverLayer.active = false;
        // this.levelId+= 1;

        this.resumeGame();

    },

});
