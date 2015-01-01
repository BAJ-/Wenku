(function (d, w) {
  'use strict';

  // Constructor for the Wenku library.
  function Wenku(e) {
    var i;
    for (i = 0; i < e.length; i += 1) {
      this[i] = e[i];
    }
    this.length = e.length;
  }

  function wenku(selector) {
    var e,
        isID = /^#(\w+)$/,
        isClass = /^\.(\w+)$/,
        isTag = /^(\w+)$/;

    if (!selector) {
      return this;
    }

    if (typeof selector === 'string') {
      if (isID.test(selector)) {
        e = [d.getElementById(selector.substring(1))];
      } else if (isClass.test(selector)) {
        e = d.getElementsByClassName(selector.substring(1));
      } else if (isTag.test(selector)) {
        e = d.getElementsByTagName(selector);
      } else {
        e = d.querySelectorAll(selector);
      }
    } else if (selector.length) {
      e = selector;
    } else {
      e = [selector];
    }

    return new Wenku(e);
  }

  Wenku.prototype = {
    map: function (callback) {
      var results = [],
          i,
          self = this;

      for (i = 0; i < self.length; i += 1) {
        results.push(callback.call(self, self[i], i));
      }
      return results;
    },
    forEach: function (callback) {
      this.map(callback);
      return this;
    },
    typeOf: function (val) {
      var valType = typeof val;
      if (valType === 'object') {
        if (val) {
          if (Object.prototype.toString.call(val) === '[object Array]') {
            valType = 'array';
          }
        } else {
          valType = 'null';
        }
      }
      return valType;
    },
  };

  w.wenku = wenku;
}(document, window));
