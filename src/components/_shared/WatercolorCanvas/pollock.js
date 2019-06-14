import Vector2D from "./vector2d"

/*
Copyright (c) 2014 Mike Ferron (mikeferron.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.

*/

/*
* CONSTRUCTOR
*/

function Pollock(options) {
  this.settings = {
    canvasID: null,
    clear: true,
    mousemove: function(event) {},
    mousedown: function(event) {},
    mouseup: function(event) {},
    click: function(event) {},
  };

  Pollock.extend(this.settings, options, true);

  this.dt = 0; //delta time between updates
  this.currentTime = new Date().getTime(); //current time, used to calculate dt

  this.canvas = document.getElementById(this.settings.canvasID);

  this.width = this.canvas.width;
  this.height = this.canvas.height;

  this.context = this.canvas.getContext('2d');

  this.entities = [];
};

/*
* Helper Functions...
*/

Pollock.extend = function(to, from, allowNew) {
  for (var i in from) {
    if (allowNew || to.hasOwnProperty(i))
    to[i] = from[i];
  }
  return to;
};
Pollock.randomPosNeg = function() {
  return Math.random() * 2 - 1;
};
Pollock.degreesToRadians = function(degrees) {
  return (degrees * Math.PI) / 180;
};
Pollock.radiansToDegrees = function(radians) {
  return (radians * 180) / Math.PI;
};
Pollock.wrapAngle = function(angle) {
  while (angle < -Math.PI) {
    angle += Math.PI * 2;
  }
  while (angle > Math.PI) {
    angle -= Math.PI * 2;
  }

  return angle;
};
Pollock.randomInRange = function(from, to) {
  return Math.floor(Math.random()*(to-from+1)+from);
};

Pollock.prototype.getCanvasContext = function() {
  return this.context;
};

Pollock.prototype.enable = function() {
  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  })();

  window.cancelAnimFrame = (function() {
    return window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msCancelAnimationFrame;
  })();

  this.animate(new Date().getTime());

  this.canvas.onmousemove = this.settings.mousemove;
  this.canvas.onmousedown = this.settings.mousedown;
  this.canvas.onmouseup = this.settings.mouseup;
  this.canvas.onclick = this.settings.click;

  var that = this;
  function doResize()
  {
    that.resize(); //i want 'this' to be Pollock, not the window
  }
  var endResize; //work this on a delay
  window.onresize = function(e) {
    clearTimeout(endResize);
    endResize = setTimeout(doResize, 100);
  };

  return this;
};

Pollock.prototype.animate = function(time) {
  var that = this;
  this.animationFrame = window.requestAnimFrame(function() {
    that.animate(new Date().getTime());
  });

  var dt = time - this.currentTime;
  this.currentTime = time;
  this.update(dt);
};

Pollock.prototype.disable = function() {
  window.cancelAnimFrame(this.animationFrame);
  return this;
};

Pollock.prototype.resize = function()
{
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;

  this.width = this.canvas.width;
  this.height = this.canvas.height;
};

Pollock.prototype.addChild = function(obj) {
  this.entities.push(obj);
};

Pollock.prototype.update = function(dt) {
  this.draw();

  var len = this.entities.length;
  while (len--) {
    var entity = this.entities[len];
    entity.update(dt);
    if (!entity.alive) {
      this.entities.splice(len, 1);
      continue;
    }
    this.entities[len].draw(this.context);
  }
};

Pollock.prototype.draw = function() {
  if (this.settings.clear) {
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillStyle = 'transparent';
    this.context.fillRect(0, 0, this.width, this.height);
  }
};

export default Pollock
