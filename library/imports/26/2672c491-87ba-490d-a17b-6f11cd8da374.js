"use strict";
cc._RF.push(module, '2672cSRh7pJDaF7bxHNjaN0', 'NewMj');
// script/NewMj.js

"use strict";

/**
 * 自己新牌位置
 */
var MyMj = require('MyMj');
cc.Class({
    extends: MyMj,

    properties: {},

    //新牌打出去，只调用出去动画
    takeOut: function takeOut(ent) {
        console.log("新牌打出去");
        this.hasNewMajiang = false;
        ent.node.destroy();
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();