window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Card: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6f06a7FMf5LDIcXtFzVHGhi", "Card");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        cardPrefab: {
          default: null,
          type: cc.Prefab
        },
        nickName: "",
        userId: "",
        avatar: "",
        score: 0
      },
      onLoad: function onLoad() {
        console.log("\u52a0\u8f7d\u6211\u7684\u540d\u7247\u533a\u57df");
      },
      initCardInfo: function initCardInfo(player) {
        console.log("\u521b\u5efa\u73a9\u5bb6\uff1a", player.uid, player.nickname, player.avatar);
        var cardEntity = cc.instantiate(this.cardPrefab);
        var config = cardEntity.getComponent("Player");
        cardEntity.setPosition(cc.v2(0, 0));
        config.userinfo = player;
        this.node.addChild(cardEntity);
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  CurrentMj: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f8847sv8VZLs4wgqCZGHu6m", "CurrentMj");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        MjSprite: {
          default: null,
          type: cc.Prefab
        },
        outPrefab: {
          default: null,
          type: cc.Prefab
        },
        majiangWidth: 58,
        majiangHeight: 84,
        majiangJianxi: 4,
        initScale: 1.25,
        realMjWidth: 0
      },
      onLoad: function onLoad() {
        this.realMjWidth = (this.majiangWidth - this.majiangJianxi) * this.initScale;
        this.realMjHeight = (this.majiangHeight - this.majiangJianxi) * this.initScale;
      },
      start: function start() {},
      initAllCurrentMj: function initAllCurrentMj(mjs) {
        var width = this.node.width;
        var aLength = mjs.length - 1;
        var fixedPosition = this.getFixedPosition();
        mjs.forEach(function(value, index) {
          var majiang = this.spawnNewMj(value, false);
          var pos = fixedPosition.sub(cc.v2((aLength - index) * this.realMjWidth, 0));
          majiang.setPosition(pos);
          this.node.addChild(majiang);
        }.bind(this));
        this.scheduleUpdate();
      },
      scheduleUpdate: function scheduleUpdate() {
        this.scheduleOnce(function() {
          console.log("\u66f4\u65b0\u987a\u5e8f");
          this.updateSort();
        }, .5);
      },
      getOne: function getOne(mjzz) {
        console.log("\u83b7\u53d6\u65b0\u724c");
        this.game.hasNewMajiang = true;
        var majiang = this.spawnNewMj(mjzz, true);
        this.node.addChild(majiang);
        console.log("\u65b0", this.game.hasNewMajiang);
        console.log(this.CurrentMj);
      },
      spawnNewMj: function spawnNewMj(mjzz, isNewOne) {
        console.log("\u521b\u5efa\u9ebb\u5c06\uff1a", mjzz.huase, mjzz.number);
        var mj = cc.instantiate(this.MjSprite);
        var config = mj.getComponent("MajiangEntity");
        config.game = this.game;
        config.majiang = this;
        config.mjzz = mjzz;
        config.huase = mjzz.huase;
        config.number = mjzz.number;
        config.index = mjzz.index;
        config.isNewOne = isNewOne;
        mj.setScale(this.initScale);
        this.game.shouliList.push(config);
        return mj;
      },
      spawnNewOutMj: function spawnNewOutMj(mjzz) {
        console.log("\u521b\u5efa\u4e22\u5f03\u9ebb\u5c06\uff1a", mjzz.huase, mjzz.number);
        var mj = cc.instantiate(this.outPrefab);
        var config = mj.getComponent("OutMj");
        config.game = this.game;
        config.dage = this.dustbin;
        config.huase = mjzz.huase;
        config.number = mjzz.number;
        config.index = mjzz.index;
        this.dustbin.addNewMj(config);
        return mj;
      },
      unSelectOthers: function unSelectOthers(ent) {
        this.game.shouliList.forEach(function(value, index) {
          value.index != ent.index && value.isSelected && value.unSelect();
        }.bind(this));
      },
      updateSort: function updateSort() {
        var newList = [];
        var aLength = this.game.shouliList.length - 1;
        var fixedPosition = this.getFixedPosition();
        this.game.shouliList.sort(function(a, b) {
          return a.index - b.index;
        });
        var newNode = void 0;
        var newPos = void 0;
        var isLast = false;
        var rightLength = void 0;
        this.game.shouliList.forEach(function(value, index) {
          var pos = fixedPosition.sub(cc.v2((aLength - index) * this.realMjWidth, 0));
          if (value.isNewOne) {
            newNode = value;
            newPos = pos;
            isLast = aLength == index;
            rightLength = aLength - index + 1;
          } else value.node.setPosition(pos);
        }.bind(this));
        if (newNode) {
          var parentNode = this.node;
          this.scheduleOnce(function() {
            newNode.node.parent = parentNode;
            newNode.isNewOne = false;
            var beginPos = fixedPosition.add(cc.v2(this.realMjWidth + 28.5, 0));
            newNode.node.setPosition(beginPos);
            if (isLast) {
              var action = cc.moveTo(.2, newPos);
              action.easing(cc.easeIn(3));
              newNode.node.runAction(action);
            } else {
              var newPosFirst = beginPos.add(cc.v2(0, this.realMjHeight));
              var pos2 = newPos.add(cc.v2(0, this.realMjHeight));
              var moveTime = .15;
              var flyAction = cc.moveTo(moveTime * rightLength, pos2);
              flyAction = flyAction.easing(cc.easeInOut(3));
              var flyRota = cc.rotateTo(moveTime * rightLength, 0);
              var moveAction = cc.sequence(cc.spawn(cc.scaleTo(.1, .8, .8), cc.rotateTo(.1, 61), cc.moveTo(.1, newPosFirst)), cc.spawn(cc.scaleTo(.2, 1, 1), flyRota, flyAction), cc.delayTime(.1), cc.spawn(cc.scaleTo(.1, this.initScale), cc.moveTo(.1, newPos))).speed(2);
              newNode.node.runAction(moveAction);
            }
            newNode.majiang = this;
            console.log(this.game.shouliList);
            console.log(newNode, newPos);
          }, 1);
        }
      },
      removeFromList: function removeFromList(ent) {
        var newList = [];
        this.game.shouliList.forEach(function(value, index) {
          value.index != ent.index && newList.push(value);
        }.bind(this));
        this.game.shouliList = newList;
        console.log("\u79fb\u9664\u4e4b\u540e", this.game.shouliList);
        ent.node.destroy();
      },
      takeOut: function takeOut(ent) {
        console.log("\u624b\u91cc\u724c\u6253\u51fa\u53bb");
        var posX = ent.node.x;
        var outMj = this.spawnNewOutMj(ent.mjzz);
        console.log(outMj);
        outMj.setPosition(cc.v2(posX, 0));
        this.removeFromList(ent);
        this.node.addChild(outMj);
        this.scheduleOnce(function() {
          outMj.parent = this.dustbin.node;
          outMj.setPosition(cc.v2(0, 0));
          console.log("\u8f6c\u79fb\u7236\u7c7b");
        }, .05);
      },
      moveMjFromNew: function moveMjFromNew() {},
      unHighlightMj: function unHighlightMj(mjzz) {
        this.dustbin.unHighlightMj(mjzz);
      },
      highlightMj: function highlightMj(mjzz) {
        this.dustbin.highlightMj(mjzz);
      },
      getFixedPosition: function getFixedPosition() {
        var width = this.node.width;
        var fixedPosition = cc.v2(width / 2 - this.realMjWidth / 2);
        return fixedPosition;
      }
    });
    cc._RF.pop();
  }, {} ],
  DownstairPlayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4d298rZCVBGZq8oo6iea2TM", "DownstairPlayer");
    "use strict";
    var Player = require("Player");
    cc.Class({
      extends: Player,
      properties: {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    Player: "Player"
  } ],
  Dustbin: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a6863BOUDFGD5eLX80/58es", "Dustbin");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        outPrefab: {
          default: null,
          type: cc.Prefab
        },
        majiangWidth: 58,
        majiangHeight: 84,
        majiangJianxi: 4,
        initScale: .5,
        realMjWidth: 0,
        realMjHeight: 0,
        lineCount: 10,
        outMjs: []
      },
      onLoad: function onLoad() {
        this.realMjWidth = (this.majiangWidth - this.majiangJianxi) * this.initScale;
        this.realMjHeight = (this.majiangHeight - this.majiangJianxi) * this.initScale;
      },
      start: function start() {},
      addNewMj: function addNewMj(outmj) {
        this.outMjs.push(outmj);
        this.game.outMjs.push(outmj);
        this.scheduleOnce(function() {
          console.log("\u8c03\u6574\u5927\u5c0f");
          var runTime = .5;
          var moveAction = cc.moveTo(runTime, this.getNewPosition());
          moveAction = moveAction.easing(cc.easeOut(3));
          var action = cc.spawn(cc.scaleTo(runTime, this.initScale), moveAction);
          outmj.node.runAction(action);
        }, 2);
      },
      getNewPosition: function getNewPosition() {
        var pos = this.getFixedPosition();
        var len = this.outMjs.length - 1;
        var line = parseInt(len / this.lineCount);
        var pos2 = pos.add(cc.v2((len - line * this.lineCount) * this.realMjWidth, -line * this.realMjHeight));
        return pos2;
      },
      getFixedPosition: function getFixedPosition() {
        var width = this.node.width;
        var height = this.node.height;
        var fixedPosition = cc.v2(-(width - this.realMjWidth) / 2, (height - this.realMjHeight) / 2);
        return fixedPosition;
      },
      highlightMj: function highlightMj(mjzz) {
        console.log("\u9ad8\u4eae", mjzz);
        this.game.outMjs.forEach(function(value, index) {
          value.huase == mjzz.huase && value.number == mjzz.number ? value.highlight() : value.unHighlight();
        }.bind(this));
      },
      unHighlightMj: function unHighlightMj(mjzz) {
        console.log("\u53d6\u6d88\u9ad8\u4eae", mjzz);
        this.game.outMjs.forEach(function(value, index) {
          value.huase == mjzz.huase && value.number == mjzz.number && value.unHighlight();
        }.bind(this));
      },
      takeOut: function takeOut(mjzz, pos, pos2) {}
    });
    cc._RF.pop();
  }, {} ],
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "184e1nwIjpGmKPW+GtNNsQW", "Game");
    "use strict";
    var _properties;
    function _defineProperty(obj, key, value) {
      key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      }) : obj[key] = value;
      return obj;
    }
    var Player = require("Player");
    cc.Class({
      extends: cc.Component,
      properties: (_properties = {
        majiangPrefab: {
          default: null,
          type: cc.Prefab
        },
        playerPrefab: {
          default: null,
          type: cc.Prefab
        },
        playerEntities: {
          default: [],
          type: Player
        },
        takeoutIndex: 0,
        takeoutScale: 1,
        initScale: 1.25,
        majiangWidth: 58,
        majiangHeight: 84,
        majiangJianxi: 4,
        basicTakeoutY: 0,
        numbers: [],
        btnReady: cc.Button,
        btnGetOne: cc.Button,
        btnJoinOne: cc.Button,
        btnNewReady: cc.Button,
        duiziCount: 0,
        duiziWidth: 0,
        duiziScale: 1,
        duimianMjScale: 1,
        duimianMjWidth: 36,
        isSingle: true,
        majiangIndex: 0,
        currentMajiang: null,
        hasNewMajiang: false,
        shouliList: [],
        duiziList: [],
        angangList: [],
        minggangList: [],
        players: []
      }, _defineProperty(_properties, "playerEntities", null), _defineProperty(_properties, "userId", 0), 
      _defineProperty(_properties, "myPositionIndex", 0), _defineProperty(_properties, "outMjs", []), 
      _properties),
      onLoad: function onLoad() {
        console.log("\u5f00\u59cb\u6e38\u620f\uff0c\u521b\u5efa\u5bf9\u8c61\u6c60");
        this.initDefaultNumber();
        this.seatsNames = [ "LeadSeat", "DownSeat", "OppositeSeat", "UpSeat" ];
        this.userId = 10002;
        var user = {
          uid: 10001,
          nickname: "\u7279\u5de510001",
          avatar: "http://file5.cjblog.org/upload/b27695e79fd8908de0b18507f89d5b7c.jpg?x-oss-process=style/w60h60"
        };
        var user2 = {
          uid: 10002,
          nickname: "\u7279\u5de510002",
          avatar: "http://file5.cjblog.org/upload/b27695e79fd8908de0b18507f89d5b7c.jpg?x-oss-process=style/w60h60"
        };
        var user3 = {
          uid: 10003,
          nickname: "\u7279\u5de510003",
          avatar: "http://file5.cjblog.org/upload/b27695e79fd8908de0b18507f89d5b7c.jpg?x-oss-process=style/w60h60"
        };
        var user4 = {
          uid: 10004,
          nickname: "\u7279\u5de510004",
          avatar: "http://file5.cjblog.org/upload/b27695e79fd8908de0b18507f89d5b7c.jpg?x-oss-process=style/w60h60"
        };
        this.players.push(user);
        this.players.push(user2);
        this.players.push(user3);
        console.log(this.players);
        this.initUserPosition();
        this.joinAllPeople();
        this.btnReady.node.on("click", this.beginEvent, this);
        this.btnGetOne.node.on("click", this.testBeginMopai, this);
        this.btnJoinOne.node.on("click", this.testJoinPeople, this);
        this.btnNewReady.node.on("click", this.testNewBegin, this);
      },
      start: function start() {},
      update: function update(dt) {},
      initDefaultNumber: function initDefaultNumber() {
        var width = Math.floor(this.node.width);
        var height = Math.floor(this.node.height);
        this.originX = -width / 2;
        this.originY = -height / 2;
        this.basicTakeoutY = this.originY + this.majiangHeight * this.initScale + 40;
        console.log(width, height);
        this.majiangAllWidth = 13 * (this.majiangWidth * this.initScale - this.majiangJianxi);
        this.duiziWidth = 3 * (this.majiangWidth - this.majiangJianxi) * this.duiziScale;
      },
      beginEvent: function beginEvent() {
        console.log("\u6211\u5df2\u7ecf\u51c6\u5907\u597d\u4e86");
        this.testGetRandomNumbers();
        this.initAllMajiang();
        this.initDownStairsMjs();
      },
      mopai: function mopai(uid, mjzz) {
        console.log("\u7528\u6237\uff1a", uid, "\u6478\u724c", mjzz);
        if (uid == this.userId) {
          var mj = this.spawnNewMj(mjzz);
          this.hasNewMajiang = true;
          this.currentMajiang = mj.getComponent("MajiangEntity");
          mj.setPosition(this.playerNewMjPositionList[0]);
          this.node.addChild(mj);
        } else {
          var index = this.getPlayerIndexByUid(uid);
          var pos = this.playerNewMjPositionList[index];
        }
      },
      initAllMajiang: function initAllMajiang() {
        var initCount = 13;
        var nubArr = [];
        for (var i = 0; i < initCount; ++i) {
          var ent = this.numbers[i];
          nubArr.push(ent);
          this.majiangIndex++;
        }
        console.log(nubArr);
        for (var _i = 0; _i < nubArr.length; ++_i) {
          var mjzz = nubArr[_i];
          var mj = this.spawnNewMj(mjzz);
          this.node.addChild(mj);
        }
        this.updateShoulipai();
      },
      spawnNewMj: function spawnNewMj(mjzz) {
        console.log("\u521b\u5efa\u9ebb\u5c06\uff1a", mjzz.huase, mjzz.number);
        var mj = cc.instantiate(this.majiangPrefab);
        var config = mj.getComponent("MajiangEntity");
        config.game = this;
        config.huase = mjzz.huase;
        config.number = mjzz.number;
        config.index = mjzz.index;
        mj.setScale(this.initScale);
        this.shouliList.push(config);
        return mj;
      },
      spawnNewOtherMj: function spawnNewOtherMj(pos) {},
      getNewMjPosition: function getNewMjPosition(index, isNewOne, start) {
        var randX = start - this.majiangAllWidth / 2 + index * (this.majiangWidth * this.initScale - this.majiangJianxi);
        var randY = this.originY + 70;
        if (isNewOne) {
          randX += 20;
          console.log("\u65b0\u724c\u4f4d\u7f6e\uff1a", index, randX, randY);
        }
        return cc.v2(randX, randY);
      },
      getTakeOutPosition: function getTakeOutPosition(node) {
        var scaleWidth = (this.majiangWidth - this.majiangJianxi) * this.takeoutScale;
        var outNumb = 10;
        var outLevel = parseInt(this.takeoutIndex / outNumb);
        var mjX = -outNumb * scaleWidth / 2 + scaleWidth * (this.takeoutIndex - outLevel * outNumb);
        var mjY = this.basicTakeoutY + outLevel * (this.majiangHeight * this.takeoutScale);
        this.takeoutIndex++;
        console.log("\u5783\u573e\u6876\u4f4d\u7f6e\uff1a", outLevel, mjX, mjY);
        return cc.v2(mjX, mjY);
      },
      removeShoulipai: function removeShoulipai(ent) {
        var shouli = [];
        this.shouliList.forEach(function(value, ind) {
          value.index != ent.index && shouli.push(value);
        }.bind(this));
        this.shouliList = shouli;
        this.updateShoulipai(true);
      },
      updateShoulipai: function updateShoulipai(getOther) {
        var newList = [];
        var aw = this.getAW();
        var index = 0;
        this.shouliList.sort(function(a, b) {
          return a.index - b.index;
        });
        this.shouliList.forEach(function(value, ind) {
          value.node.setPosition(this.getNewMjPosition(ind, false, aw));
        }.bind(this));
        this.hasNewMajiang = false;
        getOther && this.testGetOne();
      },
      getAW: function getAW() {
        var duigangWidth = this.duiziWidth;
        var aw = (this.duiziList.length + this.angangList.length + this.minggangList.length) * (duigangWidth + 10) + 50;
        return aw;
      },
      unSelectOthers: function unSelectOthers(ent) {
        this.isSingle && this.shouliList.forEach(function(value, ind) {
          value.index != ent.index && value.isSelected && value.unSelect();
        });
      },
      spawnNewPlayer: function spawnNewPlayer(player) {
        console.log("\u521b\u5efa\u73a9\u5bb6\uff1a", player.uid, player.nickname, player.avatar);
        var playerEntity = cc.instantiate(this.playerPrefab);
        var config = playerEntity.getComponent("Player");
        config.game = this;
        config.userinfo = player;
        this.playerEntities[player.uid] = config;
        return playerEntity;
      },
      setOtherTakeOutPosition: function setOtherTakeOutPosition() {},
      initUserPosition: function initUserPosition() {
        this.players.forEach(function(value, index) {
          value.uid == this.userId && (this.myPositionIndex = index);
        }.bind(this));
      },
      initFixedMjPositions: function initFixedMjPositions() {
        var mine = cc.v2(this.majiangAllWidth / 2, this.originY + 70);
        var mine_new = mine.add(cc.v2(10, 0));
        var downstairs = cc.v2(this.majiangAllWidth / 2, -56);
        var downstairs_new = downstairs.add(cc.v2(5, 5));
        this.duimianMjAllWidth = 13 * this.duimianMjWidth;
        var opposite = cc.v2(this.duimianMjAllWidth / 2 * this.duimianMjScale, -this.originY - 64);
        var opposite_new = opposite.add(cc.v2(-10, 0));
        var upstairs = cc.v2(-this.majiangAllWidth / 2 + 60, 184);
        var upstairs_new = upstairs.add(cc.v2(-5, -5));
        this.playerFixedMjPositionList = [ mine, downstairs, opposite, upstairs ];
        this.playerNewMjPositionList = [ mine_new, downstairs_new, opposite_new, upstairs_new ];
        console.log(this.playerFixedMjPositionList);
        console.log(this.playerNewMjPositionList);
      },
      initAvatarPositions: function initAvatarPositions() {
        var aWidth = 86;
        var aHeight = 126;
        var padding = 20;
        var mine = cc.v2(this.originX + aWidth / 2 + padding, this.originY + aHeight / 2 + 60);
        var downstairs = cc.v2(-this.originX - aWidth / 2 - padding, 80);
        var opposite = cc.v2(-this.originX - 280, -this.originY - aHeight / 2 - padding);
        var upstairs = cc.v2(this.originX + aWidth / 2 + padding, 80);
        this.avatarPositionList = [ mine, downstairs, opposite, upstairs ];
        console.log(this.avatarPositionList);
      },
      joinAllPeople: function joinAllPeople() {
        this.playerEntities = {};
        this.players.forEach(function(value, index) {
          this.joinNewPeople(value, index);
        }.bind(this));
      },
      joinNewPeople: function joinNewPeople(user, index) {
        user["joinIndex"] = index;
        var posIndex = this.getPlayerPositionIndex(index);
        user["posIndex"] = posIndex;
        var seatName = this.seatsNames[posIndex];
        var seat = this.node.getChildByName(seatName);
        var ShowMjNode = seat.getChildByName("ShowMjNode");
        var DustbinNode = seat.getChildByName("DustbinNode");
        var Dustbin = DustbinNode.getComponent("Dustbin");
        Dustbin.game = this;
        var CardNode = ShowMjNode.getChildByName("CardNode");
        var card = CardNode.getComponent("Card");
        card.initCardInfo(user);
        var NewMjNode = ShowMjNode.getChildByName("NewMjNode");
        var NewMj = NewMjNode.getComponent("CurrentMj");
        var CurrentMjNode = ShowMjNode.getChildByName("CurrentMjNode");
        var CurrentMj = CurrentMjNode.getComponent("CurrentMj");
        NewMj.CurrentMj = CurrentMj;
        NewMj.game = this;
        CurrentMj.NewMj = NewMj;
        CurrentMj.game = this;
        CurrentMj.dustbin = Dustbin;
        NewMj.dustbin = Dustbin;
      },
      getPlayerIndexByUid: function getPlayerIndexByUid(uid) {
        var userIndex = 0;
        this.players.forEach(function(value, index) {
          value.uid == uid && (userIndex = index);
        });
        return userIndex;
      },
      getPlayerPosition: function getPlayerPosition(index) {
        var posIndex = this.getPlayerPositionIndex(index);
        return this.avatarPositionList[posIndex];
      },
      getPlayerPositionIndex: function getPlayerPositionIndex(index) {
        var posIndex = index - this.myPositionIndex;
        posIndex < 0 && (posIndex += 4);
        return posIndex;
      },
      testGetRandomNumbers: function testGetRandomNumbers() {
        var arr = [];
        var huase = [ "tiao", "tong", "wan" ];
        var index = 0;
        huase.forEach(function(se, ind) {
          for (var ds = 1; ds <= 9; ds++) for (var amount = 0; amount < 4; amount++) {
            arr.push({
              index: index,
              key: se + "_" + ds,
              huase: se,
              number: ds
            });
            index++;
          }
        });
        arr.sort(function() {
          return .5 - Math.random();
        });
        arr.sort(function() {
          return .5 - Math.random();
        });
        this.numbers = arr;
      },
      testBeginMopai: function testBeginMopai() {
        this.majiangIndex++;
        var mjzz = this.numbers[this.majiangIndex];
        var LeadSeat = this.node.getChildByName("LeadSeat");
        var ShowMjNode = LeadSeat.getChildByName("ShowMjNode");
        var NewMjNode = ShowMjNode.getChildByName("NewMjNode");
        var CurrentMj = NewMjNode.getComponent("CurrentMj");
        CurrentMj.getOne(mjzz);
      },
      testGetOne: function testGetOne() {
        var ind = parseInt(4 * Math.random());
        var uid = this.players[ind].uid;
        this.majiangIndex++;
        var mjzz = this.numbers[this.majiangIndex];
        setTimeout(function() {
          this.mopai(uid, mjzz);
        }.bind(this), 3e3);
      },
      testJoinPeople: function testJoinPeople() {
        var user = {
          uid: 10004,
          nickname: "\u5f20\u4e0910004",
          avatar: "http://file5.cjblog.org/upload/b27695e79fd8908de0b18507f89d5b7c.jpg?x-oss-process=style/w60h60"
        };
        this.players.push(user);
        this.joinNewPeople(user, this.players.length - 1);
        4 == this.players.length && (this.btnJoinOne.enabled = false);
      },
      testNewBegin: function testNewBegin() {
        var LeadSeat = this.node.getChildByName("LeadSeat");
        var ShowMjNode = LeadSeat.getChildByName("ShowMjNode");
        var DustbinNode = LeadSeat.getChildByName("DustbinNode");
        var Dustbin = DustbinNode.getComponent("Dustbin");
        Dustbin.game = this;
        var NewMjNode = ShowMjNode.getChildByName("NewMjNode");
        var NewMj = NewMjNode.getComponent("CurrentMj");
        var CurrentMjNode = ShowMjNode.getChildByName("CurrentMjNode");
        var CurrentMj = CurrentMjNode.getComponent("CurrentMj");
        NewMj.CurrentMj = CurrentMj;
        NewMj.game = this;
        CurrentMj.NewMj = NewMj;
        CurrentMj.game = this;
        CurrentMj.dustbin = Dustbin;
        NewMj.dustbin = Dustbin;
        this.testGetRandomNumbers();
        var initCount = 13;
        var nubArr = [];
        for (var i = 0; i < initCount; ++i) {
          var ent = this.numbers[i];
          nubArr.push(ent);
          this.majiangIndex++;
        }
        CurrentMj.initAllCurrentMj(nubArr);
        console.log(CurrentMjNode);
      },
      initDownStairsMjs: function initDownStairsMjs() {
        var initCount = 13;
        var nubArr = [];
        for (var i = 0; i < initCount; ++i) {
          var ent = this.numbers[i];
          nubArr.push(ent);
          this.majiangIndex++;
        }
        for (var _i2 = 0; _i2 < nubArr.length; ++_i2) var mjzz = nubArr[_i2];
      }
    });
    cc._RF.pop();
  }, {
    Player: "Player"
  } ],
  LeadPlayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fc97bDmYiVLxKIBvy+UbnRE", "LeadPlayer");
    "use strict";
    var Player = require("Player");
    cc.Class({
      extends: Player,
      properties: {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    Player: "Player"
  } ],
  MajiangEntity: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "13a940UNwtE7Z1q0tp8pp8H", "MajiangEntity");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        numberNode: {
          default: null,
          type: cc.Node
        },
        huase: "",
        number: 0,
        selectDuration: 1,
        status: 0,
        isSelected: false,
        clickTimer: 0
      },
      onLoad: function onLoad() {
        this.getNumber();
        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {}, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
          var endTimer = new Date().valueOf();
          endTimer - this.clickTimer < 500 ? this.onDoubleClick() : this.onClick();
          this.clickTimer = endTimer;
        }, this);
      },
      setStatus: function setStatus(state) {
        var self = this;
        0 == self.status || 1 == self.status;
      },
      getBackground: function getBackground() {
        this.bgNode.setPosition(cc.v2(0, 0));
        this.bgNode.setRotation(180);
      },
      getNumber: function getNumber() {
        var name = this.huase + "_" + this.number;
        console.log("\u5f00\u59cb\u6570\u5b57", name);
        var self = this;
        cc.loader.loadRes(name, cc.SpriteFrame, function(err, spriteFrame) {
          var sprite = this.numberNode.addComponent(cc.Sprite);
          sprite.spriteFrame = spriteFrame;
          this.numberNode.setPosition(cc.v2(0, -12));
        }.bind(this));
      },
      onClick: function onClick() {
        if (!this.enabled) return;
        if (this.isSelected) {
          this.unSelect();
          this.majiang.unHighlightMj(this.mjzz);
        } else {
          this.isSelected = true;
          var pos = this.node.getPosition();
          this.node.setPosition(pos.add(cc.v2(0, 20)));
          this.majiang.unSelectOthers(this);
          this.majiang.highlightMj(this.mjzz);
        }
      },
      onDoubleClick: function onDoubleClick() {
        if (!this.game.hasNewMajiang) return;
        this.game.hasNewMajiang = false;
        this.majiang.takeOut(this);
        this.isNewOne || this.majiang.scheduleUpdate();
        return;
      },
      start: function start() {},
      unSelect: function unSelect() {
        this.isSelected = false;
        var pos = this.node.getPosition();
        this.node.setPosition(pos.sub(cc.v2(0, 20)));
      }
    });
    cc._RF.pop();
  }, {} ],
  Majiang: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1ab840hXwpB44DltKvhflHI", "Majiang");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        nickName: "",
        outAudio: {
          default: null,
          type: cc.AudioClip
        },
        inAudio: {
          default: null,
          type: cc.AudioClip
        }
      },
      onLoad: function onLoad() {
        console.log("\u52a0\u8f7d\u9ebb\u5c06----");
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  MyMj: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7cbb4gVzJJDyZ4f5mZkbQq/", "MyMj");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        MjSprite: {
          default: null,
          type: cc.Prefab
        },
        majiangWidth: 58,
        majiangHeight: 84,
        majiangJianxi: 4,
        hasNewMajiang: false,
        initScale: 1.25,
        shouliList: []
      },
      takeOut: function takeOut(ent) {
        console.log("\u7236\u7c7b\u724c\u6253\u51fa\u53bb,\u968f\u540e\u8c03\u7528\u7279\u6548");
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  NewMj: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2672cSRh7pJDaF7bxHNjaN0", "NewMj");
    "use strict";
    var MyMj = require("MyMj");
    cc.Class({
      extends: MyMj,
      properties: {},
      takeOut: function takeOut(ent) {
        console.log("\u65b0\u724c\u6253\u51fa\u53bb");
        this.hasNewMajiang = false;
        ent.node.destroy();
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    MyMj: "MyMj"
  } ],
  OppositePlayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "129dapaISdFIpnt1dgcyMqz", "OppositePlayer");
    "use strict";
    var Player = require("Player");
    cc.Class({
      extends: Player,
      properties: {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    Player: "Player"
  } ],
  OutMj: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1f3cf7mPnZEbIKvb1QQ7x3c", "OutMj");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        numberNode: {
          default: null,
          type: cc.Node
        },
        huase: "",
        number: 0,
        isHighlight: false
      },
      onLoad: function onLoad() {
        console.log("\u6253\u51fa\u53bb\u5566.....");
        this.getNumber();
      },
      getNumber: function getNumber() {
        var name = this.huase + "_" + this.number;
        console.log("\u5f00\u59cb\u6570\u5b57", name);
        cc.loader.loadRes(name, cc.SpriteFrame, function(err, spriteFrame) {
          var sprite = this.numberNode.addComponent(cc.Sprite);
          sprite.spriteFrame = spriteFrame;
          this.numberNode.setPosition(cc.v2(0, 10));
        }.bind(this));
      },
      highlight: function highlight() {
        console.log("\u4eb2\u81ea\u9ad8\u4eae");
        this.isHighlight = true;
      },
      unHighlight: function unHighlight() {
        if (this.isHighlight) {
          this.isHighlight = false;
          console.log("\u4eb2\u81ea\u6697\u4e0b\u6765");
        }
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  Player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "242b3zIVzpNw5F1xoTzMdk/", "Player");
    "use strict";
    var Player = cc.Class({
      extends: cc.Component,
      properties: {
        nameLabel: {
          default: null,
          type: cc.Label
        },
        scoreLabel: {
          default: null,
          type: cc.Label
        },
        avatarSprite: {
          default: null,
          type: cc.Sprite
        },
        userinfo: {
          default: null
        },
        nickName: "",
        userId: "",
        avatar: "",
        score: 0,
        ip: "",
        lack: "",
        isReady: false
      },
      onLoad: function onLoad() {
        console.log("\u6211\u662f", this.userinfo.nickname, "\u6765\u62a5\u9053");
        var nlabel = this.nameLabel.getComponent(cc.Label);
        nlabel.string = this.userinfo.nickname;
        this.userId = this.userinfo.uid;
        this.avatar = this.userinfo.avatar;
        var self = this;
        cc.loader.load({
          url: this.avatar,
          type: "jpg"
        }, function(err, texture) {
          var sprite = this.avatarSprite.getComponent(cc.Sprite);
          sprite.spriteFrame = new cc.SpriteFrame(texture);
        }.bind(this));
      },
      start: function start() {},
      getNewMj: function getNewMj(mjzz) {},
      deleteMj: function deleteMj() {},
      pengMj: function pengMj() {},
      mingGangMj: function mingGangMj() {},
      anGangMj: function anGangMj() {},
      huMj: function huMj() {},
      checkJiao: function checkJiao() {}
    });
    cc._RF.pop();
  }, {} ],
  UpstairPlayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "419cav/eFVHvLgEM7+VIkTU", "UpstairPlayer");
    "use strict";
    var Player = require("Player");
    cc.Class({
      extends: Player,
      properties: {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    Player: "Player"
  } ]
}, {}, [ "Card", "CurrentMj", "DownstairPlayer", "Dustbin", "Game", "LeadPlayer", "Majiang", "MajiangEntity", "MyMj", "NewMj", "OppositePlayer", "OutMj", "Player", "UpstairPlayer" ]);