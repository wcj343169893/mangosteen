(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/NewMj.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2672cSRh7pJDaF7bxHNjaN0', 'NewMj', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=NewMj.js.map
        