// RGB PWM output

var fs     = require('fs'),
    shifty = require('../shifty'),

    RED      = 0,
    GREEN    = 1,
    BLUE     = 2,

    FADE_FPS = 20,

    data  = [
      {
        "id": 0,
        "url": "/leds/0",
        "name": "LED stripe 1",
        "red": 0, "green": 0, "blue": 0,
        "brightness": 1,
        "activeTween": null,
        "currentRed": 0, "currentGreen": 0, "currentBlue": 0,
        "fadeDuration": 500
      },
      {
        "id": 1,
        "url": "/leds/1",
        "name": "LED stripe 2",
        "red": 0, "green": 0, "blue": 0,
        "brightness": 1,
        "activeTween": null,
        "currentRed": 0, "currentGreen": 0, "currentBlue": 0,
        "fadeDuration": 500
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
  if (processRequest(id, req)) {
    res.send(200);
  } else {
    res.json(404);
  }
};

// PUT
function setLeds(req, res) {
  for (var i = 0; i < data.length; i++) {
    processRequest(i, req);
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

function setColour(ledId, component, brightness) {
  pwmWriter.write('' + (ledId * 3 + component) + '=' + brightness.toFixed(3) + "\n");
  // console.log('PWM ' + (ledId * 3 + component) + '=' + brightness.toFixed(3));
}

function fadeLed(ledId) {
  var led = data[ledId];
  if (led.activeTween) {
    led.activeTween.stop();
  }
  led.activeTween = new shifty.Tweenable({ fps: FADE_FPS });
  led.activeTween.tween({
    from: {
      red:   led.currentRed,
      green: led.currentGreen,
      blue:  led.currentBlue
    },
    to: {
      red:   led.red * led.brightness,
      green: led.green * led.brightness,
      blue:  led.blue * led.brightness
    },
    duration: led.fadeDuration,
    step: function(state) {
      led.currentRed   = state.red;
      led.currentGreen = state.green;
      led.currentBlue  = state.blue;
      setColour(ledId, RED,   state.red);
      setColour(ledId, GREEN, state.green);
      setColour(ledId, BLUE,  state.blue);
    },
    callback: function() {
      led.activeTween = null;
    }
  });
}

function processRequest(ledId, req) {
  if (ledId >= 0 && ledId <= data.length) {
    var led = data[ledId];
    if (req.body.colour !== undefined) {
      var colour = hexToRgb(req.body.colour);
      led.red   = Math.round(colour.r * 1000) / 1000;
      led.green = Math.round(colour.g * 1000) / 1000;
      led.blue  = Math.round(colour.b * 1000) / 1000;
    }
    if (req.body.brightness !== undefined) {
      led.brightness = Math.max(0, Math.min(1, req.body.brightness));
    }
    if (req.body.fadeDuration !== undefined) {
      led.fadeDuration = Math.max(0, req.body.brightness);
    }
    console.log('fading LED output ' + ledId + ' to RGB (' + led.red + ', ' + led.green + ', ' + led.blue + '), brightness ' + led.brightness);
    fadeLed(ledId);
    return true;
  } else {
    return false;
  }
}
