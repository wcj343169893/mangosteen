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

	onLoad() {
		console.log("加载我的名片区域");
	},
	initCardInfo:function(player){
		console.log("创建玩家：", player.uid, player.nickname, player.avatar)
		var cardEntity = cc.instantiate(this.cardPrefab);
		var config = cardEntity.getComponent('Player');
		cardEntity.setPosition(cc.v2(0,0));
		//config.game = this;
		config.userinfo=player;
		this.node.addChild(cardEntity);
	},

	start() {

	},

	// update (dt) {},
});