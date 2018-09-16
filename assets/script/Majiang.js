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
    	//名称，例如一万
    	nickName:"",
    	//打出去的音效
    	outAudio:{
    		default:null,
    		type:cc.AudioClip
    	},
    	//摸进来的音效
    	inAudio:{
    		default:null,
    		type:cc.AudioClip
    	}
    },
 
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
     	console.log("加载麻将----");
     },

    start () {

    },

    // update (dt) {},
});
