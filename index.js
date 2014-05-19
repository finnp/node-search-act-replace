var fs = require('fs');
var path = require('path');
var findit = require('findit');
var ignore = require('ignore');

function sar(root, regex, cb) {
  var finder = findit(root);
  var ignored = ignore()
    .addIgnoreFile(path.join(__dirname, '.sarignore'))
    .addIgnoreFile(path.join(root, '.sarignore'))
    .addIgnoreFile(path.join(root, '.gitignore'))
    .createFilter()
    ;

  finder.on('directory', function (dir, stat, stop) {
    if (ignored(dir)) {
      stop();
    }
  })

  finder.on('file', function (file, stat) {

    if (ignored(file)) {
      return;
    }

    fs.readFile(file, 'utf-8', function (err, text) {

      var match;
      var matches = [];

      while(match = regex.exec(text)) {
        matches.push(match);
      }
      regex.lastIndex = 0;

      var maxIndex = matches.length - 1;


      matches.forEach(function (match, index) {
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
      }
    })
  });

}

module.exports = sar;
