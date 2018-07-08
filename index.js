'use strict';

var fs = require('fs');
var path = require('path');

class Whalebone {

  constructor() {
    this.assets = {};
  }

  asset(name, value) {
    if(!this.assets[name]) {
      this.assets[name] = value || {};
    }
    return this.assets[name];
  }

  /**
   *  import dir(s) and digest the files using digestor
   */
  import(dirs, digestor, options) {

    if(dirs instanceof Array) {
      dirs.forEach((dir) => {
        this.imoprt(dir, options);
      })
      return;
    }

    let fullpath = dirs;
    if(fs.lstatSync(fullpath).isFile()) {
      let mod = require(fullpath);
      digestor.call(this, mod, options);
    } else {
      let filter;
      if(options && options.filter) {
        filter = options.filter;
      } else {
        filter = function(filename) {
          return filename[0] != '.';
        }
      }
      fs.readdirSync(fullpath)
        .filter(filter)
        .sort()
        .forEach((filename) => {
          const mod = require(path.join(fullpath, filename));
          digestor.call(this, mod, options);
        });
    }
  }

  /**
   *  export assets using exportor
   */
  export(exportor, options) {
    return exportor.call(this, options);
  }
}

// singleton
exports = module.exports = new Whalebone();
