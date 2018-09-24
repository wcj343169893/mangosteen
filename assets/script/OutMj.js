/**
 * 打出去的牌
 */
cc.Class({
    extends: cc.Component,

    properties: {
        numberNode:{
			default:null,
			type:cc.Node
		},
		//万条筒
		huase: "",
		//1-9点数
		number: 0,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
     	
     },
	//添加数字
	getNumber: function() {
		//这里加载assets/resource/123.png文件   
		let name = this.huase + "_" + this.number;
		console.log("开始数字", name)
		var self = this;
		cc.loader.loadRes(name, cc.SpriteFrame, function(err, spriteFrame) {
			//调用新建的node的addComponent函数，会返回一个sprite的对象  
			const sprite = this.numberNode.addComponent(cc.Sprite)
			//给sprite的spriteFrame属性 赋值  
			sprite.spriteFrame = spriteFrame
			this.numberNode.setPosition(cc.v2(0, -12));
		}.bind(this))
	},
    start () {

    },

    // update (dt) {},
});
