// libs
const Gpio = require('pigpio').Gpio;

// led variables
const ledRed = new Gpio(10, {mode: Gpio.OUTPUT});
const ledBlue = new Gpio(11, {mode: Gpio.OUTPUT});
const ledGreen = new Gpio(9, {mode: Gpio.OUTPUT});

// toogle GPIO power pins function
let togglePower = (toggleOnOff, gpioParam) => {
  if (toggleOnOff){
    gpioParam.pwmWrite(255);
  } else {
    gpioParam.pwmWrite(0);
  }
};

// led funcions
let turnOnLed = (color) => {
  switch(color){
    case 'red':
      togglePower(true, ledRed);
      togglePower(false, ledBlue);
      togglePower(false, ledGreen);
      break;
    case 'green':
      togglePower(false, ledRed);
      togglePower(false, ledBlue);
      togglePower(true, ledGreen);
      break;
    case 'blue':
      togglePower(false, ledRed);
      togglePower(true, ledBlue);
      togglePower(false, ledGreen);
      break;
    case 'purple':
      togglePower(true, ledRed);
      togglePower(true, ledBlue);
      togglePower(false, ledGreen);
      break;
    case 'lightblue':
      togglePower(true, ledRed);
      togglePower(true, ledBlue);
      togglePower(true, ledGreen);
      break;
    default: //default turned off
      turnOffLeds();
  }
};

let turnOffLeds = () => {
  togglePower(false, ledRed);
  togglePower(false, ledBlue);
  togglePower(false, ledGreen);
};

module.exports = {
  turnOffLeds: turnOffLeds,
  turnOnLed: turnOnLed
}