const fs = require('fs');
const Path = require('path');
const lodash = require('lodash');

function loadDir(path, deep = true, encoding = 'utf8') {
  const files = fs.readdirSync(path, {
    encoding,
    withFileTypes: true
  });
  
  const result = [];


  if(Array.isArray(files)) {
    while (files.length > 0) {
      const file = files.pop();

      if (file.isFile() && lodash.endsWith(file.name, '.js')) {
        result.push(require(Path.join(path, file.name)));

      } else if (deep && file.isDirectory()) {
        result.push(loadDir(Path.join(path, file.name), deep, encoding));
      }
    }
  }

  return result;
}


module.exports = loadDir;