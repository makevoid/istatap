page = {}
events = {}
utils = {}
conf = {}
canvas = null
context = null


shapes = []
# shape = { x: 123, y: 234, speed: 0-1 }

conf.max_range = 80
conf.min_radius = 30

main = ->
  log "hello world"
  canvas = document.querySelector 'canvas'
  context = canvas.getContext '2d'
  canvas.addEventListener "mousedown", events.handle_click
  canvas.addEventListener "touches", events.handle_click
  canvas.onselectstart = (evt) -> evt.preventDefault()
  resize()
  window.onresize = resize
  for num in [0..2] # shapes shown
    gen_shape()


# window.mozRequestAnimationFrame draw_all

# Only supported in FF. Other browsers can use something like Date.now().

requestAnimationFrame = window.requestAnimationFrame or window.mozRequestAnimationFrame or window.webkitRequestAnimationFrame or window.msRequestAnimationFrame
window.requestAnimationFrame = requestAnimationFrame

step = (timestamp) ->
  progress = timestamp - start
  # d.style.left = Math.min(progress / 10, 200) + "px"
  clear_canvas()
  gen_shape()
  draw_all()
  requestAnimationFrame step  if progress < 5000
  # false

start = window.mozAnimationStartTime
requestAnimationFrame step


utils.rand = Math.random

clear_canvas = ->
  context.save()
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.restore()

gen_shape = ->
  attrs =
    x: utils.rand() * canvas.width
    y: utils.rand() * canvas.height
    radius: utils.rand() * conf.max_range
    speed: (utils.rand() + 1)*1000
    pause: (utils.rand() + 1)*1000
  shapes.push attrs


page.refresh = ->
  document.location = "/index.html"


events.handle_click = (evt) ->
  x = evt.clientX - canvas.offsetLeft
  y = evt.clientY - canvas.offsetTop

resize = ->
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  draw_all()


draw_all = ->
  for shape in shapes
    draw shape

draw = (shape) ->
  radius = 30

  context.beginPath()
  radius = Math.max conf.min_radius, shape.radius
  context.arc(shape.x, shape.y, radius, 0, 2 * Math.PI, false)
  context.fillStyle = '#BBB'
  context.fill()
  context.lineWidth = 2
  context.strokeStyle = '#FFF'
  context.stroke()

log = (string) ->
  logs = document.querySelector '.logs'
  logs.innerHTML = logs.innerHTML + string + "<br>"

document.addEventListener "DOMContentLoaded", main, false

