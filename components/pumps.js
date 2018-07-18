// libs
const Gpio = require('pigpio').Gpio;

// pumps variables
const pump1 = new Gpio(5, {mode: Gpio.OUTPUT});
const pump2 = new Gpio(6, {mode: Gpio.OUTPUT});
const pump3 = new Gpio(13, {mode: Gpio.OUTPUT});
const pump4 = new Gpio(19, {mode: Gpio.OUTPUT});

// toogle GPIO power pins function
let togglePower = (toggleOnOff, gpioParam) => {
  if (toggleOnOff){
    gpioParam.pwmWrite(255);
  } else {
    gpioParam.pwmWrite(0);
  }
};

// pump functions
let tooglePump = (pump, miliseconds = 1000) => {
  switch(pump){
    case 1:
      togglePower(false, pump1);
      setTimeout(function () {
        togglePower(true, pump1);
      }, miliseconds);
      break;
    case 2:
      togglePower(false, pump2);
      setTimeout(function () {
        togglePower(true, pump2);
      }, miliseconds);
      break;
    case 3:
      togglePower(false, pump3);
      setTimeout(function () {
        togglePower(true, pump3);
      }, miliseconds);
      break;
    case 4:
      togglePower(false, pump4);
      setTimeout(function () {
        togglePower(true, pump4);
      }, miliseconds);
      break;
    default: //default turned off
      turnOffPumps();
  }
};

let turnOffPumps = () => {
  togglePower(true, pump1);
  togglePower(true, pump2);
  togglePower(true, pump3);
  togglePower(true, pump4);
};

module.exports = {
  tooglePump: tooglePump,
  turnOffPumps: turnOffPumps
}