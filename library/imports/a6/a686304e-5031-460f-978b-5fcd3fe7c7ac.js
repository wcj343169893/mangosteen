"use strict";
cc._RF.push(module, 'a6863BOUDFGD5eLX80/58es', 'Dustbin');
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
								}
				},

				// LIFE-CYCLE CALLBACKS:

				// onLoad () {},

				start: function start() {},

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