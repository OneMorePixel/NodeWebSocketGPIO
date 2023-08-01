var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
//var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var WebSocket = require('ws');
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(26, 'out'); //use GPIO pin 4, and specify that it is output

var io = new WebSocket.Server({ port:8080 });

http.listen(8081); //listen to port 8080

function handler (req, res) { //create server
  fs.readFile(__dirname + '/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}



io.on('connection', function (socket) {// WebSocket Connection  
	try{
		console.log("connection");
		
		socket.on('message', function (msg) {// WebSocket Connection  
			try{
				console.log("neesage : ", msg);
				
				io.clients.forEach(function each(client){
					if(client.readyState === WebSocket.OPEN)
					{
						client.send("server ready!")
					}
				});
			}
			catch(e){
				console.log("error => ", e);
			}
			
		});
	
	  socket.on('light', function(data) { //get light switch status from client
		console.log("data", data);
		//lightvalue = data;
		//setLEDActiveState(data);
	  });
	}
	catch(e){
		console.log("error => ", e);
	}
	
});

function setLEDActiveState(stateValue) { //function to start blinking
  try{
	LED.writeSync(stateValue); //set pin state to 1 (turn LED on)  
  }
  catch(e){
	console.log("e => ", e);  
  }
}
/*
function blinkLED() { //function to start blinking
  if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    LED.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    LED.writeSync(0); //set pin state to 0 (turn LED off)
  }
}

function endBlink() { //function to stop blinking
  clearInterval(blinkInterval); // Stop blink intervals
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport GPIO to free resources
}
*/
