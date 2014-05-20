// How should the program work?

var sar = require('./index.js');
var i = 0;
sar('./test', /a+b+a+/g, function (match, file, cb) {

  console.log('Replacing in ' + file);

  if(match[0].length > 4) {
    i++;
    if (match[0].length % 2) {
      cb('<' + i + '>');
    } else {
      setTimeout(function () {
        cb('<' + i + '>');
      }, 2000);
    }
  } else {
    cb(false); // no replacement
  }

})
.on('end', function () {
  console.log('Over');
})
