require=function c(r,a,s){function h(i,t){if(!a[i]){if(!r[i]){var n="function"==typeof require&&require;if(!t&&n)return n(i,!0);if(u)return u(i,!0);var e=new Error("Cannot find module '"+i+"'");throw e.code="MODULE_NOT_FOUND",e}var o=a[i]={exports:{}};r[i][0].call(o.exports,function(t){return h(r[i][1][t]||t)},o,o.exports,c,r,a,s)}return a[i].exports}for(var u="function"==typeof require&&require,t=0;t<s.length;t++)h(s[t]);return h}({MathHelp:[function(t,i,n){"use strict";cc._RF.push(i,"30353iTmOxCM6oVd9FuqhSt","MathHelp");var e={pPointDistance:function(t,i){var n=t.x-i.x,e=t.y-i.y;return Math.sqrt(n*n+e*e)},pPointAngle:function(t,i){var n=this.pPointDistance(t,i);return Math.acos(Math.abs(i.y-t.y)/n)/Math.PI*180}};i.exports=e,cc._RF.pop()},{}],config:[function(t,i,n){"use strict";cc._RF.push(i,"37550KuBz5BWra/IrdP9J01","config"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){cc.log("config"),window.USGlobal={MathHelp:t("MathHelp")}},start:function(){}}),cc._RF.pop()},{MathHelp:"MathHelp"}],game:[function(t,i,n){"use strict";cc._RF.push(i,"96b1bDB7ldCypYr2kV6QpmC","game");cc.Class({extends:cc.Component,properties:{tiledLine:cc.Node,box:cc.Node,graphicsNode:cc.Node},onEnable:function(){this.debugDrawFlags=cc.director.getPhysicsManager().debugDrawFlags,cc.director.getPhysicsManager().debugDrawFlags=cc.PhysicsManager.DrawBits.e_jointBit|cc.PhysicsManager.DrawBits.e_shapeBit},onLoad:function(){cc.director.getPhysicsManager().enabled=!0,this.touching=!1,this.touchStartPoint=cc.p(cc.Vec2.ZERO),this.touchPoint=cc.p(cc.Vec2.ZERO),this.ctx=this.graphicsNode.getComponent(cc.Graphics),cc.log("game");var t=[{num:1},{num:2},{num:3}],i=t.every(function(t,i,n){return 2<t.num});cc.log("value Tag "+i),t.filter(function(t,i,n){return 2<t.num}).forEach(function(t,i,n){cc.log("item num = "+t.num)}),t.map(function(t,i,n){return t.num+=2,t}).forEach(function(t){cc.log("item2 num = "+t.num)});var n={_year:2004,edition:1};Object.defineProperty(n,"year",{get:function(){return this._year}}),cc.log("book year = %d",n.year),cc.log(Object.getOwnPropertyDescriptor(n,"year"))},start:function(){this.initData(),this.addTouchEvent(),this.tiledLine.setContentSize(this.tiledLine.getContentSize().width,0)},initData:function(){this.touchId=-1},addTouchEvent:function(){var t=function(t){if(-1===this.touchId){this.touchId=t.getID(),this.tiledLine.active=!0;var i=this.node.convertToNodeSpaceAR(t.getLocation());this.tiledLine.setPosition(i),this.touchStartPoint=this.touchPoint=cc.v2(t.getLocation()),this.touching=!0}}.bind(this),i=function(t){if(t.getID()===this.touchId){var i=this.node.convertToWorldSpaceAR(t.getLocation()),n=this.node.convertToWorldSpaceAR(t.getStartLocation()),e=i.y>=n.y?1:-1,o=(i.x,n.x,cc.pDistance(i,n));this.tiledLine.setContentSize(this.tiledLine.getContentSize().width,o),this.tiledLine.setScaleY(e);var c=USGlobal.MathHelp.pPointAngle(i,n);i.y>n.y&&i.x<n.x?c*=-1:i.y<n.y&&i.x>n.x&&(c*=-1),this.tiledLine.rotation=c}}.bind(this),n=function(t){if(t.getID()===this.touchId){this.touchId=-1,this.tiledLine.active=!1,this.tiledLine.setContentSize(this.tiledLine.getContentSize().width,0),this.touchPoint=cc.v2(t.getLocation()),this.recalcResults(),this.touching=!1;var i=cc.v2(t.getLocation());if(!this.equals(this.touchStartPoint.sub(i).magSqr(),0)){this.r2.forEach(function(t){t.fraction=1-t.fraction});for(var r=this.results,a=[],n=function(t){for(var i=!1,n=r[t],e=0;e<a.length;e++){var o=a[e];if(o[0]&&n.collider===o[0].collider){i=!0;var c=o.find(function(t){return t.point.sub(n.point).magSqr()<=5});c?o.splice(o.indexOf(c),1):o.push(n);break}}i||a.push([n])},e=0;e<r.length;e++)n(e);for(e=0;e<a.length;e++){var o=a[e];if(!(o.length<2)){o=o.sort(this.compare);for(var c=[],s=0;s<o.length-1;s+=2){var h=o[s],u=o[s+1];h&&u&&this.split(h.collider,h.point,u.point,c)}if(!(c.length<=0)){for(var l=o[0].collider,d=void 0,f=0;f<c.length;f++){for(var p=c[f],g=0;g<p.length;g++)"number"==typeof p[g]&&(p[g]=l.points[p[g]]);(!d||p.length>d.length)&&(d=p)}if(!(d.length<3)){l.points=d,l.apply();for(var v=l.body,y=0;y<c.length;y++){var m=c[y];if(!(m.length<3)&&m!=d){var b=new cc.Node;b.position=v.getWorldPosition(),b.rotation=v.getWorldRotation(),b.parent=cc.director.getScene(),b.addComponent(cc.RigidBody);var P=b.addComponent(cc.PhysicsPolygonCollider);P.points=m,P.apply()}}}}}}}}}.bind(this);this.node.on("touchstart",t),this.node.on("touchmove",i),this.node.on("touchend",n),this.node.on("touchcancel",n)},recalcResults:function(){if(!1!==this.touching){this.touchStartPoint;var t=this.touchPoint,i=cc.director.getPhysicsManager(),n=i.rayCast(this.touchStartPoint,t,cc.RayCastType.All),e=i.rayCast(t,this.touchStartPoint,cc.RayCastType.All),o=n.concat(e).filter(function(t){if("terrain"!==t.collider.node.group)return t});this.ctx.clear();for(var c=0;c<o.length;c++){var r=o[c].point;this.ctx.circle(r.x,r.y,5)}this.ctx.fill(),this.r1=n,this.r2=e,this.results=o}},equals:function(t,i,n){return n=void 0===n?.1:n,Math.abs(t-i)<n},compare:function(t,i){return t.fraction>i.fraction?1:t.fraction<i.fraction?-1:0},split:function(t,i,n,e){for(var o=t.body,c=t.points,r=[i=o.getLocalPoint(i),n=o.getLocalPoint(n)],a=[n,i],s=void 0,h=void 0,u=0;u<c.length;u++){var l=c[u],d=u===c.length-1?c[0]:c[u+1];if(void 0===s&&this.pointInLine(i,l,d)?s=u:void 0===h&&this.pointInLine(n,l,d)&&(h=u),void 0!==s&&void 0!==h)break}if(void 0!==s&&void 0!==h){var f=void 0,p=s,g=h;if(0<e.length)for(var v=0;v<e.length;v++){var y=e[v];if(p=y.indexOf(s),g=y.indexOf(h),-1!==p&&-1!==g){f=e.splice(v,1)[0];break}}f||(f=c.map(function(t,i){return i}));for(var m=p+1;m!==g+1;m++){m>=f.length&&(m=0);var b=f[m];(b="number"==typeof b?c[b]:b).sub(i).magSqr()<5||b.sub(n).magSqr()<5||a.push(f[m])}for(var P=g+1;P!==p+1;P++){P>=f.length&&(P=0);var L=f[P];(L="number"==typeof L?c[L]:L).sub(i).magSqr()<5||L.sub(n).magSqr()<5||r.push(f[P])}e.push(r),e.push(a)}},pointInLine:function(t,i,n){return cc.Intersection.pointLineDistance(t,i,n,!0)<1}}),cc._RF.pop()},{}]},{},["config","game","MathHelp"]);