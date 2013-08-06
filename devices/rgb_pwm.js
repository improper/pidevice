// RGB PWM output

var fs    = require('fs'),

    RED   = 0,
    GREEN = 1,
    BLUE  = 2,

    data  = [
      {
        "id": 0, "url": "/leds/0", "name": "LED stripe 1", "red": 0, "green": 0, "blue": 0
      },
      {
        "id": 1, "url": "/leds/1", "name": "LED stripe 2", "red": 0, "green": 0, "blue": 0
      }
    ],

    pwmWriter = fs.createWriteStream('/dev/pi-blaster');

// HTTP routing
exports.setupRoutes = function(app) { 
  app.get('/leds', listLeds);
  app.get('/leds/:id', showLed);
  app.put('/leds/:id', setLed);
  app.put('/leds', setLeds);
};

// GET
function listLeds(req, res) {
  console.log('Getting LEDs.');
  res.json(data);
};

function showLed(req, res) {
  var id = req.params.id;
  if (id >= 0 && id < data.length) {
    res.json(data[id]);
  } else {
    res.json(404);
  }
};

// PUT
function setLed(req, res) {
  var id = req.params.id;
  if (id >= 0 && id <= data.length) {
    console.log('Set colour of LED with id: ' + id + " to " + req.body.colour);
    colour = hexToRgb(req.body.colour);
    setColour(id, RED, colour.r);
    setColour(id, GREEN, colour.g);
    setColour(id, BLUE, colour.b);
    data[id].red = colour.r;
    data[id].green = colour.g;
    data[id].blue = colour.b;
    res.send(200);
  } else {
    res.json(404);
  }
};

// PUT
function setLeds(req, res) {
  console.log('Set colour of all LEDs to ' + req.body.colour);
  colour = hexToRgb(req.body.colour);
  for (var i=0;i<data.length;i++){ 
    setColour(i, RED, colour.r);
    setColour(i, GREEN, colour.g);
    setColour(i, BLUE, colour.b);
    data[i].red = colour.r;
    data[i].green = colour.g;
    data[i].blue = colour.b;
  }
  res.send(200);
};

// helpers

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255.0,
    g: parseInt(result[2], 16) / 255.0,
    b: parseInt(result[3], 16) / 255.0
  } : null;
}

function setColour(led, component, brightness) {
  pwmWriter.write('' + (led * 3 + component) + '=' + brightness.toFixed(3) + "\n");
  console.log('PWM ' + (led * 3 + component) + '=' + brightness.toFixed(3));
}
