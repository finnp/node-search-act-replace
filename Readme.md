# Search-Act-Replace

Install with `npm install search-act-replace`.

This modules takes a root path, a regex and a callback. It will
recursively search the file within the root path and call the callback
for each match. It also provides another callback, which you can feed
with the text that the match should be replaced with (or false for
  no replacement).

Let the example talk for itself.

## Example
```javascript
var sar = require('search-act-replace');

sar('./test', /www\.\w+\.com/g, function (match, file, replace) {
  http.get('http://' + match[0], function (res) {
    if (res.statusCode !== 200) {
      replace(match[0] + ' (link broken)');
    } else {
      replace(false);
    }
  });
});
```

The script will automatically ignore `.git`, `.svn`, `node_modules`,
and `bower_components` folders (have a look at the `.sarignore` file) as well
as files specified in the roots `.gitignore` file as well as a custom
`.sarignore` file in the root folder.
