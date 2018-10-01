(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/Dustbin.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a6863BOUDFGD5eLX80/58es', 'Dustbin', __filename);
// script/Dustbin.js

"use strict";

/**
 * 垃圾桶，飞进去的效果
 */
cc.Class({
  extends: cc.Component,

  properties: {
    //打出去的牌
    outPrefab: {
      default: null,
      type: cc.Prefab
    },
    //单个麻将宽度
    majiangWidth: 58,
    //单个麻将高度
    majiangHeight: 84,
    //麻将间隙，适用于所有横的排列
    majiangJianxi: 4,
    //是否有新牌
    //hasNewMajiang: false,
    //默认缩放，需要和自己的新牌保持一致
    initScale: 0.5,
    //手里牌列表
    //shouliList: [],
    realMjWidth: 0,
    realMjHeight: 0,
    lineCount: 10,
    //打出去的麻将数组，方便以后高亮显示
    outMjs: []
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad: function onLoad() {
    this.realMjWidth = (this.majiangWidth - this.majiangJianxi) * this.initScale;
    this.realMjHeight = (this.majiangHeight - this.majiangJianxi) * this.initScale;
  },
  start: function start() {},

  addNewMj: function addNewMj(outmj) {
    this.outMjs.push(outmj);
    this.game.outMjs.push(outmj);
    this.scheduleOnce(function () {
      console.log("调整大小");
      //outmj.node.setScale(this.initScale);
      //outmj.node.setPosition(this.getNewPosition());
      var runTime = 0.5;
      // 创建一个移动动作
      var moveAction = cc.moveTo(runTime, this.getNewPosition());
      moveAction = moveAction.easing(cc.easeOut(3.0));
      var action = cc.spawn(cc.scaleTo(runTime, this.initScale), moveAction);
      // 执行动作
      outmj.node.runAction(action);
    }, 2);
  },
  //获取一个新位置
  getNewPosition: function getNewPosition() {
    var pos = this.getFixedPosition();
    var len = this.outMjs.length - 1;
    var line = parseInt(len / this.lineCount);

    var pos2 = pos.add(cc.v2((len - line * this.lineCount) * this.realMjWidth, -(line * this.realMjHeight)));

    return pos2;
  },
  getFixedPosition: function getFixedPosition() {
    //手里牌宽度，固定后，不会随牌的数量增减而变化
    var width = this.node.width;
    var height = this.node.height;
    //console.log(this.node)
    //最左边一颗
    var fixedPosition = cc.v2(-(width - this.realMjWidth) / 2, (height - this.realMjHeight) / 2);
    return fixedPosition;
  },
  //高亮
  highlightMj: function highlightMj(mjzz) {
    console.log("高亮", mjzz);
    this.game.outMjs.forEach(function (value, index) {
      if (value.huase == mjzz.huase && value.number == mjzz.number) {
        value.highlight();
      } else {
        value.unHighlight();
      }
    }.bind(this));
  },
  //取消高亮
  unHighlightMj: function unHighlightMj(mjzz) {
    console.log("取消高亮", mjzz);
    this.game.outMjs.forEach(function (value, index) {
      if (value.huase == mjzz.huase && value.number == mjzz.number) {
        value.unHighlight();
      }
    }.bind(this));
  },
  //打出去，从一个位置，飞到另外一个位置
  takeOut: function takeOut(mjzz, pos, pos2) {
    /*let majiang = this.spawnNewOutMj(mjzz);
    majiang.setPosition(pos);
    this.node.addChild(majiang);
    this.scheduleOnce(function() {
    	//majiang.setPosition(pos2);
     }, 5);*/
  }

  // update (dt) {},
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
        //# sourceMappingURL=Dustbin.js.map
        