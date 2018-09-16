"use strict";
cc._RF.push(module, '13a940UNwtE7Z1q0tp8pp8H', 'MajiangEntity');
// script/MajiangEntity.js

"use strict";

/**
 * 麻将实体
 */
cc.Class({
	extends: cc.Component,

	properties: {
		//万条筒
		type: "",
		//1-9点数
		number: 0
	},

	// LIFE-CYCLE CALLBACKS:

	onLoad: function onLoad() {
		//合成实体
		this.getCover();
	},

	getCover: function getCover() {
		//这里加载assets/resource/123.png文件   
		var name = this.type + "_" + this.number;
		console.log("开始加载资源", name);
		var self = this;
		//console.log(this.getPosition())
		//var entityConfig=this.node.getComponent("MajiangEntity");
		cc.loader.loadRes(name, cc.SpriteFrame, function (err, spriteFrame) {
			//self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
			//创建一个新的节点，因为cc.Sprite是组件不能直接挂载到节点上，只能添加到为节点的一个组件  
			//var node = new cc.Node('myNode')
			//调用新建的node的addComponent函数，会返回一个sprite的对象  
			//const sprite = node.addComponent(cc.Sprite)
			//给sprite的spriteFrame属性 赋值  
			//sprite.spriteFrame = spriteFrame
			//把新的节点追加到self.node节点去。self.node，就是脚本挂载的节点  
			//self.node.addChild(node)
		});
	},

	start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();