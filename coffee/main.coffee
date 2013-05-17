page = {}
events = {}
utils = {}
conf = {}
canvas = null
context = null
counter = null
start = null
sounds = {}
audio1 = null
audio2 = null
audio3 = null
cur_audio = null

shapes = []
# shape = { x: 123, y: 234, speed: 0-1 }

utils.rand = Math.random

conf.max_range = 80
conf.min_radius = 30
conf.max_radius = 150

points = 0

timer = 120 # seconds



main = ->
  sounds.init()

  # log "hello world"
  counter = document.querySelector ".points"
  canvas = document.querySelector 'canvas'
  context = canvas.getContext '2d'
  canvas.addEventListener "mousedown", events.handle_click
  canvas.addEventListener "touches", events.handle_click
  canvas.onselectstart = (evt) -> evt.preventDefault()
  resize()
  window.onresize = resize
  # for num in [0..2] # shapes shown
  #   gen_shape()

  requestAnimationFrame = window.mozRequestAnimationFrame or window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.msRequestAnimationFrame
  window.requestAnimationFrame = requestAnimationFrame

  start = window.mozAnimationStartTime || Date.now()

  requestAnimationFrame step

step = (timestamp) ->
  timestamp = Date.now() unless window.mozAnimationStartTime
  progress = timestamp - start

  clear_canvas()
  draw_all( progress )

  requestAnimationFrame step# if progress < 5000

shape_id = 0

class Shape
  constructor: (progress) ->
    shape_id += 1 # move outside to parallelize
    @id = shape_id
    @x = utils.rand() * canvas.width
    @y = utils.rand() * canvas.height
    @birth = progress
    @death = progress + 1200
    @radius = 0

  animate: (progress) ->
    age = progress - @birth
    @radius = age / 5
    @kill() if age > @death

  kill: ->
    shapes = _(shapes).reject (shape) =>
      shape.id == @id

    wait_time = 400
    start = (window.mozAnimationStartTime || Date.now()) - wait_time

  is_clicked: (pos) ->
    distance = Math.pow(pos.x-@x, 2) + Math.pow(pos.y-@y, 2)
    distance < Math.pow(@radius, 2)


draw_all = (progress) ->
  return unless progress

  draw_timer()

  # one shapes that grows
  if shapes.length < 3
    # generate shapes
    shape = new Shape(progress)
    shapes.push shape

  for shape in shapes
    if shape
      shape.animate progress
      draw shape

      # console.log progress, shape.birth, progress-shape.birth, shape.death

events.handle_click = (evt) ->
  x = evt.clientX - canvas.offsetLeft
  y = evt.clientY - canvas.offsetTop
  pos = { x: x, y: y }
  # console.log x, y

  for shape in shapes
    if shape && shape.is_clicked(pos)
      points += 1 # shape.points()
      counter.innerHTML = points
      sounds.play_kill()
      shape.kill()

draw_timer = ->

clear_canvas = ->
  context.save()
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.restore()



page.refresh = ->
  document.location = "/index.html"



resize = ->
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  draw_all()


draw = (shape) ->
  context.beginPath()
  radius = Math.max conf.min_radius, shape.radius
  radius = Math.min conf.max_radius, radius
  context.arc(shape.x, shape.y, radius, 0, 2 * Math.PI, false)
  context.fillStyle = '#BBB'
  context.fill()
  context.lineWidth = 2
  context.strokeStyle = '#FFF'
  context.stroke()

log = (string) ->
  logs = document.querySelector '.logs'
  logs.innerHTML = logs.innerHTML + string + "<br>"


sounds.init = ->
  cur_audio = 1
  audio_file = "/sounds/ti.wav"
  audio1 = new Audio()
  audio1.src = audio_file
  audio1.volume = 0.4
  audio2 = new Audio()
  audio2.src = audio_file
  audio2.volume = 0.4
  audio3 = new Audio()
  audio3.src = audio_file
  audio3.volume = 0.4

sounds.play_kill = ->
  switch cur_audio
    when 1
      audio1.play()
      cur_audio = 2
    when 2
      audio2.play()
      cur_audio = 3
    when 3
      audio3.play()
      cur_audio = 1



document.addEventListener "DOMContentLoaded", main, false