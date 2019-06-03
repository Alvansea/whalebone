'use strict';

const whalebone = require('..');
const path = require('path');
const expect = require('chai').expect;

describe('whalebone module loader', () => {

  var _digestor;

  beforeEach(() => {

    _digestor = {
      caches: [],
      digest: function(mod, options) {
        if(mod && mod.name) {
          this.caches.push(mod.name);
        }
      },
      filter: function(filename) {
        return filename.indexOf('ignore') < 0;
      }
    }
  });

  it('should import modules by dir with differenct depth', () => {
    whalebone.import(path.join(__dirname, './test_modules'), _digestor.digest, {
      caller: _digestor,
      filter: _digestor.filter
    });
    expect(_digestor.caches.length).equals(3);
    expect(_digestor.caches[0]).equals('c');
    expect(_digestor.caches[1]).equals('a');
    expect(_digestor.caches[2]).equals('b');
  });

  it('should import modules by an array', () => {
    var arr = [
      path.join(__dirname, './test_modules/module_a.js'),
      path.join(__dirname, './test_modules/')
    ];
    whalebone.import(arr, _digestor.digest, {
      caller: _digestor,
      filter: _digestor.filter
    });
    expect(_digestor.caches.length).equals(3);
    expect(_digestor.caches[0]).equals('a');
    expect(_digestor.caches[1]).equals('c');
    expect(_digestor.caches[2]).equals('b');
  });
})

