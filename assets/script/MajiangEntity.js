/**
 * 麻将实体
 */
cc.Class({
	extends: cc.Component,

	properties: {
		/*bgNode:{
			default:null,
			type:cc.Node
		},*/
		numberNode:{
			default:null,
			type:cc.Node
		},
		//万条筒
		huase: "",
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
	onLoad() {
		//console.log(this.backgroundSprite);
		//添加背景节点
		//this.getBackground();
		//合成实体
		this.getNumber();
		//设置状态
		//this.setStatus(0);
		// 触摸开始
		this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
			//console.log('Mouse down');
		}, this);
		//触摸结束
		this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
			//console.log('Mouse end');
			var endTimer = (new Date()).valueOf();
			//300毫秒以内2次点击，算doubleclick
			if(endTimer - this.clickTimer < 500) {
				this.onDoubleClick();
			} else {
				this.onClick();
			}
			this.clickTimer=endTimer;
		}, this);
	},
	//设置状态
	setStatus: function(state) {
		var self = this;
		//设置背景状态
		if(self.status == 0 || self.status == 1) {

		}
	},
	//添加背景
	getBackground: function() {
		//var self = this;
		//console.log("开始数字背景")
		//加载背景图片
		//cc.loader.loadRes('mj_bg', cc.SpriteFrame, function(err, spriteFrame) {
			//self.bgNode = new cc.Node('mjBackground');
			//let sprite = self.bgNode.addComponent(cc.Sprite)
			//给sprite的spriteFrame属性 赋值  
			//sprite.spriteFrame = this.backgroundSprite;
			//把新的节点追加到self.node节点去。self.node，就是脚本挂载的节点  
			this.bgNode.setPosition(cc.v2(0, 0));
			this.bgNode.setRotation(180);
			//self.node.addChild(self.bgNode)
		//});
	},

	//添加数字
	getNumber: function() {
		//这里加载assets/resource/123.png文件   
		let name = this.huase + "_" + this.number;
		console.log("开始数字", name)
		var self = this;
		//console.log(this.getPosition())
		//var entityConfig=this.node.getComponent("MajiangEntity");
		cc.loader.loadRes(name, cc.SpriteFrame, function(err, spriteFrame) {
			//创建一个新的节点，因为cc.Sprite是组件不能直接挂载到节点上，只能添加到为节点的一个组件  
			//self.numbNode = new cc.Node('numberEntity')
			//调用新建的node的addComponent函数，会返回一个sprite的对象  
			const sprite = this.numberNode.addComponent(cc.Sprite)
			//给sprite的spriteFrame属性 赋值  
			sprite.spriteFrame = spriteFrame
			//把新的节点追加到self.node节点去。self.node，就是脚本挂载的节点  
			//self.numbNode.setPosition(cc.v2(0,12));
			//self.numbNode.setPosition(cc.v2(0, -12));
			this.numberNode.setPosition(cc.v2(0, -12));
			//node.setRotation(180);
			//self.node.addChild(self.numbNode)
		}.bind(this))
	},
	//被选中和释放选中
	onClick: function() {
		if(!this.enabled){
			return;
		}
		if(this.isSelected) {
			this.unSelect();
		} else {
			this.isSelected = true;
			//this.bgNode.setRotation(180);
			//this.bgNode.setPosition(cc.v2(0, 22));
			//this.numbNode.setPosition(cc.v2(0, 12));
			let pos=this.node.getPosition();
			//向上移动10像素
			this.node.setPosition(pos.add(cc.v2(0,20)));
			//取消其他的选中状态
			this.majiang.unSelectOthers(this);
		}
	},
	//双击把自己打出去
	onDoubleClick: function() {
		//打出去,如果没有摸牌，是打不出去的
		if(!this.game.hasNewMajiang){
			return;
		}
		this.majiang.takeOut(this);
		if(this.isNewOne){
			//直接打出去
		}else{
			//打出去之后，把新牌拿进来
			this.majiang.scheduleUpdate();
		}
		return;
		/*this.bgNode.setRotation(0);
		this.bgNode.setPosition(cc.v2(0, 22));
		this.numbNode.setPosition(cc.v2(0,32));
		//整体变小
		this.node.setScale(this.game.takeoutScale);
		console.log("缩放比例",this.game.takeoutScale)
		//按照顺序，排列在面前，10张
		this.node.setPosition(this.game.getTakeOutPosition(this.node));
		this.enabled = false
		this.node.off(cc.Node.EventType.TOUCH_START);
		this.node.off(cc.Node.EventType.TOUCH_END);
		//停止并且移除所有正在运行的动作列表。
        //this.node.stopAllActions();
        //如果自己就是新牌,不会影响原来的顺序
        this.game.removeShoulipai(this);*/
        /*if(this.index != this.game.currentMajiang.index){
        	this.game.updateShoulipai(this);
        }else{
        	this.game.testGetOne()
        }*/
	},
	start() {

	},
	unSelect:function(){
		this.isSelected = false;
		let pos=this.node.getPosition();
		//向下移动10像素
		this.node.setPosition(pos.sub(cc.v2(0,20)))
	}


	// update (dt) {},
});