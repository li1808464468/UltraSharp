// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var MathHelp = {

    pPointDistance: function (point1,point2) {
        var xCount = point1.x - point2.x;
        var yCount = point1.y - point2.y;
        var distance = Math.sqrt(xCount * xCount + yCount * yCount);
        return distance;
    },

    pPointAngle : function (point1,point2) {
        var distance = this.pPointDistance(point1,point2);
        var angle = Math.acos(Math.abs(point2.y - point1.y)/distance);
        var rotation = angle / Math.PI * 180;
        return rotation;
    },


};
module.exports = MathHelp;