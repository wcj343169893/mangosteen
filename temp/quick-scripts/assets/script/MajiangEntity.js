(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/MajiangEntity.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '13a940UNwtE7Z1q0tp8pp8H', 'MajiangEntity', __filename);
// script/MajiangEntity.js

'use strict';

/**
 * 麻将实体
 */
cc.Class({
	extends: cc.Component,

	properties: {
		//万条筒
		type: "",
		//1-9点数
		number: 0,
		//被选中持续时间
		selectDuration: 1,
		//麻将状态，0摸到手，1选中，2对对碰，3明杠，4暗杠，5打出去
		status: 0,
		isSelected: false,
		//上一次结束时间，毫秒级
		clickTimer: 0
	},

	// LIFE-CYCLE CALLBACKS:
	onLoad: function onLoad() {
		//添加背景节点
		this.getBackground();
		//合成实体
		this.getNumber();
		//设置状态
		//this.setStatus(0);
		// 触摸开始
		this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
			//console.log('Mouse down');
		}, this);
		//触摸结束
		this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
			//console.log('Mouse end');
			var endTimer = new Date().valueOf();
			//300毫秒以内2次点击，算doubleclick
			if (endTimer - this.clickTimer < 300) {
				this.onDoubleClick();
			} else {
				this.onClick();
			}
			this.clickTimer = endTimer;
		}, this);
	},


	//设置状态
	setStatus: function setStatus(state) {
		var self = this;
		//设置背景状态
		if (self.status == 0 || self.status == 1) {}
	},
	//添加背景
	getBackground: function getBackground() {
		var self = this;
		//console.log("开始数字背景")
		//加载背景图片
		cc.loader.loadRes('mj_bg', cc.SpriteFrame, function (err, spriteFrame) {
			self.bgNode = new cc.Node('mjBackground');
			var sprite = self.bgNode.addComponent(cc.Sprite);
			//给sprite的spriteFrame属性 赋值  
			sprite.spriteFrame = spriteFrame;
			//把新的节点追加到self.node节点去。self.node，就是脚本挂载的节点  
			self.bgNode.setPosition(cc.v2(0, 0));
			self.bgNode.setRotation(180);
			self.node.addChild(self.bgNode);
		});
	},

	//添加数字
	getNumber: function getNumber() {
		//这里加载assets/resource/123.png文件   
		var name = this.type + "_" + this.number;
		console.log("开始数字", name);
		var self = this;
		//console.log(this.getPosition())
		//var entityConfig=this.node.getComponent("MajiangEntity");
		cc.loader.loadRes(name, cc.SpriteFrame, function (err, spriteFrame) {
			//创建一个新的节点，因为cc.Sprite是组件不能直接挂载到节点上，只能添加到为节点的一个组件  
			self.numbNode = new cc.Node('numberEntity');
			//调用新建的node的addComponent函数，会返回一个sprite的对象  
			var sprite = self.numbNode.addComponent(cc.Sprite);
			//给sprite的spriteFrame属性 赋值  
			sprite.spriteFrame = spriteFrame;
			//把新的节点追加到self.node节点去。self.node，就是脚本挂载的节点  
			//self.numbNode.setPosition(cc.v2(0,12));
			self.numbNode.setPosition(cc.v2(0, -12));
			//node.setRotation(180);
			self.node.addChild(self.numbNode);
		});
	},
	//被选中和释放选中
	onClick: function onClick() {
		if (!this.enabled) {
			return;
		}
		if (this.isSelected) {
			this.isSelected = false;
			this.bgNode.setRotation(180);
			this.bgNode.setPosition(cc.v2(0, 0));
			this.numbNode.setPosition(cc.v2(0, -12));
		} else {
			this.isSelected = true;
			this.bgNode.setRotation(180);
			this.bgNode.setPosition(cc.v2(0, 22));
			this.numbNode.setPosition(cc.v2(0, 12));
			//被选中后打出去，位置偏离了
		}
	},
	onDoubleClick: function onDoubleClick() {
		//打出去,
		this.bgNode.setRotation(0);
		this.bgNode.setPosition(cc.v2(0, 22));
		this.numbNode.setPosition(cc.v2(0, 32));
		//整体变小
		this.node.setScale(this.game.takeoutScale);
		//按照顺序，排列在面前，10张
		this.node.setPosition(this.game.getTakeOutPosition());
		this.enabled = false;
		this.node.off(cc.Node.EventType.TOUCH_START);
		this.node.off(cc.Node.EventType.TOUCH_END);
		//停止并且移除所有正在运行的动作列表。
		//this.node.stopAllActions();
		//调用game整理手里的牌
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
        //# sourceMappingURL=MajiangEntity.js.map
        