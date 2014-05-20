var fs = require('fs');
var path = require('path');
var sar = require('../index.js');
var i = 0;

var backup = doBackups([
  'test.txt',
  'test2.txt',
  'example.js',
  '.sarignore',
  'node_modules/test.txt',
  '.git/test2.txt'
]);

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
  setTimeout(function () {
    restoreBackups(backup);
  }, 3000)
})
;

function doBackups(backupFiles) {
  var backup = {};
  backupFiles.forEach(function (file) {
      backup[file] = fs.readFileSync(path.join(__dirname, file));
  })
  return backup;
}

function restoreBackups(backup) {
  for (file in backup) {
    fs.writeFileSync(path.join(__dirname, file), backup[file]);
  }
}
