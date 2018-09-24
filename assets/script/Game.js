/**
 * 桌面总控制
 */
const Player = require('Player');
cc.Class({
	extends: cc.Component,

	properties: {
		//麻将实体引用
		majiangPrefab: {
			default: null,
			type: cc.Prefab
		},
		//玩家引用
		playerPrefab: {
			default: null,
			type: cc.Prefab
		},
		
		
		
		playerEntities:{
			default:[], 
			type:Player
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
		//测试专用，108张牌的原始值
		numbers: [],
		//准备按钮
		btnReady: cc.Button,
		//摸牌按钮
		btnGetOne: cc.Button,
		//加入一个新玩家
		btnJoinOne: cc.Button,
		//新开始
		btnNewReady: cc.Button,
		//对子组数量
		duiziCount: 0,
		//一组对子的宽度
		duiziWidth: 0,
		//对子缩放比例
		duiziScale: 1,
		//对面麻将
		duimianMjScale: 1,
		//对面麻将宽度
		duimianMjWidth: 36,
		//是否只能选择一张
		isSingle: true,
		//麻将索引
		majiangIndex: 0,
		//新摸的一颗(测试无误后，可以删除)
		currentMajiang: null,
		//是否新摸一张牌
		hasNewMajiang:false,
		//手头牌列表
		shouliList: [],
		//对子列表
		duiziList: [],
		//暗杠列表
		angangList: [],
		//明杠列表
		minggangList: [],
		//玩家列表,4条数据
		players: [],
		playerEntities:null,
		//用户id
		userId: 0,
		//我在桌子上的位置
		myPositionIndex: 0
	},

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		console.log("开始游戏，创建对象池");
		//console.log(this.node)
		//初始化各种默认数字
		this.initDefaultNumber();
		//模拟从服务器获得自己的id,所以我自己是南方
		this.userId = 10002;
		//初始化加载自己的头像
		let user = {
			uid: 10001,
			nickname: "特工10001",
			avatar: "http://file5.cjblog.org/upload/b27695e79fd8908de0b18507f89d5b7c.jpg?x-oss-process=style/w60h60"
		};
		let user2 = {
			uid: 10002,
			nickname: "特工10002",
			avatar: "http://file5.cjblog.org/upload/b27695e79fd8908de0b18507f89d5b7c.jpg?x-oss-process=style/w60h60"
		};
		let user3 = {
			uid: 10003,
			nickname: "特工10003",
			avatar: "http://file5.cjblog.org/upload/b27695e79fd8908de0b18507f89d5b7c.jpg?x-oss-process=style/w60h60"
		};
		this.players.push(user);
		this.players.push(user2);
		this.players.push(user3);
		console.log(this.players);
		//识别方位，初始化方位图
		this.initUserPosition();
		//加入所有人
		//this.joinAllPeople();
		
		//准备按钮绑定事件
		this.btnReady.node.on('click', this.beginEvent, this);
		//测试摸牌按钮
		this.btnGetOne.node.on('click', this.testBeginMopai, this);
		this.btnJoinOne.node.on('click', this.testJoinPeople, this);
		//新开始
		this.btnNewReady.node.on('click',this.testNewBegin,this);
	},

	start() {

	},

	update(dt) {
		//console.log("更新画布",dt)
	},
	//初始化各种默认数字
	initDefaultNumber:function(){
		let width = Math.floor(this.node.width);
		let height = Math.floor(this.node.height);
		//右下角位置点
		this.originX = -width / 2;
		this.originY = -height / 2;
		this.basicTakeoutY = this.originY + this.majiangHeight * this.initScale + 40;
		console.log(width, height);
		//麻将总长=（麻将宽度-间隙）*13
		this.majiangAllWidth = (this.majiangWidth * this.initScale - this.majiangJianxi) * 13;
		//计算一组对子(杠)的宽度，三张牌放底下，缩放80%
		this.duiziWidth = (this.majiangWidth - this.majiangJianxi) * 3 * this.duiziScale;
	},
	//点击准备按钮，socket连接服务器，等待发牌指令
	beginEvent: function() {
		console.log("我已经准备好了");
		//告诉服务器自己的准备状态，服务器判断是否满足4人，如果满足，即可开始
		//洗牌
		this.testGetRandomNumbers();
		//初始化自己拍
		this.initAllMajiang();
		//初始化下家的牌
		this.initDownStairsMjs();
	},
	mopai: function(uid,mjzz) {
		console.log("用户：",uid,"摸牌",mjzz);
		//某个用户得到一张牌,如果是别人，是没有点数的，只有一个空对象，所以区分是自己还是别人	
		if(uid == this.userId){
			let mj = this.spawnNewMj(mjzz);
			this.hasNewMajiang=true;
			this.currentMajiang = mj.getComponent('MajiangEntity');
			
			//let aw = this.getAW();
			//设置固定位置，index是变化的
			//设置为自己的新牌位置
			mj.setPosition(this.playerNewMjPositionList[0]);
			this.node.addChild(mj);
		}else{
			//座位index
			let index = this.getPlayerIndexByUid(uid);
			//得到新牌坐标
			let pos = this.playerNewMjPositionList[index];
			
		}
	},

	initAllMajiang: function() {
		let initCount = 13;
		let nubArr = [];
		for(let i = 0; i < initCount; ++i) {
			let ent = this.numbers[i];
			nubArr.push(ent);
			this.majiangIndex++;
		}
		console.log(nubArr)
		for(let i = 0; i < nubArr.length; ++i) {
			let mjzz = nubArr[i];
			//生成一个新麻将
			let mj = this.spawnNewMj(mjzz);
			//添加到节点上
			this.node.addChild(mj);
		}
		//把默认是乱的顺序，排列整齐,可以加一个特效
		//1.盖牌特效
		//2.整理顺序
		this.updateShoulipai();
		//3.翻牌特效
	},
	//生成麻将对象
	spawnNewMj: function(mjzz) {
		console.log("创建麻将：", mjzz.huase, mjzz.number)
		var mj = cc.instantiate(this.majiangPrefab);
		var config = mj.getComponent('MajiangEntity');
		config.game = this;
		config.huase = mjzz.huase;
		config.number = mjzz.number;
		config.index = mjzz.index;
		mj.setScale(this.initScale);
		//把所有牌放入手头牌列表，即使是新牌，也算是自己的
		this.shouliList.push(config);
		return mj;
	},
	//初始化其他玩家的牌，并不需要具体点数
	spawnNewOtherMj:function(pos){
		//区分是上家、下家还是对家
	},
	//获取每个麻将位置
	getNewMjPosition: function(index, isNewOne, start) {
		//获取新麻将的位置
		var randX = start - this.majiangAllWidth / 2 + (index) * (this.majiangWidth * this.initScale - this.majiangJianxi);
		var randY = this.originY + 70; //-this.node./2;
		//console.log("位置1：", index, randX, randY);
		if(isNewOne) {
			randX = randX + 20;
			console.log("新牌位置：", index, randX, randY);
		}
		return cc.v2(randX, randY);
	},
	getTakeOutPosition: function(node) {
		//console.log(node)
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
		//let mjX=this.originX+300+(scaleWidth*(this.takeoutIndex-outLevel*outNumb));
		let mjX = -outNumb * scaleWidth / 2 + (scaleWidth * (this.takeoutIndex - outLevel * outNumb));

		let mjY = this.basicTakeoutY + outLevel * (this.majiangHeight * this.takeoutScale);
		this.takeoutIndex++;
		console.log("垃圾桶位置：", outLevel, mjX, mjY);
		//调用重新排序
		return cc.v2(mjX, mjY);
	},
	//移除手里牌
	removeShoulipai:function(ent){
		let shouli=[];
		this.shouliList.forEach(function(value, ind) {
			if(value.index != ent.index){
				shouli.push(value);
			}
		}.bind(this));
		this.shouliList=shouli;
		this.updateShoulipai(true)
	},
	//更新手里牌
	updateShoulipai: function(getOther) {
		//更新手里牌http://www.w3school.com.cn/jsref/jsref_splice.asp
		let newList = [];
		//计算可操作牌的起点位置
		let aw = this.getAW();
		let index = 0;
		//新摸的牌已经放到最后一张，所以需要重新排序
		this.shouliList.sort(function(a, b) {
			return a.index - b.index;
		});
		//循环设置新坐标
		this.shouliList.forEach(function(value, ind) {
			value.node.setPosition(this.getNewMjPosition(ind, false, aw));
		}.bind(this));
		//重新排序后，表示没有新牌进入
        this.hasNewMajiang=false;
        if(getOther){
        	//@todo 测试再摸一张
        	this.testGetOne();
        }
	},
	//获取麻将排列起点位置
	getAW: function() {
		let duigangWidth = this.duiziWidth;
		let aw = (this.duiziList.length + this.angangList.length + this.minggangList.length) * (duigangWidth + 10) + 50;
		return aw;
	},
	//当选中一个小主之后，让其他小主坐冷板凳
	unSelectOthers: function(ent) {
		//定缺，平时选择一张
		if(this.isSingle) {
			this.shouliList.forEach(function(value, ind) {
				if(value.index != ent.index && value.isSelected) {
					value.unSelect();
				}
			});
		}
	},
	//生成玩家对象
	spawnNewPlayer: function(player) {
		console.log("创建玩家：", player.uid, player.nickname, player.avatar)
		var playerEntity = cc.instantiate(this.playerPrefab);
		var config = playerEntity.getComponent('Player');
		config.game = this;
		config.userinfo=player;
		//玩家实体数组，方便以后调用,摸牌，出牌，都由实体对象调用
		this.playerEntities[player.uid]=config;
		return playerEntity;
	},
	//其他玩家出牌，分别记录他们的出牌位置
	setOtherTakeOutPosition: function() {

	},
	//计算用户的属性，包含：头像坐标，新牌，定位牌
	initUserPosition: function() {
		//拿到自己的index
		this.players.forEach(function(value, index) {
			if(value.uid == this.userId) {
				this.myPositionIndex = index;
			}
		}.bind(this));
		//初始化所有头像位置
		this.initAvatarPositions();
		//初始化其他玩家手里牌固定位置
		this.initFixedMjPositions();
		//@todo 更新方位图(中间的东南西北图片)
	},
	//初始化每一位玩家不动的位置
	initFixedMjPositions:function(){
		//自己牌的总宽度/2
		//计算出东南西北的坐标
		let mine = cc.v2(this.majiangAllWidth / 2, this.originY + 70);
		//新牌位置，向右增加10像素
		let mine_new=mine.add(cc.v2(10,0));
		//楼下,侧面每一张牌相距20，*6张牌+全侧面一张，从下往上算
		let downstairs = cc.v2(this.majiangAllWidth / 2, -120+64);
		//楼下新牌，比固定增加5像素
		let downstairs_new=downstairs.add(cc.v2(5,5));
		//对面麻将总宽度
		this.duimianMjAllWidth=this.duimianMjWidth*13;
		//对面麻将初始位置，从左往右算
		let opposite = cc.v2(this.duimianMjAllWidth/2*this.duimianMjScale , -this.originY - 64);
		//对面新牌位置，向左移动5像素		
		let opposite_new=opposite.add(cc.v2(-10,0));
		//楼上，从上往下算
		let upstairs = cc.v2(-this.majiangAllWidth / 2+10*6, 120+64);
		
		let upstairs_new=upstairs.add(cc.v2(-5,-5));
		//初始每人第一张牌的位置
		this.playerFixedMjPositionList = [mine, downstairs, opposite, upstairs];
		//初始化每人新牌的位置
		this.playerNewMjPositionList = [mine_new, downstairs_new, opposite_new, upstairs_new];
		console.log(this.playerFixedMjPositionList);
		console.log(this.playerNewMjPositionList);
	},
	//头像位置
	initAvatarPositions:function(){
		let aWidth=86;
		let aHeight=126;
		let padding=20;
		//计算出东南西北的坐标
		let mine = cc.v2(this.originX + aWidth/2+padding, this.originY + aHeight/2+60);
		//楼下
		let downstairs = cc.v2(-this.originX - aWidth/2-padding, 80);
		//对面
		let opposite = cc.v2(-this.originX-280 , -this.originY - aHeight/2-padding);
		//楼上
		let upstairs = cc.v2(this.originX + aWidth/2+padding, 80);
		//初始头像位置
		this.avatarPositionList = [mine, downstairs, opposite, upstairs];
		console.log(this.avatarPositionList);
	},
	
	//第一次加入所有人
	joinAllPeople: function() {
		//初始化玩家对象实体数据
		this.playerEntities={};
		//批量加入，此数组至少存在一条数据，就是自己
		this.players.forEach(function(value, index) {
			this.joinNewPeople(value, index);
		}.bind(this));
	},
	//有人员加入
	joinNewPeople: function(user, index) {
		//加入顺序
		user["joinIndex"]=index;
		//相对位置索引，从我算起
		let posIndex = this.getPlayerPositionIndex(index);
		user["posIndex"]=posIndex;
		//头像位置
		user["avatarPosition"]=this.avatarPositionList[posIndex];
		//新麻将位置
		user["newMjPosition"]=this.playerNewMjPositionList[posIndex];
		//固定位置麻将
		user["fixedMjPosition"]=this.playerFixedMjPositionList[posIndex];
		//创建玩家对象
		let player = this.spawnNewPlayer(user);
		//设置坐标
		//player.setPosition(this.getPlayerPosition(index));
		//加入到画布
		this.node.addChild(player);
	},
	//根据用户id，获得座位index
	getPlayerIndexByUid:function(uid){
		let userIndex=0;
		this.players.forEach(function(value, index) {
			if(value.uid==uid){
				userIndex=index;
			}
		});
		return userIndex;
	},
	//根据索引index获取玩家坐标
	getPlayerPosition: function(index) {
		let posIndex = this.getPlayerPositionIndex(index);
		return this.avatarPositionList[posIndex]
	},
	//获取玩家位置，index为玩家列表索引
	getPlayerPositionIndex: function(index) {
		let posIndex = index - this.myPositionIndex;
		if(posIndex < 0) {
			posIndex = posIndex + 4;
		}
		return posIndex;
	},
	//本地测试专用，生成108张新牌序列，理论上是在服务器生成，下发13张到本地
	testGetRandomNumbers: function() {
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
	//测试自己摸牌一次
	testBeginMopai:function(){
		//点击启动开始摸牌,获取东的uid和获取一张牌
		//let uid = this.players[0].uid;
		this.majiangIndex++;
		let mjzz = this.numbers[this.majiangIndex];
		let LeadSeat= this.node.getChildByName("LeadSeat");
		let ShowMjNode =LeadSeat.getChildByName("ShowMjNode");
		//新牌区域
		let NewMjNode = ShowMjNode.getChildByName("NewMjNode");
		let CurrentMj= NewMjNode.getComponent("CurrentMj");
		CurrentMj.getOne(mjzz);
		//this.btnGetOne.enabled = false;
	},
	//测试定时摸牌，需要改成轮流摸牌
	testGetOne: function() {
		//摸一张，放到最右手边，理论上从服务器获得一个号码，测试从本地获取
		//随机uid摸牌，用来对接服务器发来的信号，只能是暗杠，才能连续摸两张，
		//生成0-3的数字
		let ind = parseInt(Math.random()*4);
		let uid = this.players[ind].uid;
		this.majiangIndex++;
		let mjzz = this.numbers[this.majiangIndex];
		
		//测试专用，3秒自动摸牌
		setTimeout(function() {
			this.mopai(uid,mjzz);
		}.bind(this), 3000)
	},
	//测试加入新用户
	testJoinPeople: function() {
		//从服务器得到一个用户，包含{id,nickname,avatar}
		let user = {
			uid: 10004,
			nickname: "张三10004",
			avatar: "http://file5.cjblog.org/upload/b27695e79fd8908de0b18507f89d5b7c.jpg?x-oss-process=style/w60h60"
		};
		this.players.push(user);
		this.joinNewPeople(user, this.players.length - 1);
		//最多存放4个人
		if(this.players.length ==4 ) {
			this.btnJoinOne.enabled = false;
		}
	},
	//新测试
	testNewBegin:function(){
		let LeadSeat= this.node.getChildByName("LeadSeat");
		let ShowMjNode =LeadSeat.getChildByName("ShowMjNode");
		let DustbinNode =LeadSeat.getChildByName("DustbinNode");
		let Dustbin = DustbinNode.getComponent("Dustbin") ;
		//信息卡区域
		let CardNode =ShowMjNode.getChildByName("CardNode");
		//初始化头像
		let card = CardNode.getComponent("Card") ;
		let user = {
			uid: 10008,
			nickname: "张三10008",
			avatar: "http://file5.cjblog.org/upload/b27695e79fd8908de0b18507f89d5b7c.jpg?x-oss-process=style/w60h60"
		};
		card.initCardInfo(user);
		//新牌区域
		let NewMjNode = ShowMjNode.getChildByName("NewMjNode");
		let NewMj= NewMjNode.getComponent("CurrentMj");
		
		//手里牌区域
		let CurrentMjNode =ShowMjNode.getChildByName("CurrentMjNode");
		let CurrentMj = CurrentMjNode.getComponent("CurrentMj");
		
		//绑定新牌区域和手里牌区域的相互引用
		NewMj.CurrentMj=CurrentMj;
		//NewMj.shouliList=this.shouliList;
		//NewMj.hasNewMajiang=this.hasNewMajiang;
		NewMj.game=this;
		
		CurrentMj.NewMj=NewMj;
		//CurrentMj.shouliList=this.shouliList;
		//CurrentMj.hasNewMajiang=this.hasNewMajiang;
		CurrentMj.game=this;
		
		//绑定垃圾桶绑定
		CurrentMj.dustbin=Dustbin;
		NewMj.dustbin=Dustbin;
		
		
		this.testGetRandomNumbers();
		
		let initCount = 13;
		let nubArr = [];
		for(let i = 0; i < initCount; ++i) {
			let ent = this.numbers[i];
			nubArr.push(ent);
			this.majiangIndex++;
		}
		CurrentMj.initAllCurrentMj(nubArr);
		console.log(CurrentMjNode)
	},
	//测试初始化下家手里牌
	initDownStairsMjs:function(){
		let initCount = 13;
		let nubArr = [];
		for(let i = 0; i < initCount; ++i) {
			let ent = this.numbers[i];
			nubArr.push(ent);
			this.majiangIndex++;
		}
		for(let i = 0; i < nubArr.length; ++i) {
			let mjzz = nubArr[i];
			//生成一个新麻将
			//let mj = this.spawnNewMj(mjzz);
			//添加到节点上
			//this.node.addChild(mj);
		}
	}
});