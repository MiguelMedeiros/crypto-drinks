// libs
const WebSocketClient = require('websocket').client;
const Gpio = require('pigpio').Gpio;
const pumps = require('./components/pumps');
const ledRGB = require('./components/ledRGB');
const lcd = require('./components/lcd');
const drinksLib = require('./config/drinks');
const helper = require('./components/helper');

// sonar variables
const sonarTrigger = new Gpio(17, {mode: Gpio.OUTPUT});
const sonarEcho = new Gpio(27, {mode: Gpio.INPUT, alert: true});

// make drinks function
let makeDrink = (address) => {

  for(let i = 0; i < drinksLib.drinks.length; i++){
    if(drinksLib.drinks[i].address == address){
      beverages = drinksLib.drinks[i].beverages;
      console.log("Making Drink: "+drinksLib.drinks[i].name);
    }
  }

  // sonar distance start
  sonarTrigger.digitalWrite(0);
  const MICROSECONDS_PER_CM = 1e6/34321; 
  let startTick;
  sonarEcho.on('alert', function (level, tick) {
    let endTick, diff;
    if (level == 1) {
      startTick = tick;
    } else {
      endTick = tick;
      diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      distance = diff / 2 / MICROSECONDS_PER_CM;
      //console.log(distance);
      if(distance > 12 && distance < 20){
        console.log("posicao correta: "+distance);
        
        for(let i = 0; i < beverages.length; i++){
          pumps.tooglePump(beverages[i].pump, beverages[i].ms);
        }
        clearInterval(sonarInterval);
        ledRGB.turnOnLed("green");
      }else{
        console.log("posicao errada"+distance);
        ledRGB.turnOnLed("red");
      }
    }
  });

  // Trigger a distance measurement once per second
  var sonarInterval = setInterval(function () {
    sonarTrigger.trigger(100, 1); // Set trigger high for 10 microseconds
  }, 1000);
};

let listen = () => {
  // websocket control
  helper.delay(2000);
  lcd.message("start websocket");
  ledRGB.turnOnLed("lightblue");
  let client = new WebSocketClient();
  client.connect('wss://testnet-ws.smartbit.com.au/v1/blockchain');

  client.on('connectFailed', function(error) {
    lcd.message("error websocket");
    ledRGB.turnOnLed("red");
  });

  client.on('connect', function(connection) {
    console.log('WebSocket Connected');
    lcd.message("start");
    ledRGB.turnOnLed("blue");

    // check error connection
    connection.on('error', function(error) {
      console.log("Connection Error: " + error.toString());
      lcd.message("error websocket");
      ledRGB.toggleLed(false,ledRed); // turn off led
    });
    
    // check close connection
    connection.on('close', function() {
      lcd.message("error websocket");
      ledRGB.turnOnLed("red");
    });
    

    for(let i = 0; i < drinksLib.drinks.length; i++){
      // send message to monitor address
      let receiveAddress = drinksLib.drinks[i].address;
      
      connection.sendUTF(JSON.stringify({
        type: "address", 
        address: receiveAddress
      }));  
      console.log('Connected WebSocket - drink wallet: '+drinksLib.drinks[i].name);

      // ping websocket every 30 seconds (to make sure that the address messages are still subscribed)
      let pingInterval = setInterval(function () {
        console.log('Ping WebSocket - drink wallet: '+drinksLib.drinks[i].name);
        connection.sendUTF(JSON.stringify({
          type: "address", 
          address: receiveAddress
        }));
        ledRGB.turnOnLed("blue");
      }, 30000);
    }
    
    // check received donations
    connection.on('message', function(message) {
      if (message.type === 'utf8') {
        let messageParsed = JSON.parse(message.utf8Data);
        if (messageParsed.type == 'address') {
          console.log("Received payment!");
          makeDrink(messageParsed.payload.address);
        }
      }
    });
  });
};

module.exports = {
  makeDrink: makeDrink,
  listen: listen
}