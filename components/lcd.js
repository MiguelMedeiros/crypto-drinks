// libs 
const Gpio = require('pigpio').Gpio;
const LCD = require('lcdi2c');

// lcd variables
let lcd = new LCD( 1, 0x3f, 20, 4 );

let message = (text, text2) => {
  lcd.on();
  lcd.clear();
  lcd.home();
  switch (text){
    case "start":
      lcd.println('********************', 1);
      lcd.println('    Cripto Drinks   ', 2);
      lcd.println('  Pay with Bitcoin  ', 3);
      lcd.println('********************', 4);
      break;
    case "start websocket":
      lcd.println('********************', 1);
      lcd.println('    Connecting      ', 2);
      lcd.println(' to the blockchain! ', 3);
      lcd.println('********************', 4);
      break;
    case "error websocket":
      lcd.println('********************', 1);
      lcd.println('  Error to connect  ', 2);
      lcd.println(' to the blockchain! ', 3);
      lcd.println('********************', 4);
      break;
    case "receive payment":
      lcd.println('********************', 1);
      lcd.println('  YEAH! DRINK TIME! ', 2);
      lcd.println(' Payment Received!  ', 3);
      lcd.println('********************', 4);
      break;
    case "beverage":
      lcd.println('********************', 1);
      lcd.println('   Making Drink!    ', 2);
      lcd.println(' -> '+text2+' ', 3);
      lcd.println('********************', 4);
      break;
  }
}

module.exports = {
  message: message
}