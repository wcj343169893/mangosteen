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
		//单个麻将宽度
		majiangWidth: 58,
		//单个麻将高度
		majiangHeight: 84,
		//麻将间隙，适用于所有横的排列
		majiangJianxi: 4,
		//是否有新牌
		//hasNewMajiang: false,
		//默认缩放，需要和自己的新牌保持一致
		initScale: 0.5,
		//手里牌列表
		//shouliList: [],
		realMjWidth:0,
		realMjHeight:0,
		lineCount:10,
		//打出去的麻将数组，方便以后高亮显示
		outMjs:[]
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
     	this.realMjWidth=(this.majiangWidth-this.majiangJianxi)*this.initScale;
     	this.realMjHeight=(this.majiangHeight-this.majiangJianxi)*this.initScale;
     },

    start () {

    },
    addNewMj:function(outmj){
    	this.outMjs.push(outmj);
    	this.game.outMjs.push(outmj);
    	this.scheduleOnce(function() {
    		console.log("调整大小");
    		//outmj.node.setScale(this.initScale);
    		//outmj.node.setPosition(this.getNewPosition());
    		let runTime=0.5;
    		// 创建一个移动动作
			let moveAction = cc.moveTo(runTime, this.getNewPosition());
			moveAction=moveAction.easing(cc.easeOut(3.0));
			let action = cc.spawn(
				cc.scaleTo(runTime, this.initScale),
				moveAction
			);
			// 执行动作
			outmj.node.runAction(action);
		 }, 2);
    },
    //获取一个新位置
    getNewPosition:function(){
    	let pos = this.getFixedPosition();
    	let len=this.outMjs.length-1;
    	let line = parseInt(len/this.lineCount);
    	
    	let pos2 = pos.add(cc.v2((len-line*this.lineCount)*this.realMjWidth,-(line*this.realMjHeight)))
    	
    	return pos2;
    },
    getFixedPosition:function(){
    	//手里牌宽度，固定后，不会随牌的数量增减而变化
    	let width=this.node.width;
    	let height=this.node.height;
    	//console.log(this.node)
    	//最左边一颗
    	let fixedPosition=cc.v2(-(width-this.realMjWidth)/2,(height-this.realMjHeight)/2);
    	return fixedPosition;
    },
    //高亮
    highlightMj:function(mjzz){
    	console.log("高亮",mjzz);
    	this.game.outMjs.forEach(function(value,index){
    		if(value.huase == mjzz.huase && value.number == mjzz.number){
    			value.highlight();
    		}else{
    			value.unHighlight();
    		}
    	}.bind(this));
    },
    //取消高亮
    unHighlightMj:function(mjzz){
    	console.log("取消高亮",mjzz)
    	this.game.outMjs.forEach(function(value,index){
    		if(value.huase == mjzz.huase && value.number == mjzz.number){
    			value.unHighlight();
    		}
    	}.bind(this));
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
