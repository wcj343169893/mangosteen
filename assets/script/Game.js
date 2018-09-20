// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
	extends: cc.Component,

	properties: {
		//麻将实体引用
		majiangPrefab: {
			default: null,
			type: cc.Prefab
		},
		//打出去多少张
		takeoutIndex: 0,
		//打出去缩放比例
		takeoutScale: 1,
		//初始化缩放比例
		initScale: 1.25,
		//单个麻将宽度
		majiangWidth: 58,
		//单个麻将高度
		majiangHeight: 84,
		//麻将间隙，适用于所有横的排列
		majiangJianxi: 4,
		//打出去牌的Y坐标
		basicTakeoutY: 0,
		numbers: [],
		//准备按钮
		btnReady: cc.Button,
		//摸牌按钮
		btnGetOne: cc.Button,
		//对子组数量
		duiziCount: 0,
		//一组对子的宽度
		duiziWidth: 0,
		//对子缩放比例
		duiziScale: 1,
		//是否只能选择一张
		isSingle:true,
		//麻将索引
		majiangIndex:0,
		//新摸的一颗
		currentMajiang:null,
		//第一颗麻将
		firstMajiang:null,
		//手头牌列表
		shouliList:[],
		//对子列表
		duiziList:[],
		//暗杠列表
		angangList:[],
		//明杠列表
		minggangList:[]

	},

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		console.log("开始游戏，创建对象池");
		//console.log(this.node)
		let width = Math.floor(this.node.width);
		let height = Math.floor(this.node.height);
		//右下角位置点
		this.basicWidth = -width / 2;
		this.basicHeight = -height / 2;
		this.basicTakeoutY = this.basicHeight + this.majiangHeight*this.initScale+40;
		console.log(width, height);
		//麻将总长=（麻将宽度-间隙）*13
		this.majiangAllWidth = (this.majiangWidth*this.initScale - this.majiangJianxi) * 13;
		//计算一组对子(杠)的宽度，三张牌放底下，缩放80%
		this.duiziWidth = (this.majiangWidth - this.majiangJianxi) * 3 * this.duiziScale;
		//准备按钮绑定事件
		this.btnReady.node.on('click', this.begin, this);
		//测试摸牌按钮
		this.btnGetOne.node.on('click', this.mopai, this);
		
	},

	start() {

	},

	update(dt) {
		//console.log("更新画布",dt)
	},
	begin: function() {
		//洗牌
		this.initAllMajiang();
		//显示到屏幕上
		/*let mjSize = this.majiangPool.size();
		console.log("麻将个数：" + mjSize);
		for(var i = 0; i < mjSize; i++) {
			let majiang = this.majiangPool.get();
			this.node.addChild(majiang);
		}*/
	},
	mopai:function(){
		//摸一张，放到最右手边，理论上从服务器获得一个号码，测试从本地获取
		let mjzz = this.numbers[this.majiangIndex];
		
		let mj = this.spawnNewMj(mjzz);
		mj.setScale(this.initScale);
		this.currentMajiang = mj.getComponent('MajiangEntity');
		let aw = this.getAW();
		//设置固定位置
		mj.setPosition(this.getNewMjPosition(13,true,aw));
		this.node.addChild(mj);
		this.majiangIndex++;
	},
	initAllMajiang: function() {
		this.getRandomNumbers();
		//this.majiangPool = new cc.NodePool();
		//this.majiangOutPool = new cc.NodePool();
		let initCount = 13;
		let nubArr = [];
		for(let i = 0; i < initCount; ++i) {
			let ent = this.numbers[i];
			nubArr.push(ent);
			this.majiangIndex++;
		}
		console.log(nubArr)
		if(nubArr.length > 0) {
			//按index排序
			nubArr.sort(function(a, b) {
				return a.index - b.index;
			});
		}
		//let aw = this.getAW();
		for(let i = 0; i < nubArr.length; ++i) {
			let mjzz = nubArr[i];
			//生成一个新麻将
			let mj = this.spawnNewMj(mjzz);
			mj.setScale(this.initScale);
			var config = mj.getComponent('MajiangEntity');
			//一排，依次排开
			//mj.setPosition(this.getNewMjPosition(i,false,0));
			//添加到节点上
			this.node.addChild(mj);
			//this.majiangPool.put(mj); // 通过 putInPool 接口放入对象池
			//if(this.firstMajiang==null){
				//this.firstMajiang=config;
				//this.firstMajiang.isFirst=true;
				//console.log(this.firstMajiang)
			//}
			//把所有牌放入手头牌列表
			this.shouliList.push(config);
		}
		this.updateShoulipai();
	},
	getRandomNumbers: function() {
		//产生1-9数字 numbers  ,每个花色36个数字
		var arr = [];
		var huase = ["tiao", "tong", "wan"];
		var index = 0;
		//遍历花色
		huase.forEach(function(se, ind) {
			//遍历1-9数字
			for(let ds = 1; ds <= 9; ds++) {
				//每种产生4张
				for(let amount = 0; amount < 4; amount++) {
					arr.push({
						"index": index,
						"key": se + "_" + ds,
						"huase": se,
						"number": ds
					});
					index++;
				}
			}
		});
		//第一次打乱
		arr.sort(function() {
			return 0.5 - Math.random()
		});
		//第二次打乱
		arr.sort(function() {
			return 0.5 - Math.random()
		});
		//console.log(arr);
		this.numbers = arr;
	},
	//生成麻将对象
	spawnNewMj: function(mjzz) {
		console.log("创建麻将：", mjzz.huase, mjzz.number)
		var mj = cc.instantiate(this.majiangPrefab);
		var config = mj.getComponent('MajiangEntity');
		config.game = this;
		config.type = mjzz.huase;
		config.number = mjzz.number;
		config.index = mjzz.index;
		return mj;
	},
	//获取每个麻将位置
	getNewMjPosition: function(index,isNewOne,start) {
		//获取新麻将的位置
		var randX = start-this.majiangAllWidth / 2 + (index) * (this.majiangWidth*this.initScale - this.majiangJianxi);
		var randY = this.basicHeight + 70; //-this.node./2;
		console.log("位置1：", index, randX, randY);
		if(isNewOne){
			randX=randX+20;
			console.log("新牌")
			console.log("位置2：", index, randX, randY);
		}
		return cc.v2(randX, randY);
	},
	getTakeOutPosition: function(node) {
		console.log(node)
		//手里牌对象池移除
		//this.majiangPool.put(node);
		//放入打出去的对象池
		//this.majiangOutPool.put(node);
		//this.node.addChild(node);
		//let mjSize = this.majiangPool.size();
		//console.log("剩余张数",mjSize);
		let scaleWidth = (this.majiangWidth - this.majiangJianxi) * this.takeoutScale;
		let outNumb = 10;
		//获取打出去的位置
		let outLevel = parseInt(this.takeoutIndex / outNumb);
		//scaleWidth*10/2+
		//let mjX=this.basicWidth+300+(scaleWidth*(this.takeoutIndex-outLevel*outNumb));
		let mjX = -outNumb * scaleWidth / 2 + (scaleWidth * (this.takeoutIndex - outLevel * outNumb));

		let mjY = this.basicTakeoutY + outLevel * (this.majiangHeight * this.takeoutScale);
		this.takeoutIndex++;
		console.log("位置：", outLevel, mjX, mjY);
		//调用重新排序
		return cc.v2(mjX, mjY);
	},
	//更新手里牌
	updateShoulipai:function(ent){
		//更新手里牌http://www.w3school.com.cn/jsref/jsref_splice.asp
		let newList=[];
		let self=this;
		//重新整理顺序
		let aw = this.getAW();
		let index=0;
		this.shouliList.forEach(function(value,ind){
			if(!ent || value.index != ent.index){
				if(self.currentMajiang && value.index > self.currentMajiang.index){
					//设置新牌的位置
					self.currentMajiang.node.setPosition(self.getNewMjPosition(index,false,aw));
					newList.push(self.currentMajiang);
					//清空新牌
					self.currentMajiang=null;
					index++;
				}
				//设置留下来的位置
				value.node.setPosition(self.getNewMjPosition(index,false,aw));
				newList.push(value);
				index++;
			}
		});
		//如果是最后一张
		if(self.currentMajiang){
			//设置新牌的位置
			self.currentMajiang.node.setPosition(self.getNewMjPosition(index,false,aw));
			newList.push(self.currentMajiang);
			//清空新牌
			self.currentMajiang=null;
		}
		
		this.shouliList=newList;
		//console.log(this.shouliList);
		if(ent){
			this.testGetOne();
		}
	},
	//获取麻将排列起点位置
	getAW:function(){
		let duigangWidth=this.duiziWidth;
		let aw = (this.duiziList.length+this.angangList.length+this.minggangList.length)*(duigangWidth+10)+50;
		return aw;
	},
	//让其他小主坐冷板凳
	unSelectOthers:function(ent){
		//定缺，平时选择一张
		if(this.isSingle){
			this.shouliList.forEach(function(value,ind){
				if(value.index!=ent.index && value.isSelected){
					value.unSelect();
				}
			});
		}
	},testGetOne:function(){
		let self=this;
		//测试专用，3秒自动摸牌
		setTimeout(function(){
			self.mopai();
		},3000)
	}
});