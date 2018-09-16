(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/Game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '184e1nwIjpGmKPW+GtNNsQW', 'Game', __filename);
// script/Game.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        majiangPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        console.log("开始游戏，创建对象池");
        //洗牌
        this.initAllMajiang();
        //显示到屏幕上
        var mjSize = this.majiangPool.size();
        console.log("麻将个数：" + mjSize);

        for (var i = 0; i < mjSize; i++) {
            var majiang = this.majiangPool.get();
            //console.log(majiang);
            this.node.addChild(majiang);
        }
    },
    start: function start() {},
    update: function update(dt) {
        //console.log("更新画布",dt)
    },

    initAllMajiang: function initAllMajiang() {
        this.majiangPool = new cc.NodePool();
        var initCount = 13;
        for (var i = 0; i < initCount; ++i) {
            //let mmj = cc.instantiate(this.enemyPrefab); // 创建节点
            //tiao   tong  wan
            //生成一个新麻将
            var mj = this.spawnNewMj("tiao", i + 1);
            //一排，依次排开
            mj.setPosition(this.getNewMjPosition(i));
            this.majiangPool.put(mj); // 通过 putInPool 接口放入对象池
        }
    },
    spawnNewMj: function spawnNewMj(name, numb) {
        console.log("创建麻将：", name, numb);
        //生成一个新麻将
        var newMj = cc.instantiate(this.majiangPrefab);

        console.log("已经new了");
        // 将新增的节点添加到 Canvas 节点下面
        //this.node.addChild(newMj);
        var config = newMj.getComponent('MajiangEntity');
        config.game = this;
        config.type = name;
        config.number = numb;
        return newMj;
    },
    getNewMjPosition: function getNewMjPosition(index) {
        var randX = (index + 1) * 58;
        var randY = 0;

        return cc.v2(randX, randY);
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Game.js.map
        