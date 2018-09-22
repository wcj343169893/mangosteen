/**
 * 桌面总控制
 */
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
		//对子组数量
		duiziCount: 0,
		//一组对子的宽度
		duiziWidth: 0,
		//对子缩放比例
		duiziScale: 1,
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
		this.userId = 1234522;
		//初始化加载自己的头像
		let user = {
			id: 12345,
			nickname: "美的厨卫",
			avatar: "http://file5.cjblog.org/upload/b27695e79fd8908de0b18507f89d5b7c.jpg?x-oss-process=style/w60h60"
		};
		let user2 = {
			id: 1234522,
			nickname: "美的厨卫22",
			avatar: "http://file5.cjblog.org/upload/b27695e79fd8908de0b18507f89d5b7c.jpg?x-oss-process=style/w60h60"
		};
		this.players.push(user);
		this.players.push(user2);

		//识别方位，初始化方位图
		this.initUserPosition();
		//加入所有人
		this.joinAllPeople();
		
		//准备按钮绑定事件
		this.btnReady.node.on('click', this.beginEvent, this);
		//测试摸牌按钮
		this.btnGetOne.node.on('click', this.testMopai, this);
		this.btnJoinOne.node.on('click', this.testJoinPeople, this);
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
		this.initAllMajiang();
		//显示到屏幕上
		/*let mjSize = this.majiangPool.size();
		console.log("麻将个数：" + mjSize);
		for(var i = 0; i < mjSize; i++) {
			let majiang = this.majiangPool.get();
			this.node.addChild(majiang);
		}*/
	},
	mopai: function(mjzz) {
		//得到一张牌		
		let mj = this.spawnNewMj(mjzz);
		this.hasNewMajiang=true;
		//this.currentMajiang = mj.getComponent('MajiangEntity');
		let aw = this.getAW();
		//设置固定位置，index是变化的
		mj.setPosition(this.getNewMjPosition(this.shouliList.length - 1, true, aw));
		this.node.addChild(mj);
	},

	initAllMajiang: function() {
		this.testGetRandomNumbers();
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
		/*if(nubArr.length > 0) {
			//按index排序
			nubArr.sort(function(a, b) {
				return a.index - b.index;
			});
		}*/
		//let aw = this.getAW();
		for(let i = 0; i < nubArr.length; ++i) {
			let mjzz = nubArr[i];
			//生成一个新麻将
			let mj = this.spawnNewMj(mjzz);
			//var config = mj.getComponent('MajiangEntity');
			//一排，依次排开
			//mj.setPosition(this.getNewMjPosition(i,false,0));
			//添加到节点上
			this.node.addChild(mj);
			//this.majiangPool.put(mj); // 通过 putInPool 接口放入对象池
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
	//更新手里牌
	updateShoulipai: function(ent) {
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
		//@todo 测试再摸一张
		this.testGetOne();
		return;
		/*
		let self = this;
		this.shouliList.forEach(function(value, ind) {
			if(!ent || value.index != ent.index) {
				if(self.currentMajiang && value.index > self.currentMajiang.index) {
					//设置新牌的位置
					self.currentMajiang.node.setPosition(self.getNewMjPosition(index, false, aw));
					newList.push(self.currentMajiang);
					//清空新牌
					self.currentMajiang = null;
					index++;
				}
				//设置留下来的位置
				value.node.setPosition(self.getNewMjPosition(index, false, aw));
				newList.push(value);
				index++;
			}
		});
		//如果是最后一张
		if(self.currentMajiang) {
			//设置新牌的位置
			self.currentMajiang.node.setPosition(self.getNewMjPosition(index, false, aw));
			newList.push(self.currentMajiang);
			//清空新牌
			self.currentMajiang = null;
		}

		this.shouliList = newList;
		//console.log(this.shouliList);
		if(ent) {
			this.testGetOne();
		}*/
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
		console.log("创建玩家：", player.id, player.nickname, player.avatar)
		var playerEntity = cc.instantiate(this.playerPrefab);
		var config = playerEntity.getComponent('Player');
		config.game = this;
		config.nickName = player.nickname;
		config.userId = player.id;
		config.avatar = player.avatar;
		return playerEntity;
	},
	//其他玩家出牌，分别记录他们的出牌位置
	setOtherTakeOutPosition: function() {

	},
	//刷新用户的显示位置
	initUserPosition: function() {
		//计算出东南西北的坐标
		let mine = cc.v2(this.originX + 60, this.originY + 80);
		//楼下
		let downstairs = cc.v2(-this.originX - 60, 0);
		//对面
		let opposite = cc.v2(0, -this.originY - 80);
		//楼上
		let upstairs = cc.v2(this.originX + 60, 0);
		//初始位置
		this.positionList = [mine, downstairs, opposite, upstairs];
		console.log(this.positionList);
		//拿到自己的index
		this.players.forEach(function(value, index) {
			if(value.id = this.userId) {
				this.myPositionIndex = index;
			}
		}.bind(this));
		//@todo 更新方位图(中间的东南西北图片)
	},
	//第一次加入所有人
	joinAllPeople: function() {
		//批量加入，此数组至少存在一条数据，就是自己
		this.players.forEach(function(value, index) {
			this.joinNewPeople(value, index);
		}.bind(this));
	},
	//有人员加入
	joinNewPeople: function(user, index) {
		//创建玩家对象
		let player = this.spawnNewPlayer(user);
		//设置坐标
		player.setPosition(this.getPlayerPosition(index));
		//加入到画布
		this.node.addChild(player);
	},
	//根据索引index获取玩家坐标
	getPlayerPosition: function(index) {
		let posIndex = this.getPlayerPositionIndex(index);
		return this.positionList[posIndex]
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
	//测试摸牌
	testMopai: function() {
		//摸一张，放到最右手边，理论上从服务器获得一个号码，测试从本地获取
		let mjzz = this.numbers[this.majiangIndex];
		this.majiangIndex++;
		this.mopai(mjzz);
		this.btnGetOne.enabled = false
	},
	//测试加入新用户
	testJoinPeople: function() {
		//从服务器得到一个用户，包含{id,nickname,avatar}
		let user = {
			id: 123,
			nickname: "张三",
			avatar: "http://file5.cjblog.org/upload/b27695e79fd8908de0b18507f89d5b7c.jpg?x-oss-process=style/w60h60"
		};
		//最多存放4个人
		if(this.players.length > 3) {
			return false;
		}
		this.players.push(user);
		this.joinNewPeople(user, this.players.length - 1);
	},
	//测试定时摸牌，需要改成轮流摸牌
	testGetOne: function() {
		//测试专用，3秒自动摸牌
		setTimeout(function() {
			this.testMopai();
		}.bind(this), 3000)
	}
});