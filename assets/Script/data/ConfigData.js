// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var ConfigData = {
    // 关卡数据
    levelData: new Map(),
    // 地形数据
    terainData: new Map(),
    // 场内可切除数据
    contentData: new Map(),
    // 检测器
    triggerData: new Map(),
    // 关节数据
    joinData: new Map(),

    
    NodeGroup: {
        Default: "default",
        // 地形1
        Terrain: "terrain",
        // 可切割可触发类型
        Content: "content",
        // 触发器
        Trigger: "trigger",
        // 可切割不能触发检测器
        Content1: "content1",
        // 地形2
        Terrain1: "terrain1",
        // 可触发检测器但是不能切割
        Content2: "content2",
        // 地形3
        Terrain2: "terrain2",
    },


    // 物理组件类型
    RigidBodyType: {
        // 动态
        Dynamic: 0,
        // 静态
        Static: 1,
    },


    // 物理组件类型
    TerrainType: {
        // 盒子
        Box: 0,
        // 多边形
        Polygon: 1,
    },


    // 节点类型
    JoinGroup: {
        // 滑轮
        RevoluteJoint: 0,
        // 一端固定到屏幕上的绳子
        LineJoint: 1,
        // 两端都是固定到可动物体上的绳子
        LineJoint1: 2,
    },


    ColorType: [
        // 白
        cc.color(255,255,255),
        // 浅蓝
        cc.color(29,155,204),
        // 深黄
        cc.color(240,213,21),
        // 黑
        cc.color(0,0,0),
        // 黄
        cc.color(162,132,14)
    ],



};



module.exports = ConfigData;

