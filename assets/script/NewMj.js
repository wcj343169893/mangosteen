/**
 * 自己新牌位置
 */
const MyMj = require('MyMj');
cc.Class({
    extends: MyMj,

    properties: {
    },
	
	//新牌打出去，只调用出去动画
	takeOut:function(ent){
		console.log("新牌打出去")
		this.hasNewMajiang=false;
		ent.node.destroy(); 
	},
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
