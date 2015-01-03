// Wenku is a very small very simple JavaScript library.
// Author: Bjorn A. Johansen
//
//

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
    // Adds one or more classes to any given number of elements
    // classes: an array or string of class(es).
    addClass: function (classes) {
      // If we do not have an array, we assign the classes
      // appended a leading space to className.
      // If we do have an array, we join the array elements
      var className = (this.typeOf(classes) !== 'array') ? ' ' + classes : ' ' + classes.join(' ');
      // If element e has a class we add the new classes to that,
      // if not we trim the leading space and add the classes.
      return this.forEach(function (e) {
        e.className += e.className ? className : className.trim();
      });
    },
    //Removes one or more classes from any given number of elemnts.
    // classes: an array or string of classes
    removeClass: function (classes) {
      var remClasses = (this.typeOf(classes) !== 'array') ? classes.split(' ') : classes,
          oldIndex;
      return this.forEach(function (e) {
        e.className = (function remClass(oClass, rClass) {
          oldIndex = oClass.indexOf(rClass);
          return (rClass && oldIndex > -1) ? remClass((function () {
            oClass.splice(oldIndex, 1);
            return oClass;
          }()), remClasses[remClasses.indexOf(rClass) + 1]) : oClass.join(' ');
        }(e.className.split(' '), remClasses[0]));
      });
    },
    // Returns true or false depending on any elements have
    // the class.
    hasClass: function (klass) {
      var classThere = false;
      this.forEach(function (e) {
        if (e.nodeType === 1 && e.className.indexOf(klass) >= 0) {
          classThere = true;
        }
      });
      return classThere;
    },
    // Adds CSS styling to any given number of elements.
    css: function (style) {
      return this.forEach(function (e) {
        e.setAttribute('style', style);
      });
    },
    // Adds eventlistener to any given number of elements
    on: (function () {
      if (d.addEventListener) {
        return function (evt, fn) {
          return this.forEach(function (e) {
            e.addEventListener(evt, fn, false);
          });
        };
      }
      if (d.attachEvent) {
        return function (evt, fn) {
          return this.forEach(function (e) {
            var bound = function () {
              return fn.apply(e, arguments);
            };
            e.attachEvent('on' + evt, bound);
            return bound;
          });
        };
      }
    }()),
    // Removes eventlistener from any given number of elements.
    off: (function () {
      if (d.removeEventListener) {
        return function (e, fn) {
          return this.forEach(function (el) {
            el.removeEventListener(e, fn, false);
          });
        };
      }
      if (d.detachEvent) {
        return function (e, fn) {
          return this.forEach(function (el) {
            el.detachEvent('on' + e, fn);
          });
        };
      }
    }()),
    // Compose implementation using recursion
    // From: http://javascript.boxsheep.com/how-to-javascript/How-to-write-a-compose-function/
    compose: function () {
      var fn = arguments,
          length = fn.length;
      return function () {
        return (function form(arg) {
          return length ? form(fn[--length].apply(this, arguments)) : arg;
        }).apply(this, arguments);
      };
    }
  };

  w.wenku = wenku;
}(document, window));
