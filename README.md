# pidevice

RESTful API for various attached hardware devices, based on node.js/express

## RGB LED device

Multiple channels of RGB LEDs/LED stripes connected to three GPIO pins each. Brightness is controlled with PWM,
provided by [pi-blaster](https://github.com/sarfata/pi-blaster/).

### Get the list of LED outputs
    curl -i -X GET http://raspberrypi:8000/leds

### Set first LED to red
    curl -i -X PUT -H 'Content-Type: application/json' -d '{"colour": "#ff0000"}' http://raspberrypi:8000/leds/0

### Set first LED colour to blue, brightness to 50%
    curl -i -X PUT -H 'Content-Type: application/json' -d '{"colour": "#0000ff", "brightness": 0.5}' http://raspberrypi:8000/leds/0

### Turn second LED off
    curl -i -X PUT -H 'Content-Type: application/json' -d '{"brightness": 0}' http://raspberrypi:8000/leds/1

### Fade all LEDs to white in 10 seconds
    curl -i -X PUT -H 'Content-Type: application/json' -d '{"colour": "#ffffff", "brightness": 1, "fadeDuration": 10000}' http://raspberrypi:8000/leds
