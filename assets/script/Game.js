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
    	majiangPrefab:{
    		default:null,
    		type:cc.Prefab
    	}
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
     	console.log("开始游戏，创建对象池");
     	//洗牌
     	this.initAllMajiang();
     	//显示到屏幕上
     	let mjSize = this.majiangPool.size();
     	console.log("麻将个数："+mjSize);
     	
     	for(var i=0;i<mjSize;i++){
	     	let majiang = this.majiangPool.get();
	     	//console.log(majiang);
	     	this.node.addChild(majiang);
     	}
     },

    start () {

    },

     update (dt) {
     	//console.log("更新画布",dt)
     },
     initAllMajiang:function(){
     	this.majiangPool = new cc.NodePool();
     	let initCount = 13;
     	for (let i = 0; i < initCount; ++i) {
	        //let mmj = cc.instantiate(this.enemyPrefab); // 创建节点
	        //tiao   tong  wan
	        //生成一个新麻将
	        let mj = this.spawnNewMj("tiao",i+1);
	        //一排，依次排开
			mj.setPosition(this.getNewMjPosition(i));
	        this.majiangPool.put(mj); // 通过 putInPool 接口放入对象池
	    }
     },
     spawnNewMj:function(name,numb){
     	console.log("创建麻将：",name,numb)
     	//生成一个新麻将
		var newMj= cc.instantiate(this.majiangPrefab);
		
		console.log("已经new了")
		// 将新增的节点添加到 Canvas 节点下面
		//this.node.addChild(newMj);
		var config = newMj.getComponent('MajiangEntity');
		config.game = this;
		config.type=name;
		config.number=numb;
		return newMj;
     },
     getNewMjPosition:function(index){
     	var randX=(index+1)*58;
     	var randY=0;
     	
     	return cc.v2(randX,randY);
     }
});
