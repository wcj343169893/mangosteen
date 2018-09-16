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
    	},
    	//打出去多少张
    	takeoutIndex:0,
    	takeoutScale:0.5,
    	majiangWidth:58,
    	majiangHeight:84,
    	basicTakeout:0,
    	numbers:[],
    	//准备按钮
    	btnReady:cc.Button,
    	
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
     	console.log("开始游戏，创建对象池");
     	//console.log(this.node)
     	this.basicHeight=-this.node.height/2;
     	this.basicWidth=-this.node.width/2;
     	this.basicTakeout = this.basicHeight+220;
     	//准备按钮绑定事件
     	this.btnReady.node.on('click', this.begin, this);
     },

    start () {

    },

     update (dt) {
     	//console.log("更新画布",dt)
     },
     begin:function(){
     	//洗牌
     	this.initAllMajiang();
     	//显示到屏幕上
     	let mjSize = this.majiangPool.size();
     	console.log("麻将个数："+mjSize);
     	for(var i=0;i<mjSize;i++){
	     	let majiang = this.majiangPool.get();
	     	this.node.addChild(majiang);
     	}
     },
     initAllMajiang:function(){
     	this.getRandomNumbers();
     	this.majiangPool = new cc.NodePool();
     	let initCount = 13;
     	let nubArr_wan=[];
     	let nubArr_tiao=[];
     	let nubArr_tong=[];
     	for (let i = 0; i < initCount; ++i) {
     		let ent=this.numbers[i];
     		if(ent.huase=="wan"){
     			nubArr_wan.push(ent);
     		}else if(ent.huase=="tiao"){
	     		nubArr_tiao.push(ent);
     		}else{
	     		nubArr_tong.push(ent);
     		}
     	}
     	if(nubArr_wan.length>0){
	     	//按index排序
	     	nubArr_wan.sort(function(a,b){ 
	     		return a.number>b.number; 
	     	});
     	}
     	if(nubArr_tiao.length>0){
	     	//按index排序
	     	nubArr_tiao.sort(function(a,b){ 
	     		return a.number>b.number; 
	     	});
     	}
     	if(nubArr_tong.length>0){
	     	//按index排序
	     	nubArr_tong.sort(function(a,b){ 
	     		return a.number>b.number; 
	     	});
     	}
     	var posIndex=0;
     	for (let i = 0; i < nubArr_wan.length; ++i) {
			let mjzz=nubArr_wan[i];      
	        //生成一个新麻将
	        let mj = this.spawnNewMj(mjzz);
	        //一排，依次排开
			mj.setPosition(this.getNewMjPosition(posIndex));
	        this.majiangPool.put(mj); // 通过 putInPool 接口放入对象池
	        posIndex++;
	    }
     	for (let i = 0; i < nubArr_tiao.length; ++i) {
			let mjzz=nubArr_tiao[i];      
	        //生成一个新麻将
	        let mj = this.spawnNewMj(mjzz);
	        //一排，依次排开
			mj.setPosition(this.getNewMjPosition(posIndex));
	        this.majiangPool.put(mj); // 通过 putInPool 接口放入对象池
	        posIndex++;
	    }
     	for (let i = 0; i < nubArr_tong.length; ++i) {
			let mjzz=nubArr_tong[i];      
	        //生成一个新麻将
	        let mj = this.spawnNewMj(mjzz);
	        //一排，依次排开
			mj.setPosition(this.getNewMjPosition(posIndex));
	        this.majiangPool.put(mj); // 通过 putInPool 接口放入对象池
	        posIndex++;
	    }
     	
     },
     getRandomNumbers:function(){
     	//产生1-9数字 numbers  ,每个花色36个数字
	    var arr=[];
	    var huase=["tiao","tong","wan"];
	    for(var i=0;i<108;i++){
	    	let huaIndex=parseInt(i/36);
	    	let nub=i%9+1;
	        arr[i]={
	        	"index":i,
	        	"key":huase[huaIndex]+"_"+i,
	        	"huase":huase[huaIndex],
	        	"number":nub
	        };
	    }
	    //第一次打乱
	    arr.sort(function(){ return 0.5 - Math.random() });
	    //第二次打乱
	    arr.sort(function(){ return 0.5 - Math.random() });
	    console.log(arr);
	    this.numbers=arr;
	},
     spawnNewMj:function(mjzz){
     	console.log("创建麻将：",mjzz.huase,mjzz.number)
     	//生成一个新麻将
		var newMj= cc.instantiate(this.majiangPrefab);
		
		//console.log("已经new了")
		// 将新增的节点添加到 Canvas 节点下面
		//this.node.addChild(newMj);
		var config = newMj.getComponent('MajiangEntity');
		config.game = this;
		config.type=mjzz.huase;
		config.number=mjzz.number;
		
		//旋转成正面
		//newMj.setRotation(180)
		return newMj;
     },
     getNewMjPosition:function(index){
	    //获取新麻将的位置
     	var randX=this.basicWidth+(index+1)*(this.majiangWidth-4)+120;
     	var randY=this.basicHeight+160;//-this.node./2;
     	
     	return cc.v2(randX,randY);
     },
     getTakeOutPosition:function(){
     	let scaleWidth=(this.majiangWidth-4)*this.takeoutScale;
     	let outNumb=2;
     	//获取打出去的位置
     	let outLevel = parseInt(this.takeoutIndex/outNumb);
     	//scaleWidth*10/2+
     	let mjX=this.basicWidth+300+(scaleWidth*(this.takeoutIndex-outLevel*outNumb));
     	let mjY=this.basicTakeout+outLevel*(this.majiangHeight*this.takeoutScale);
     	this.takeoutIndex++;
     	console.log("位置：",outLevel,mjX,mjY);
     	return cc.v2(mjX,mjY);
     }
});
