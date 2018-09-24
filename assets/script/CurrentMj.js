/**
 * 我的手里牌列表
 */
cc.Class({
    extends: cc.Component,

    properties: {
    	//单个麻将精灵
		MjSprite: {
			default: null,
			type: cc.Prefab
		},
		 //打出去的牌
		outPrefab:{
			default:null,
			type:cc.Prefab
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
		initScale: 1.25,
		//手里牌列表
		//shouliList: [],
		realMjWidth:0,
		
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    	//计算一下实际牌的宽度,单个麻将实际宽度
    	this.realMjWidth=(this.majiangWidth-this.majiangJianxi)*this.initScale;
    },

    start () {

    },
    //初始化手里牌列表,mjs=[{xx:xx}]
    initAllCurrentMj:function(mjs){
    	let width=this.node.width;
    	let aLength=mjs.length-1;
    	//最右边一颗
    	let fixedPosition=this.getFixedPosition();
    	//console.log(fixedPosition) 
    	mjs.forEach(function(value,index){
    		let majiang = this.spawnNewMj(value,false);
    		//从左往右排列
    		let pos=fixedPosition.sub(cc.v2((aLength-index)*this.realMjWidth,0));
    		//console.log(pos)
    		majiang.setPosition(pos);
    		this.node.addChild(majiang);
    	}.bind(this));
    	//盖牌
    	//1秒后排序
    	this.scheduleUpdate();
    },
    scheduleUpdate:function(){
    	this.scheduleOnce(function() {
		     this.updateSort();
		 }, 0.5);
    },
	getOne:function(mjzz){
		console.log("获取新牌")
		this.game.hasNewMajiang=true; 
		let majiang = this.spawnNewMj(mjzz,true);
		this.node.addChild(majiang);
		
		console.log("新",this.game.hasNewMajiang);
		console.log(this.CurrentMj)
	},
	//生成麻将对象
	spawnNewMj: function(mjzz,isNewOne) {
		console.log("创建麻将：", mjzz.huase, mjzz.number)
		var mj = cc.instantiate(this.MjSprite);
		var config = mj.getComponent('MajiangEntity');
		config.game = this.game;
		config.majiang=this;
		config.mjzz=mjzz;
		config.huase = mjzz.huase;
		config.number = mjzz.number;
		config.index = mjzz.index;
		config.isNewOne=isNewOne;
		mj.setScale(this.initScale);
		//把所有牌放入手头牌列表，即使是新牌，也算是自己的
		this.game.shouliList.push(config);
		return mj;
	},
	spawnNewOutMj: function(mjzz) {
		console.log("创建丢弃麻将：", mjzz.huase, mjzz.number)
		var mj = cc.instantiate(this.outPrefab);
		var config = mj.getComponent('OutMj');
		//config.game = this.game;
		config.huase = mjzz.huase;
		config.number = mjzz.number;
		config.index = mjzz.index;
		//mj.setScale(this.initScale);
		//把所有牌放入手头牌列表，即使是新牌，也算是自己的
		return mj;
	},
	//循环调用其他牌的unselecte
	unSelectOthers:function(ent){
		this.game.shouliList.forEach(function(value, index) {
			if(value.index!=ent.index && value.isSelected){
				value.unSelect();
			}
		}.bind(this));
	},
	//排序手里牌
	updateSort:function(){
		let newList = [];
		//计算可操作牌的起点位置
		//let aw = this.getAW();
		let aLength=this.game.shouliList.length-1;
		let fixedPosition=this.getFixedPosition();
		//新摸的牌已经放到最后一张，所以需要重新排序
		this.game.shouliList.sort(function(a, b) {
			return a.index - b.index;
		});
		let newNode;
		let newPos;
		//循环设置新坐标
		this.game.shouliList.forEach(function(value, index) {
			//从左往右排列
    		let pos=fixedPosition.sub(cc.v2((aLength-index)*this.realMjWidth,0));
    		if(value.isNewOne){
				newNode= value;  
				newPos=pos;
    		}else{
    			value.node.setPosition(pos);
    		}
		}.bind(this));
		if(newNode){
			let parentNode=this.node;
			//移动节点，再设置坐标
			this.scheduleOnce(function() {
				newNode.node.parent= parentNode;
				newNode.isNewOne=false;
				newNode.node.setPosition(newPos);
				console.log(this.game.shouliList);
				console.log(newNode,newPos);
		 	}, 1);
		}
	},
	//从数组中，把数据先移除
	removeFromList:function(ent){
		let newList=[];
		this.game.shouliList.forEach(function(value,index){
			if(value.index != ent.index){
				newList.push(value);
			}
		}.bind(this));
		this.game.shouliList=newList;
		console.log("移除之后",this.game.shouliList);
		ent.node.destroy();
	},
	//打出去一张手里牌，需要把新牌加进来，再排序
	takeOut:function(ent){
		console.log("手里牌打出去");
		let posX=ent.node.x;
		let outMj = this.spawnNewOutMj(ent.mjzz);
		console.log(outMj)
		//打出去牌默认位置
		outMj.setPosition(cc.v2(posX,0));
		//把自己从数组中移除
		this.removeFromList(ent);
		this.node.addChild(outMj);
		//生成一张丢棋牌,然后飞出去takeOut
		this.scheduleOnce(function() {
			//如果直接转移到垃圾桶
			outMj.parent =this.dustbin.node;
			outMj.setPosition(cc.v2(0,0));
		 }, 0.05);
		//this.dustbin.takeOut(ent.mjzz,pos1,cc.v2(0,0));
	},
	//从新牌那边移动过来
	moveMjFromNew:function(){
		
	},
	//获取固定牌的定位
	getFixedPosition:function(){
    	//手里牌宽度，固定后，不会随牌的数量增减而变化
    	let width=this.node.width;
    	//最右边一颗
    	let fixedPosition=cc.v2(width/2-this.realMjWidth/2);
    	return fixedPosition;
    }
    // update (dt) {},
});
