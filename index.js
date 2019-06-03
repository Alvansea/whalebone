'use strict';

const fs = require('fs');
const path = require('path');

const importModules = function(dirs, digestor, options) {

  options = options || {};
  options.history = options.history || [];

  if(dirs instanceof Array) {
    dirs.forEach((dir) => {
      importModules(dir, digestor, options);
    })
    return;
  }

  let fullpath = dirs;

  if(fs.lstatSync(fullpath).isFile()) {
    if(options.history.indexOf(fullpath) < 0) {
      options.history.push(fullpath);
      let mod = require(fullpath);
      digestor.call(options.caller, mod, options);
    }
  } else {
    let arr = fs.readdirSync(fullpath)
      .filter(function(filename) {
        return filename[0] != '.';
      });

    if(typeof(options.filter) == 'function') {
      arr = arr.filter(options.filter);
    }
    
    arr.sort()
      .forEach((filename) => {
        importModules(path.join(fullpath, filename), digestor, options);
      });
  }
}

exports.import = importModules;