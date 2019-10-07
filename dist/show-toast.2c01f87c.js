// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../src/js/show-toast.js":[function(require,module,exports) {
var define;
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 * A Toast Box
 * v1.1.4 ©2018 PLDaily <pcd12321@gmail.com>
 * https://github.com/PLDaily/show-toast#readme
 */
!function (t, o) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && (typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' ? module.exports = o() : typeof define === 'function' && define.amd ? define([], o) : (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' ? exports.showToast = o() : t.showToast = o();
}(typeof self !== 'undefined' ? self : this, function () {
  return function (t) {
    function o(i) {
      if (e[i]) return e[i].exports;
      var r = e[i] = {
        i: i,
        l: !1,
        exports: {}
      };
      return t[i].call(r.exports, r, r.exports, o), r.l = !0, r.exports;
    }

    var e = {};
    return o.m = t, o.c = e, o.d = function (t, e, i) {
      o.o(t, e) || Object.defineProperty(t, e, {
        configurable: !1,
        enumerable: !0,
        get: i
      });
    }, o.n = function (t) {
      var e = t && t.__esModule ? function () {
        return t.default;
      } : function () {
        return t;
      };
      return o.d(e, 'a', e), e;
    }, o.o = function (t, o) {
      return Object.prototype.hasOwnProperty.call(t, o);
    }, o.p = '/', o(o.s = 0);
  }([function (t, o, e) {
    'use strict';

    var i = typeof Symbol === 'function' && _typeof(Symbol.iterator) === 'symbol' ? function (t) {
      return _typeof(t);
    } : function (t) {
      return t && typeof Symbol === 'function' && t.constructor === Symbol && t !== Symbol.prototype ? 'symbol' : _typeof(t);
    };

    var r = function r(t) {
      return (void 0 === t ? 'undefined' : i(t)) === 'object' && !!t;
    };

    var n = function n(t) {
      return Object.prototype.toString.call(t) === '[object String]';
    };

    var s = function s(t) {
      for (var o = arguments.length, e = Array(o > 1 ? o - 1 : 0), i = 1; i < o; i++) {
        e[i - 1] = arguments[i];
      }

      var r = !0;
      var n = !1;
      var s = void 0;

      try {
        for (var u, l = e[Symbol.iterator](); !(r = (u = l.next()).done); r = !0) {
          var a = u.value;

          for (var p in a) {
            t[p] = a[p];
          }
        }
      } catch (t) {
        n = !0, s = t;
      } finally {
        try {
          !r && l.return && l.return();
        } finally {
          if (n) throw s;
        }
      }

      return t;
    };

    var u = function u(t) {
      return t.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };

    var l = {
      _is_load: !1,
      showAlertMsgBox: function showAlertMsgBox(t) {
        if (this._is_load) this.doEvent(t);else {
          var o = [];
          o.push('zIndex:9999999999'), o.push('padding:12px'), o.push('minWidth:200px'), o.push('borderRadius:5px'), o.push('lineHeight:1.2'), o.push('fontSize:12px'), o.push('color:#FFF'), o.push('boxSizing:border-box'), o.push('backgroundColor:rgba(39, 39, 39, 0.7)'), o.push('position:fixed'), o.push('left:50%'), o.push('transform:translateX(-50%)'), o.push('textAlign:center');
          var e = document.createDocumentFragment();
          this.oDiv = document.createElement('div'), this.oDiv.className = 'show-toast';

          for (var i = 0, r = o.length; i < r; i++) {
            var n = u(o[i].split(':')[0]);
            var s = u(o[i].split(':')[1]);
            this.oDiv.style[n] = s;
          }

          e.appendChild(this.oDiv), document.body.appendChild(e), this._is_load = !0, this.doEvent(t);
        }
      },
      doEvent: function doEvent(t) {
        var o = this;
        this.timer && clearTimeout(this.timer), this.timer = setTimeout(function () {
          o.oDiv.style.display = 'none', clearTimeout(o.timer), o.timer = null;
        }, t.time), this.oDiv.style.display = 'block', this.oDiv.innerHTML = t.str, t.position === 'top' ? (this.oDiv.style.top = '50px', this.oDiv.style.bottom = 'auto', this.oDiv.style.transform = 'translate(-50%, 0)') : t.position === 'bottom' ? (this.oDiv.style.bottom = '50px', this.oDiv.style.top = 'auto', this.oDiv.style.transform = 'translate(-50%, 0)') : (this.oDiv.style.top = '50%', this.oDiv.style.bottom = 'auto', this.oDiv.style.transform = 'translate(-50%, -50%)');
      }
    };

    var a = function a(t) {
      var o = {};
      if (r(t)) o = t;else {
        if (!n(t)) throw new TypeError('Expected an object or a String');
        o = {
          str: t
        };
      }
      o = s({
        str: 'success',
        time: 2e3,
        position: 'middle'
      }, o), l.showAlertMsgBox(o);
    };

    t.exports = a;
  }]);
});
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63330" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../src/js/show-toast.js"], null)
//# sourceMappingURL=/show-toast.2c01f87c.js.map