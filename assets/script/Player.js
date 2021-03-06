/**
 * 玩家属性
 */
var Player = cc.Class({
    extends: cc.Component,

    properties: {
    	nameLabel:{
    		default:null,
    		type:cc.Label
    	},
    	scoreLabel:{
    		default:null,
    		type:cc.Label
    	},
    	avatarSprite:{
    		default:null,
    		type:cc.Sprite
    	},
    	//用户所有信息都在这里面，从前一个页面直接传过来的
    	userinfo:{
    		default:null
    	},
    	//昵称
    	nickName:"",
    	//用户id
    	userId:"",
    	//头像（网络地址）
    	avatar:"",
    	//获得积分
    	score:0,
    	//ip地址
    	ip:"",
    	//定缺花色、wan/tiao/tong
    	lack:"",
    	//是否准备,当所有人都准备了，就可以开始游戏
    	isReady:false
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    	//我是xxx
    	console.log("我是",this.userinfo.nickname,"来报道")
    	var nlabel = this.nameLabel.getComponent(cc.Label);
    	nlabel.string=this.userinfo.nickname;
    	this.userId=this.userinfo.uid;
    	this.avatar=this.userinfo.avatar;
    	let self=this;
    	//加载头像
    	cc.loader.load({url: this.avatar, type: 'jpg'}, function (err, texture) {
		    // Use texture to create sprite frame
		    //console.log("头像加载完成");
		    //console.log(texture)
		    const sprite = this.avatarSprite.getComponent(cc.Sprite)
		   // sprite.spriteFrame.setTexture(texture);
		    sprite.spriteFrame = new cc.SpriteFrame(texture);
			//给sprite的spriteFrame属性 赋值  
			//sprite.spriteFrame = spriteFrame
			//设置头像坐标
		}.bind(this));
		//this.node.setPosition(this.userinfo["avatarPosition"]);
    },

    start () {

    },
    //摸牌
	getNewMj:function(mjzz){
		
	},
	//出牌
	deleteMj:function(){
		
	},
	//碰麻将
	pengMj:function(){
		
	},
	//明杠麻将
	mingGangMj:function(){
		
	},
	//暗杠麻将
	anGangMj:function(){
		
	},
	//胡牌
	huMj:function(){
		
	},
	//检查是否下叫
	checkJiao:function(){
		
	}
    // update (dt) {},
});
