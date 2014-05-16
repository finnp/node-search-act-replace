// How should the program work?

var sar = require('./index.js');

sar('./test/test.txt', /a+b+a+/g, function (match, file, cb) {
  // callback
  // match should be an array like in regex.exec(string)

  // I see possibility for modularity
  // A program going through the filesystem
  // isnt that called findit

  if (match[0].length > 3) {
    cb('neuerwert');
  } else {
    cb(false); // no replacement
  }

});


// "examplestring 1 with example 1"
// regex /1/g found 2 times
// when i start at the back i don't change the indizes of earlier matches
