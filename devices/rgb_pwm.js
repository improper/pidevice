// RGB PWM output

var util = require('util')
// var exec = require('child_process').exec;
// var sleep = require('sleep');

var data = [
    {
      "id": "0", "url": "/switches/0", "name": "Lamp 1", "script": "sudo /home/pi/rcswitch-pi/sendRev", "command": "B 1", "status": "0"
    },
    {
      "id": "1", "url": "/switches/1", "name": "Lamp 2", "script": "sudo /home/pi/rcswitch-pi/sendRev", "command": "B 2", "status": "0"
    },
    {
      "id": "2", "url": "/switches/2", "name": "Lamp 3", "script": "sudo /home/pi/rcswitch-pi/sendRev", "command": "B 3", "status": "0"
    }   
  ];

// HTTP routing

exports.setupRoutes = function(app) { 
  app.get('/switches', switches);
  app.get('/switches/:id', doSwitch);
  app.post('/switches', addSwitch);
  app.put('/switches/:id', editSwitch);
  app.put('/switches', editAllSwitches);
  app.delete('/switches/:id', deleteSwitch);
};

// GET
function switches(req, res) {
  console.log('Getting switches.');
  var switches = [];
  res.json(data);
};

function doSwitch(req, res) {
  var id = req.params.id;
  if (id >= 0 && id < data.length) {
    res.json(data[id]);
  } else {
    res.json(404);
  }
};

// POST
function addSwitch(req, res) {
  var newSwitch = req.body;
  newSwitch.id=data.length;
  newSwitch.url="/switches/"+newSwitch.id;
  newSwitch.status="0";
  console.log('Adding switch: ' + JSON.stringify(newSwitch));
  data.push(newSwitch);
  res.send(201);
};

// PUT
function editSwitch(req, res) {
  var id = req.params.id;
  if (id >= 0 && id <= data.length) {
    console.log('Switch Status of switch with id: ' + id + " to " + req.body.status);
    var script = data[id].script;
    var command = data[id].command;
    switchStatus(script,command,req.body.status);
    data[id].status = req.body.status;
    res.send(200);
  } else {
    res.json(404);
  }
};

// PUT
function editAllSwitches(req, res) {
  console.log('Switch Status of all switches to ' + req.body.status);
  for (var i=0;i<data.length;i++){ 
    var script = data[i].script;
    var command = data[i].command;
    switchStatus(script,command,req.body.status);
    data[i].status = req.body.status;
  }
  res.send(200);
};

// DELETE
function deleteSwitch(req, res) {
  var id = req.params.id;
  if (id >= 0 && id < data.length) {
    console.log('Delete switch with id: ' + id);
    data.splice(id, 1);
    res.send(200);
  } else {
    res.json(404);
  }
};

// helpers

function switchStatus(script, command, status){
    var execString = script + " " + command + " " + status;
    console.log("Executing: " + execString);
    // exec(execString, puts);
    // sleep.sleep(1)//sleep for 1 seconds
}

function puts(error, stdout, stderr) { 
        util.puts(stdout); 
        console.warn("Executing Done");
}
