/**
 * 玩家属性
 */
cc.Class({
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
    	//昵称
    	nickName:{
    		get:function(){
    			return this._nickName;
    		},
    		set:function(value){
    			console.log("设置用户名：",value);
    			this._nickName=value;
    		}
    	},
    	//用户id
    	userId:0,
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
    	console.log("我是",this.nickName,"来报道")
    	var nlabel = this.nameLabel.getComponent(cc.Label);
    	nlabel.string=this.nickName;
    	let self=this;
    	//加载头像
    	cc.loader.load({url: this.avatar, type: 'jpg'}, function (err, texture) {
		    // Use texture to create sprite frame
		    console.log("头像加载完成");
		    console.log(texture)
		    const sprite = self.avatarSprite.getComponent(cc.Sprite)
		   // sprite.spriteFrame.setTexture(texture);
		    sprite.spriteFrame = new cc.SpriteFrame(texture);
			//给sprite的spriteFrame属性 赋值  
			//sprite.spriteFrame = spriteFrame
		});
    },

    start () {

    },

    // update (dt) {},
});
