var fs = require('fs');
var sar = require('./index.js');
var i = 0;

doBackups();

sar(__dirname, /a+b+a+/g, function (match, file, cb) {

  console.log('  Replacing...');

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
.on('directory', function (dir) {
  console.log('Directory ' + dir);
})
.on('file', function (file) {
  console.log('File ' + file);
})
.on('ignore', function (ignored) {
  console.log('Ignored ' + ignored);
})
.on('end', function () {
  console.log('OVER');
  restoreBackups();
})
;

function doBackups() {
  var backupFiles = [
    'test.txt',
    'test2.txt',
    'example.js',
    '.sarignore',
    'node_modules/test.txt',
    '.git/text2.txt'
  ];

  var backup = {};
  backupFiles.forEach(function (file) {
      backup[file] = fs.readFileSync(__dirname + file);
  })
}

function restoreBackups() {
  backupFiles.forEach(function (file) {
    fs.writeFileSync(__dirname + file, backup[file]);
  })
}
