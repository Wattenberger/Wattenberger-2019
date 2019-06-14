import Vector2D from "./vector2d"
import Pollock from "./pollock"

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

function Drip(options) {
  this.settings = {
    lifeSpan: 300,
    position: new Vector2D(0,0),
    velocity: new Vector2D(0,0),
    color: '#fafafa',
    size: 1,
    onDeath: function(event){},
  };

  Pollock.extend(this.settings, options, true);

  this.age = 0;
  this.alive = true;
};

Drip.prototype.update = function(dt) {
  this.age += dt;

  if(this.age > this.settings.lifeSpan)
  {
    this.kill();
    return;
  }

  //Move it around randomly.  No science behind this, it just turned out pretty good!
  this.settings.velocity.add(new Vector2D(Math.random()*.85 - .25, Math.random()*.5 - .25));
  var lPosition = this.settings.position.clone();
  this.settings.position.add(this.settings.velocity);
  var dPosition = Vector2D.subtract(this.settings.position, lPosition);
  var a = (Math.atan2(dPosition.y, dPosition.x) + Math.PI/2);
  this.settings.velocity.x += this.settings.velocity.x * Math.cos(a) - this.settings.velocity.y * Math.sin(a);
  this.settings.velocity.y += this.settings.velocity.x * Math.sin(a) + this.settings.velocity.y * Math.cos(a);
};

Drip.prototype.draw = function(context) {
  var t = new Date().getTime();

  context.save();
  context.globalAlpha = 0.06;//uncommenting this gives a watercolor-like look
  context.beginPath();
  context.fillStyle = this.settings.color;

  //Do some time based calculation to get size variation
  context.arc(
    this.settings.position.x,
    this.settings.position.y,
    Math.abs((Math.sin(t)*Math.sin(t*.5))*this.settings.size),
    0,
    2 * Math.PI,
    false
  );

  context.fill();
  context.restore();
};

Drip.prototype.kill = function(){
  this.alive = false;
  this.settings.onDeath();
};

export default Drip
