/**
 * 垃圾桶，飞进去的效果
 */
cc.Class({
    extends: cc.Component,

    properties: {
       //打出去的牌
		outPrefab:{
			default:null,
			type:cc.Prefab
		},
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    //打出去，从一个位置，飞到另外一个位置
	takeOut:function(mjzz,pos,pos2){
		/*let majiang = this.spawnNewOutMj(mjzz);
		majiang.setPosition(pos);
		this.node.addChild(majiang);
		this.scheduleOnce(function() {
			//majiang.setPosition(pos2);
		 }, 5);*/
	},
	
    // update (dt) {},
});
