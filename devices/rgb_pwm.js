// RGB PWM output

var fs    = require('fs'),

    RED   = 0,
    GREEN = 1,
    BLUE  = 2,

    data  = [
      {
        "id": 0, "url": "/leds/0", "name": "LED stripe 1", "red": 0, "green": 0, "blue": 0, "brightness": 1
      },
      {
        "id": 1, "url": "/leds/1", "name": "LED stripe 2", "red": 0, "green": 0, "blue": 0, "brightness": 1
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
    var led = data[id];
    if (req.body.colour !== undefined) {
      colour = hexToRgb(req.body.colour);
      led.red = colour.r;
      led.green = colour.g;
      led.blue = colour.b;
    }
    if (req.body.brightness !== undefined) {
      led.brightness = Math.max(0, Math.min(1, req.body.brightness));
    }
    setColour(id, RED,   led.red * led.brightness);
    setColour(id, GREEN, led.green * led.brightness);
    setColour(id, BLUE,  led.blue * led.brightness);
    res.send(200);
  } else {
    res.json(404);
  }
};

// PUT
function setLeds(req, res) {
  console.log('Set colour of all LEDs to ' + req.body.colour);
  var colour,
      brightness;
  if (req.body.colour !== undefined) {
    colour = hexToRgb(req.body.colour);
  }
  if (req.body.brightness !== undefined) {
    brightness = Math.max(0, Math.min(1, req.body.brightness));
  }
  for (var i=0;i<data.length;i++){ 
    var led = data[i];
    if (colour !== undefined) {
      led.red = colour.r;
      led.green = colour.g;
      led.blue = colour.b;
    }
    if (brightness !== undefined) {
      led.brightness = brightness;
    }
    setColour(i, RED,   led.red * led.brightness);
    setColour(i, GREEN, led.green * led.brightness);
    setColour(i, BLUE,  led.blue * led.brightness);
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
