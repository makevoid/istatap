var canvas, clear_canvas, conf, context, draw, draw_all, events, gen_shape, log, main, page, requestAnimationFrame, resize, shapes, start, step, utils;

page = {};

events = {};

utils = {};

conf = {};

canvas = null;

context = null;

shapes = [];

conf.max_range = 80;

conf.min_radius = 30;

main = function() {
  var num, _i, _results;

  log("hello world");
  canvas = document.querySelector('canvas');
  context = canvas.getContext('2d');
  canvas.addEventListener("mousedown", events.handle_click);
  canvas.addEventListener("touches", events.handle_click);
  canvas.onselectstart = function(evt) {
    return evt.preventDefault();
  };
  resize();
  window.onresize = resize;
  _results = [];
  for (num = _i = 0; _i <= 2; num = ++_i) {
    _results.push(gen_shape());
  }
  return _results;
};

requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

window.requestAnimationFrame = requestAnimationFrame;

step = function(timestamp) {
  var progress;

  progress = timestamp - start;
  clear_canvas();
  gen_shape();
  draw_all();
  if (progress < 5000) {
    return requestAnimationFrame(step);
  }
};

start = window.mozAnimationStartTime;

requestAnimationFrame(step);

utils.rand = Math.random;

clear_canvas = function() {
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  return context.restore();
};

gen_shape = function() {
  var attrs;

  attrs = {
    x: utils.rand() * canvas.width,
    y: utils.rand() * canvas.height,
    radius: utils.rand() * conf.max_range,
    speed: (utils.rand() + 1) * 1000,
    pause: (utils.rand() + 1) * 1000
  };
  return shapes.push(attrs);
};

page.refresh = function() {
  return document.location = "/index.html";
};

events.handle_click = function(evt) {
  var x, y;

  x = evt.clientX - canvas.offsetLeft;
  return y = evt.clientY - canvas.offsetTop;
};

resize = function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  return draw_all();
};

draw_all = function() {
  var shape, _i, _len, _results;

  _results = [];
  for (_i = 0, _len = shapes.length; _i < _len; _i++) {
    shape = shapes[_i];
    _results.push(draw(shape));
  }
  return _results;
};

draw = function(shape) {
  var radius;

  radius = 30;
  context.beginPath();
  radius = Math.max(conf.min_radius, shape.radius);
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

document.addEventListener("DOMContentLoaded", main, false);
