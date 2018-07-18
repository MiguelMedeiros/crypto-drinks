
// delay miliseconds function
let delay = (ms) => {
  ms += new Date().getTime();
  while(new Date() < ms){}
};

module.exports = {
  delay: delay
}