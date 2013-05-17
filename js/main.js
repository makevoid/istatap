var Shape, audio1, audio2, audio3, canvas, clear_canvas, conf, context, counter, cur_audio, draw, draw_all, draw_timer, events, log, main, page, points, resize, shape_id, shapes, sounds, start, step, timer, utils;

page = {};

events = {};

utils = {};

conf = {};

canvas = null;

context = null;

counter = null;

start = null;

sounds = {};

audio1 = null;

audio2 = null;

audio3 = null;

cur_audio = null;

shapes = [];

utils.rand = Math.random;

conf.max_range = 80;

conf.min_radius = 30;

conf.max_radius = 150;

points = 0;

timer = 120;

main = function() {
  var requestAnimationFrame;

  sounds.init();
  counter = document.querySelector(".points");
  canvas = document.querySelector('canvas');
  context = canvas.getContext('2d');
  canvas.addEventListener("mousedown", events.handle_click);
  canvas.addEventListener("touches", events.handle_click);
  canvas.onselectstart = function(evt) {
    return evt.preventDefault();
  };
  resize();
  window.onresize = resize;
  requestAnimationFrame = window.mozRequestAnimationFrame || window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
  start = window.mozAnimationStartTime || Date.now();
  return requestAnimationFrame(step);
};

step = function(timestamp) {
  var progress;

  if (!window.mozAnimationStartTime) {
    timestamp = Date.now();
  }
  progress = timestamp - start;
  clear_canvas();
  draw_all(progress);
  return requestAnimationFrame(step);
};

shape_id = 0;

Shape = (function() {
  function Shape(progress) {
    shape_id += 1;
    this.id = shape_id;
    this.x = utils.rand() * canvas.width;
    this.y = utils.rand() * canvas.height;
    this.birth = progress;
    this.death = progress + 1200;
    this.radius = 0;
  }

  Shape.prototype.animate = function(progress) {
    var age;

    age = progress - this.birth;
    this.radius = age / 5;
    if (age > this.death) {
      return this.kill();
    }
  };

  Shape.prototype.kill = function() {
    var wait_time,
      _this = this;

    shapes = _(shapes).reject(function(shape) {
      return shape.id === _this.id;
    });
    wait_time = 400;
    return start = (window.mozAnimationStartTime || Date.now()) - wait_time;
  };

  Shape.prototype.is_clicked = function(pos) {
    var distance;

    distance = Math.pow(pos.x - this.x, 2) + Math.pow(pos.y - this.y, 2);
    return distance < Math.pow(this.radius, 2);
  };

  return Shape;

})();

draw_all = function(progress) {
  var shape, _i, _len, _results;

  if (!progress) {
    return;
  }
  draw_timer();
  if (shapes.length < 3) {
    shape = new Shape(progress);
    shapes.push(shape);
  }
  _results = [];
  for (_i = 0, _len = shapes.length; _i < _len; _i++) {
    shape = shapes[_i];
    if (shape) {
      shape.animate(progress);
      _results.push(draw(shape));
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

events.handle_click = function(evt) {
  var pos, shape, x, y, _i, _len, _results;

  x = evt.clientX - canvas.offsetLeft;
  y = evt.clientY - canvas.offsetTop;
  pos = {
    x: x,
    y: y
  };
  _results = [];
  for (_i = 0, _len = shapes.length; _i < _len; _i++) {
    shape = shapes[_i];
    if (shape && shape.is_clicked(pos)) {
      points += 1;
      counter.innerHTML = points;
      sounds.play_kill();
      _results.push(shape.kill());
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

draw_timer = function() {};

clear_canvas = function() {
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  return context.restore();
};

page.refresh = function() {
  return document.location = "/index.html";
};

resize = function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  return draw_all();
};

draw = function(shape) {
  var radius;

  context.beginPath();
  radius = Math.max(conf.min_radius, shape.radius);
  radius = Math.min(conf.max_radius, radius);
  context.arc(shape.x, shape.y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = '#BBB';
  context.fill();
  context.lineWidth = 2;
  context.strokeStyle = '#FFF';
  return context.stroke();
};

log = function(string) {
  var logs;

  logs = document.querySelector('.logs');
  return logs.innerHTML = logs.innerHTML + string + "<br>";
};

sounds.init = function() {
  var audio_file;

  cur_audio = 1;
  audio_file = "/sounds/ti.wav";
  audio1 = new Audio();
  audio1.src = audio_file;
  audio1.volume = 0.4;
  audio2 = new Audio();
  audio2.src = audio_file;
  audio2.volume = 0.4;
  audio3 = new Audio();
  audio3.src = audio_file;
  return audio3.volume = 0.4;
};

sounds.play_kill = function() {
  switch (cur_audio) {
    case 1:
      audio1.play();
      return cur_audio = 2;
    case 2:
      audio2.play();
      return cur_audio = 3;
    case 3:
      audio3.play();
      return cur_audio = 1;
  }
};

document.addEventListener("DOMContentLoaded", main, false);
