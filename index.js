var fs = require('fs');
var path = require('path');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var findit = require('findit');
var ignore = require('ignore');

util.inherits(sar, EventEmitter);

function sar(root, regex, cb) {
  if(!(this instanceof sar)) return new sar(root, regex, cb);

  var self = this;
  var noMoreFiles = false;
  var openCallbacks = 0;
  var finder = findit(root);
  var accepts = ignore()
    .addIgnoreFile(path.join(__dirname, '.sarignore'))
    .addIgnoreFile(path.join(root, '.sarignore'))
    .addIgnoreFile(path.join(root, '.gitignore'))
    .createFilter()
    ;

  finder.on('end', function () {
    noMoreFiles = true;
  })

  finder.on('directory', function (dir, stat, stop) {
    if (!accepts(dir)) {
      self.emit('ignore', dir);
      stop();
    }
    self.emit('directory', dir);
  })

  finder.on('file', function (file, stat) {

    if (!accepts(file)) {
      self.emit('ignore', file);
      return;
    }

    self.emit('file', file);

    fs.readFile(file, 'utf-8', function (err, text) {

      var match;
      var matches = [];

      while(match = regex.exec(text)) {
        matches.push(match);
      }
      regex.lastIndex = 0;

      var maxIndex = matches.length - 1;


      matches.forEach(function (match, index) {
        openCallbacks++;
        cb(match, file, replacement.bind(this, match, index));
      })


      function replacement(match, index, newText) {
        var pos;
        var len;
        matches[index].done = true;
        matches[index].newText = newText;
        if(index >= maxIndex) {
          while (matches[index] && matches[index].done) {
            match = matches[index];
            if (match.newText) {
              pos = matches[index].index;
              len = matches[index][0].length;
              text = text.substr(0, pos) + match.newText + text.substr(pos + len);
            }
            index--;
            maxIndex--;
          }
        }
        if (maxIndex < 0) {
          fs.writeFile(file, text);
        }

        // are we done?
        openCallbacks--;
        if(noMoreFiles && openCallbacks <= 0) {
          self.emit('end');
        }
      }
    })
  });

}

module.exports = sar;
