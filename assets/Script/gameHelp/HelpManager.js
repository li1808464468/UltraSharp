// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var HelpManager = {
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

    // 获取当前时间 返回值 秒
    getCurTime: function () {
        var curTime = Date.now();
        curTime = parseInt(curTime/1000);
        return curTime;
    },

    // 获取当前时间 返回值 毫秒
    getCurTimeMs: function () {
        var curTime = Date.now();
        curTime = parseFloat(curTime);
        return curTime;
    },


    // 判断距离上次是否是新的一天
    // time1 time2 都为毫秒
    // 为true表示是同一天 false表示是新一天
    judgeNewDay: function (time1,time2) {
        let date1 = new Date(time1);
        let date2= new Date(time2);


        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    },

    // 判断相差多少天
    // time1 time2 为毫秒 time1 为起始时间 time2 为结束时间
    getDataDiff: function (time1,time2) {

        var startDate = this.formatDate(new Date(time1));
        var endDate = this.formatDate(new Date(time2));


        var startTime = new Date(Date.parse(startDate.replace(/-/g,"/"))).getTime();
        var endTime = new Date(Date.parse(endDate.replace(/-/g,"/"))).getTime();

        var dates = Math.floor((startTime - endTime))/(1000*60*60*24);
        return  Math.abs(dates);
    },

    // 将时间戳转换位普通日期
    formatDate: function (now) {
        var   year=now.getFullYear();   //获取获取当前年份
        var   month=now.getMonth()+1;   //获取获取当前月份
        var   date=now.getDate();       //获取获取当前日期
        var   hour=now.getHours();      //获取时
        var   minute=now.getMinutes();  //获取分
        var   second=now.getSeconds();  //获取秒
        //时间格式 ：年-月-日
        return   year+"-"+month+"-"+date;
    },




    // 返回一个minNum 到 maxNum 范围中的一个随机数
    getRandomNum: function (minNum,maxNum) {
        return Math.floor(Math.random()*(maxNum-minNum+1)+minNum);
    },

    arrayLastAddData: function (array,data) {

        if (!data) {
            console.log("向数组最后添加数据时传递的数据为空");
        }

        if (!array instanceof Array) {
            console.log("向数组最后添加数据时传递的对象不是数组");
        }


        array.splice(array.length,0,data);
    },


    // array2 拷贝之后的数组  浅拷贝
    copyArrayData: function (array1,array2) {

        if (!array1 instanceof Array || !array2 instanceof Array) {
            console.log("向数组最后添加数据时传递的对象不是数组");
        }

        array2.splice(0,array2.length);

        array1.forEach((data) => {
            array2.push(data);
        });

    },

    // 停止一个node上的所有粒子效果
    stopNodeParticleSystem: function (node) {
        node.children.forEach((node)=>{
            var system = node.getComponent(cc.ParticleSystem);
            if (system) {
                system.stopSystem();
            }

            node.children.forEach((node)=> {
                this.stopNodeParticleSystem(node);
            })

        });

    },

    // 恢复一个node上的所有粒子效果
    resetNodeParticleSystem: function (node) {
        node.children.forEach((node)=>{
            var system = node.getComponent(cc.ParticleSystem);
            if (system) {
                system.resetSystem();
            }

            node.children.forEach((node)=> {
                this.resetNodeParticleSystem(node);
            })

        });
    },
};

module.exports = HelpManager;
