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
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "184e1nwIjpGmKPW+GtNNsQW", "Game");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        majiangPrefab: {
          default: null,
          type: cc.Prefab
        },
        playerPrefab: {
          default: null,
          type: cc.Prefab
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
        duiziCount: 0,
        duiziWidth: 0,
        duiziScale: 1,
        isSingle: true,
        majiangIndex: 0,
        currentMajiang: null,
        hasNewMajiang: false,
        shouliList: [],
        duiziList: [],
        angangList: [],
        minggangList: [],
        players: [],
        userId: 0,
        myPositionIndex: 0
      },
      onLoad: function onLoad() {
        console.log("\u5f00\u59cb\u6e38\u620f\uff0c\u521b\u5efa\u5bf9\u8c61\u6c60");
        this.initDefaultNumber();
        this.userId = 1234522;
        var user = {
          id: 12345,
          nickname: "\u7f8e\u7684\u53a8\u536b",
          avatar: "http://file5.cjblog.org/upload/b27695e79fd8908de0b18507f89d5b7c.jpg?x-oss-process=style/w60h60"
        };
        var user2 = {
          id: 1234522,
          nickname: "\u7f8e\u7684\u53a8\u536b22",
          avatar: "http://file5.cjblog.org/upload/b27695e79fd8908de0b18507f89d5b7c.jpg?x-oss-process=style/w60h60"
        };
        this.players.push(user);
        this.players.push(user2);
        this.initUserPosition();
        this.joinAllPeople();
        this.btnReady.node.on("click", this.beginEvent, this);
        this.btnGetOne.node.on("click", this.testMopai, this);
        this.btnJoinOne.node.on("click", this.testJoinPeople, this);
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
        this.initAllMajiang();
      },
      mopai: function mopai(mjzz) {
        var mj = this.spawnNewMj(mjzz);
        this.hasNewMajiang = true;
        var aw = this.getAW();
        mj.setPosition(this.getNewMjPosition(13, true, aw));
        this.node.addChild(mj);
      },
      initAllMajiang: function initAllMajiang() {
        this.testGetRandomNumbers();
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
        console.log("\u521b\u5efa\u73a9\u5bb6\uff1a", player.id, player.nickname, player.avatar);
        var playerEntity = cc.instantiate(this.playerPrefab);
        var config = playerEntity.getComponent("Player");
        config.game = this;
        config.nickName = player.nickname;
        config.userId = player.id;
        config.avatar = player.avatar;
        return playerEntity;
      },
      setOtherTakeOutPosition: function setOtherTakeOutPosition() {},
      initUserPosition: function initUserPosition() {
        var mine = cc.v2(this.originX + 60, this.originY + 120);
        var downstairs = cc.v2(-this.originX - 60, 80);
        var opposite = cc.v2(-this.originX - 280, -this.originY - 60);
        var upstairs = cc.v2(this.originX + 60, 80);
        this.positionList = [ mine, downstairs, opposite, upstairs ];
        console.log(this.positionList);
        this.players.forEach(function(value, index) {
          (value.id = this.userId) && (this.myPositionIndex = index);
        }.bind(this));
      },
      joinAllPeople: function joinAllPeople() {
        this.players.forEach(function(value, index) {
          this.joinNewPeople(value, index);
        }.bind(this));
      },
      joinNewPeople: function joinNewPeople(user, index) {
        var player = this.spawnNewPlayer(user);
        player.setPosition(this.getPlayerPosition(index));
        this.node.addChild(player);
      },
      getPlayerPosition: function getPlayerPosition(index) {
        var posIndex = this.getPlayerPositionIndex(index);
        return this.positionList[posIndex];
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
      testMopai: function testMopai() {
        var mjzz = this.numbers[this.majiangIndex];
        this.majiangIndex++;
        this.mopai(mjzz);
        this.btnGetOne.enabled = false;
      },
      testJoinPeople: function testJoinPeople() {
        var user = {
          id: 123,
          nickname: "\u5f20\u4e09",
          avatar: "http://file5.cjblog.org/upload/b27695e79fd8908de0b18507f89d5b7c.jpg?x-oss-process=style/w60h60"
        };
        if (this.players.length > 3) {
          this.btnJoinOne.enabled = false;
          return false;
        }
        this.players.push(user);
        this.joinNewPeople(user, this.players.length - 1);
      },
      testGetOne: function testGetOne() {
        setTimeout(function() {
          this.testMopai();
        }.bind(this), 3e3);
      }
    });
    cc._RF.pop();
  }, {} ],
  MajiangEntity: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "13a940UNwtE7Z1q0tp8pp8H", "MajiangEntity");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        bgNode: {
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
        this.getBackground();
        this.getNumber();
        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {}, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
          var endTimer = new Date().valueOf();
          endTimer - this.clickTimer < 300 ? this.onDoubleClick() : this.onClick();
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
          self.numbNode = new cc.Node("numberEntity");
          var sprite = self.numbNode.addComponent(cc.Sprite);
          sprite.spriteFrame = spriteFrame;
          self.numbNode.setPosition(cc.v2(0, -12));
          self.node.addChild(self.numbNode);
        });
      },
      onClick: function onClick() {
        if (!this.enabled) return;
        if (this.isSelected) this.unSelect(); else {
          this.isSelected = true;
          this.bgNode.setRotation(180);
          this.bgNode.setPosition(cc.v2(0, 22));
          this.numbNode.setPosition(cc.v2(0, 12));
          this.game.unSelectOthers(this);
        }
      },
      onDoubleClick: function onDoubleClick() {
        if (!this.game.hasNewMajiang) return;
        this.bgNode.setRotation(0);
        this.bgNode.setPosition(cc.v2(0, 22));
        this.numbNode.setPosition(cc.v2(0, 32));
        this.node.setScale(this.game.takeoutScale);
        console.log("\u7f29\u653e\u6bd4\u4f8b", this.game.takeoutScale);
        this.node.setPosition(this.game.getTakeOutPosition(this.node));
        this.enabled = false;
        this.node.off(cc.Node.EventType.TOUCH_START);
        this.node.off(cc.Node.EventType.TOUCH_END);
        this.game.removeShoulipai(this);
      },
      start: function start() {},
      unSelect: function unSelect() {
        this.isSelected = false;
        this.bgNode.setRotation(180);
        this.bgNode.setPosition(cc.v2(0, 0));
        this.numbNode.setPosition(cc.v2(0, -12));
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
  Player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "242b3zIVzpNw5F1xoTzMdk/", "Player");
    "use strict";
    cc.Class({
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
        nickName: {
          get: function get() {
            return this._nickName;
          },
          set: function set(value) {
            console.log("\u8bbe\u7f6e\u7528\u6237\u540d\uff1a", value);
            this._nickName = value;
          }
        },
        userId: 0,
        avatar: "",
        score: 0,
        ip: "",
        lack: "",
        isReady: false
      },
      onLoad: function onLoad() {
        console.log("\u6211\u662f", this.nickName, "\u6765\u62a5\u9053");
        var nlabel = this.nameLabel.getComponent(cc.Label);
        nlabel.string = this.nickName;
        var self = this;
        cc.loader.load({
          url: this.avatar,
          type: "jpg"
        }, function(err, texture) {
          console.log("\u5934\u50cf\u52a0\u8f7d\u5b8c\u6210");
          console.log(texture);
          var sprite = self.avatarSprite.getComponent(cc.Sprite);
          sprite.spriteFrame = new cc.SpriteFrame(texture);
        });
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "Game", "Majiang", "MajiangEntity", "Player" ]);