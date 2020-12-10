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
})({"modules/db.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.post = post;
exports.get = get;
exports.prepareData = prepareData;
exports.getData = getData;
var postServerURL = "https://foobarserver.herokuapp.com/order"; //Heroku server url link for POSTing to queue
// const restDbAPIKey = "5fbf87774af3f9656800cf33" //RestDB API key 

var getURL = "https://foobarserver.herokuapp.com/beertypes";
var rootData = ""; // POST TO DB

function post(data) {
  var postData = JSON.stringify(data);
  fetch(postServerURL, {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8" // "x-apikey": restDbAPIKey,
      // "cache-control": "no-cache"

    },
    body: postData
  }).then(function (res) {
    return res.json();
  }).then(function (data) {
    return console.log(data);
  });
}

function get(callback) {
  fetch(getURL).then(function (response) {
    return response.json();
  }).then(function (data) {
    callback(data);
  });
}

;

function prepareData(data) {
  showData(data);
  rootData = data;
}

;

function showData(data) {
  console.log(data);
}

function getData() {
  return rootData;
}
},{}],"modules/animation.mjs":[function(require,module,exports) {
"use strict";

var activeSection = "beers";
document.querySelectorAll("li").forEach(function (btn) {
  return btn.addEventListener("click", changeSection);
});
document.querySelectorAll("input[type=radio]").forEach(function (btn) {
  btn.addEventListener("click", setActivePaymentOption);
  console.log(btn);
});
document.querySelectorAll("#side-menu").forEach(function (btn) {
  return btn.addEventListener("click", toggleSideMenu);
});

function changeSection(e) {
  activeSection = e.target.id.split("-")[0];
  if (document.querySelector(".side-menu").classList.contains("extended")) document.querySelector(".side-menu").classList.toggle("extended"); //show only activeSection

  document.querySelectorAll("main > section").forEach(function (section) {
    if (section.id == activeSection) {
      section.classList.remove("hidden");
    } else {
      section.classList.add("hidden");
    }
  });
  document.querySelectorAll("li").forEach(function (btn) {
    return btn.classList.remove("active");
  });
  e.target.classList.add("active"); // hide the login section and redirect the user to "Beers" section

  if (e.target.id.split("-")[0] == "login") {
    document.querySelector("#beers").classList.remove("hidden");
    document.querySelector("#login").classList.add("hidden");
    document.querySelectorAll("li").forEach(function (btn) {
      return btn.classList.remove("active");
    });
    document.querySelector("#beers-btn").classList.add("active");
  }

  console.log(e.target.id.split("-")[0]);
}

function toggleSideMenu() {
  document.querySelector(".side-menu").classList.toggle("extended");
}

function setActivePaymentOption(e) {
  console.log(e.target);
  e.target.parentNode.parentNode.querySelectorAll("div").forEach(function (div) {
    return div.classList.remove("selected");
  });
  e.target.parentNode.classList.add("selected");
}

function learnMore(e) {
  console.log("learnmore");
  e.target.parentNode.parentNode.querySelector("section").classList.toggle("hidden");
}
},{}],"script/form.js":[function(require,module,exports) {
"use strict";

var db = _interopRequireWildcard(require("../modules/db.mjs"));

var anim = _interopRequireWildcard(require("../modules/animation.mjs"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

db.get(db.prepareData);
document.querySelector("#confirm-order").addEventListener("click", sendOrder);
setTimeout(function () {
  init();
}, 100);

function init() {
  addBeerTemplate(db.getData());
  document.querySelectorAll(".beer-text-wrapper .primary-btn").forEach(function (btn) {
    return btn.addEventListener("click", learnMore);
  });
  var orderBtns = document.querySelectorAll(".order-btn-wrapper button");
  orderBtns.forEach(function (btn) {
    return btn.addEventListener("click", orderBeer);
  });
}

function learnMore(e) {
  console.log("learnmore");
  e.target.parentNode.parentNode.querySelector("section").classList.toggle("hidden");
}

function orderBeer(e) {
  var orderAmount = e.target.parentNode.querySelector(".order-amount");

  if (e.target.textContent == "+") {
    orderAmount.textContent = parseInt(orderAmount.textContent) + 1;
  } else if (e.target.textContent == "-") {
    if (parseInt(orderAmount.textContent) >= 1) orderAmount.textContent = parseInt(orderAmount.textContent) - 1;
  }

  if (e.target.parentNode.parentNode.parentNode.id == "beers") {
    addBeerToCart(e.target.parentNode.parentNode);
  } else {
    changeBeerQuantity(e.target.parentNode.parentNode);
  }
}

function changeBeerQuantity(beer) {
  var existingBeer;
  var allBeers = document.querySelectorAll("#beers .beer-wrapper");

  var _iterator = _createForOfIteratorHelper(allBeers),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var beerOf = _step.value;
      if (beer.id == beerOf.id) existingBeer = beerOf;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  existingBeer.querySelector(".order-amount").textContent = beer.querySelector(".order-amount").textContent;
  if (parseInt(beer.querySelector(".order-amount").textContent) == 0) beer.parentNode.removeChild(beer);
}

function addBeerToCart(beer) {
  var isExistingBeer = false;
  var existingBeer;
  var cartBeers = document.querySelectorAll("#beer-cart-wrapper .beer-wrapper");

  var _iterator2 = _createForOfIteratorHelper(cartBeers),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var cartBeer = _step2.value;
      if (cartBeer.id == beer.id) isExistingBeer = true;
      existingBeer = cartBeer;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  console.log(parseInt(beer.querySelector(".order-amount").textContent));

  if (!isExistingBeer) {
    if (parseInt(beer.querySelector(".order-amount").textContent) != 0) {
      var newBeer = document.querySelector("#beer-template-quick").content.cloneNode(true);
      newBeer.querySelector("h2").textContent = beer.querySelector("h2").textContent;
      newBeer.querySelector(".beer-type").textContent = beer.querySelector(".beer-type").textContent;
      newBeer.querySelector(".beer-alc").textContent = beer.querySelector(".beer-alc").textContent;
      newBeer.querySelector(".order-amount").textContent = beer.querySelector(".order-amount").textContent;
      var orderBtns = newBeer.querySelectorAll(".order-btn-wrapper");
      orderBtns.forEach(function (btn) {
        return btn.addEventListener("click", orderBeer);
      });
      var randId = Math.floor(Math.random() * Math.floor(300));
      beer.id = randId;
      newBeer.querySelector(".beer-wrapper").id = randId;
      document.querySelector("#beer-cart-wrapper").appendChild(newBeer);
    }
  } else {
    if (parseInt(beer.querySelector(".order-amount").textContent) == 0) {
      existingBeer.parentNode.removeChild(existingBeer);
    } else existingBeer.querySelector(".order-amount").textContent = beer.querySelector(".order-amount").textContent;
  }
} // post the orders to the Heroku server


function sendOrder() {
  var postingData = [];
  var cartContent = document.querySelectorAll("#beer-cart-wrapper .beer-wrapper");
  cartContent.forEach(function (element) {
    var beerName = element.querySelector("h2").textContent;
    var beerAmount = element.querySelector(".order-amount").textContent;
    postingData.push({
      name: beerName,
      amount: beerAmount
    });
  });
  console.log(postingData);
  db.post(postingData);
}

;

function addBeerTemplate(dataArray) {
  var _iterator3 = _createForOfIteratorHelper(dataArray),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var data = _step3.value;
      var template = document.querySelector("#beer-template").content.cloneNode(true);
      template.querySelector("h2").textContent = data.name;
      template.querySelector(".beer-type").textContent = data.category;
      template.querySelector(".beer-alc").textContent = data.alc;
      template.querySelector(".beer-desc").textContent = data.description.overallImpression;
      template.querySelector(".aroma").textContent = data.description.aroma;
      template.querySelector(".appearance").textContent = data.description.appearance;
      template.querySelector(".flavor").textContent = data.description.flavor;
      template.querySelector(".mouthfeel").textContent = data.description.mouthfeel;
      template.querySelector(".overall").textContent = data.description.overallImpression;
      document.querySelector("#beers").appendChild(template);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
} // *** Log in - netlify identity ***
//! NETLIFY LINK FOR LOCAL TESTING: https://jovial-heisenberg-33c1c2.netlify.app
//open login modal on button click


document.querySelector("#login-btn").addEventListener('click', function () {
  netlifyIdentity.open();
}); // Bind to login/logout events and log the user name

netlifyIdentity.on('login', function (user) {
  return console.log('login suscessfull. User:', user.user_metadata.full_name);
});
netlifyIdentity.on('logout', function () {
  return console.log('Logged out');
}); // const user = netlifyIdentity.currentUser();
// console.log(user);
// console.log(user.user_metadata.full_name);
},{"../modules/db.mjs":"modules/db.mjs","../modules/animation.mjs":"modules/animation.mjs"}],"C:/Users/Xyzzy/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50485" + '/');

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
},{}]},{},["C:/Users/Xyzzy/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script/form.js"], null)
//# sourceMappingURL=/form.908d803d.js.map