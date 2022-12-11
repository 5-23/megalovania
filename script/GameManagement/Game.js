import { Animation } from "../AssetsManagement/Animation.js"
import { Sprite } from "../AssetsManagement/Sprite.js";
import { SpriteSheet } from "../AssetsManagement/SpriteSheet.js";
import { Debugger } from "../Components/Collider.js";
import { randomInt } from "../Constants/GameMath.js";
import { KeyListener } from "../InputManagement/KeyListener.js";
import { BattleBox } from "../Objects/BattleBox.js";
import { Heart } from "../Objects/Heart.js";
import { Sans } from "../Objects/Sans.js";
import { Generator } from "./Generator.js";
import { DrawBone } from "../Objects/Bone.js";
import { Sound } from "../AssetsManagement/Sound.js";

const Game = {
  canvas: null,
  ctx: null,
  obj: {},

  load: function(canvasID) {
    this.canvas = document.getElementById(canvasID);
    this.ctx = this.canvas.getContext("2d");

    KeyListener.listenKeyEvent();
    Generator.canvas = this.canvas;
    Animation.ctx = this.ctx;
    Sprite.ctx = this.ctx;
    Debugger.ctx = this.ctx;
    DrawBone.ctx = this.ctx;
    
    SpriteSheet.load();
    Sound.load();

    this.ctx.withinRange = (x, y) => (
      -200 > x || x > this.canvas.width + 200 ||
      -200 > y || y > 960 + 200 );
    this.obj = {
      canvas: this.canvas,
      ctx: this.ctx,
      dt: 0
    };

    this.battleBox = new BattleBox(this.obj);
    this.obj.battleBox = this.battleBox;
    this.player = new Heart(this.obj, this.battleBox, 350);
    this.obj.player = this.player;

    Generator.obj = this.obj;

    this.gasterBlaster = [];
    this.tornado = [];
    this.platformer = [];
    this.sans = new Sans(this.obj);
    this.lineBone = [];
    this.rotBones = [];
    this.alertBones = [];
    this.lineBoneX = [];

    this.lastUpdate = Date.now();
  },

  start: function() {
    this.gameLoop();
    Sound.play("megalovania");
  },

  t: 0,
  t1: 0,
  t2: 0,
  t3: 0,
  t4: 0,
  t5: 0,

  gameLoop: function() {
    const now = Date.now();
    this.obj.dt = (now - this.lastUpdate) / 1000;
    this.lastUpdate = now;
    // console.log(this.obj.dt);

    this.t += this.obj.dt;
    if (this.t > 0.3) {
      this.t = 0;
      
      for (let func of [ "upLeft", "upRight", "rightUp", "rightDown", "leftUp", "leftDown", "downLeft", "downRight" ]) {
        // this.lineBone.push(Generator.LineBone[func](300, randomInt(20, 40)));
        this.lineBone.push(Generator.LineBone_blue[func](300, randomInt(20, 40)));
      }
    }

    this.t1 += this.obj.dt;
    if (this.t1 > 2) {
      this.t1 = 0;

      this.rotBones.push(Generator.RotBones.targetPlayer());
    }

    this.t2 += this.obj.dt;
    if (this.t2 > 2) {
      this.t2 = 0;

      for (let func of ["up", "down", "left", "right"]) {
        this.alertBones.push(Generator.AlertBones[func](150, 1));
      }
    }

    // this.t3 += this.obj.dt;
    // if (this.t3 > 0.4) {
    //   this.t3 = 0;

    //   this.gasterBlaster.push(Generator.GasterBlaster.random());
    //   // this.gasterBlaster.push(Generator.GasterBlaster.left(3, 1));
    //   // this.gasterBlaster.push(Generator.GasterBlaster.right(3, 1));
    //   //       this.gasterBlaster.push(...Generator.GasterBlaster.leftAll(3));
    //   // this.gasterBlaster.push(...Generator.GasterBlaster.rightAll(3));
    // }

    this.t4 += this.obj.dt;
    if (this.t4 > 2) {
      this.t4 = 0;
      
      for (let func of [ "upLeft", "upRight", "rightUp", "rightDown", "leftUp", "leftDown", "downLeft", "downRight" ]) {
        this.lineBone.push(Generator.LineBoneX[func](300, 8, 60, 100));
      }
    }

    this.t5 += this.obj.dt;
    if (this.t5 > 20) {
      this.t5 = 0;
      this.tornado.push(Generator.GasterBlaster.Tornado(2, 36, 2.5));
    }

    this.update();
    this.draw();
    
    window.requestAnimationFrame(() => this.gameLoop());
  },

  update: function() {
    this.battleBox.update();
    this.sans.update();
    this.player.update();

    this.lineBone.forEach((p, idx) => {
      if (p.update()) {
        this.lineBone.splice(idx, 1);
      }
      
      p.check();
    });
    
    this.rotBones.forEach((p, idx) => {
      if (p.update()) {
        this.rotBones.splice(idx, 1);
      }

      p.check();
    });

    this.alertBones.forEach((p, idx) => {
      if (p.update()) {
        this.alertBones.splice(idx, 1);
      }

      p.check();
    });

    this.gasterBlaster.forEach((p, idx) => {
      if (p.update()) {
        this.gasterBlaster.splice(idx, 1);
      }

      p.check();
    });

    this.lineBoneX.forEach((p, idx) => {
      if (p.update()) {
        this.lineBoneX.splice(idx, 1);
      }
      
      p.check();
    });
    
    this.tornado.forEach((p, idx) => {
      if (p.update()) {
        this.tornado.splice(idx, 1);
      }
    });
  },

  draw: function() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.sans.draw();
    this.battleBox.draw();
    this.player.draw();

    this.lineBone.forEach(p => p.draw());
    this.rotBones.forEach(p => p.draw());
    this.lineBoneX.forEach(p => p.draw());
    this.alertBones.forEach(p => p.draw());
    this.gasterBlaster.forEach(p => p.draw());
    this.tornado.forEach(p => p.draw());
  }
}

export { Game };