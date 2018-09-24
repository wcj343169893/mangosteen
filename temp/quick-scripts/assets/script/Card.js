(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/Card.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6f06a7FMf5LDIcXtFzVHGhi', 'Card', __filename);
// script/Card.js

"use strict";

/**
 * 信息卡，包含姓名，头像，uid，积分
 */
cc.Class({
	extends: cc.Component,

	properties: {
		cardPrefab: {
			default: null,
			type: cc.Prefab
		},
		//昵称
		nickName: "",
		//用户id
		userId: "",
		//头像（网络地址）
		avatar: "",
		//获得积分
		score: 0
	},

	// LIFE-CYCLE CALLBACKS:

	onLoad: function onLoad() {
		console.log("加载我的名片区域");
	},

	initCardInfo: function initCardInfo(player) {
		console.log("创建玩家：", player.uid, player.nickname, player.avatar);
		var cardEntity = cc.instantiate(this.cardPrefab);
		var config = cardEntity.getComponent('Player');
		cardEntity.setPosition(cc.v2(0, 0));
		//config.game = this;
		config.userinfo = player;
		this.node.addChild(cardEntity);
	},

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
        //# sourceMappingURL=Card.js.map
        