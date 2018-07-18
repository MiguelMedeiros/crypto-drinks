// Components
const barTender  = require('./barTender');
const ledRGB     = require('./components/ledRGB');
const lcd        = require('./components/lcd');
const pumps      = require('./components/pumps');

// Start Crypto Drinks
lcd.message("start");

// Turn off pumps and leds
pumps.turnOffPumps();
ledRGB.turnOffLeds();

// Turn on bar tender
barTender.listen();