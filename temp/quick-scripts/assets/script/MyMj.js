(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/MyMj.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7cbb4gVzJJDyZ4f5mZkbQq/', 'MyMj', __filename);
// script/MyMj.js

"use strict";

/**
 * 我的麻将父类
 */
cc.Class({
	extends: cc.Component,

	properties: {
		//单个麻将精灵
		MjSprite: {
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
		hasNewMajiang: false,
		//默认缩放，需要和自己的新牌保持一致
		initScale: 1.25,
		//手里牌列表
		shouliList: []
	},

	takeOut: function takeOut(ent) {
		console.log("父类牌打出去,随后调用特效");
		//this.hasNewMajiang=false;
		//ent.node.destroy(); 
	},
	// LIFE-CYCLE CALLBACKS:

	// onLoad () {},

	start: function start() {}
}

// update (dt) {},
);

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
        //# sourceMappingURL=MyMj.js.map
        