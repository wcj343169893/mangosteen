"use strict";
cc._RF.push(module, '1f3cf7mPnZEbIKvb1QQ7x3c', 'OutMj');
// script/OutMj.js

"use strict";

/**
 * 打出去的牌
 */
cc.Class({
	extends: cc.Component,

	properties: {
		numberNode: {
			default: null,
			type: cc.Node
		},
		//万条筒
		huase: "",
		//1-9点数
		number: 0,
		isHighlight: false
	},

	// LIFE-CYCLE CALLBACKS:

	onLoad: function onLoad() {
		console.log("打出去啦.....");
		//合成实体
		this.getNumber();
	},

	//添加数字
	getNumber: function getNumber() {
		//这里加载assets/resource/123.png文件   
		var name = this.huase + "_" + this.number;
		console.log("开始数字", name);
		cc.loader.loadRes(name, cc.SpriteFrame, function (err, spriteFrame) {
			//调用新建的node的addComponent函数，会返回一个sprite的对象  
			var sprite = this.numberNode.addComponent(cc.Sprite);
			//给sprite的spriteFrame属性 赋值  
			sprite.spriteFrame = spriteFrame;
			this.numberNode.setPosition(cc.v2(0, 10));
		}.bind(this));
	},
	highlight: function highlight() {
		console.log("亲自高亮");
		this.isHighlight = true;
	},
	unHighlight: function unHighlight() {
		if (this.isHighlight) {
			this.isHighlight = false;
			console.log("亲自暗下来");
		}
	},
	start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();