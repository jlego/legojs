/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _mainView = __webpack_require__(4);

	var _mainView2 = _interopRequireDefault(_mainView);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	HBY.create({
	    el: 'body',
	    view: _mainView2.default
	}); // 界面框架入口

	HBY.startApp();

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _templateObject = _taggedTemplateLiteral(['<div>\n        <nav>\n            <ul>\n                <li><a href="javascript:HBY.startApp(\'home\');">\u83DC\u5355\u4E00</a></li>\n                <li><a href="javascript:HBY.startApp(\'test\');">\u83DC\u5355\u4E8C</a></li>\n            </ul>\n        </nav>\n        <content id="content"></content>\n        </div>'], ['<div>\n        <nav>\n            <ul>\n                <li><a href="javascript:HBY.startApp(\'home\');">\u83DC\u5355\u4E00</a></li>\n                <li><a href="javascript:HBY.startApp(\'test\');">\u83DC\u5355\u4E8C</a></li>\n            </ul>\n        </nav>\n        <content id="content"></content>\n        </div>']);

	function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var MainView = function (_HBY$View) {
	    _inherits(MainView, _HBY$View);

	    function MainView() {
	        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	        _classCallCheck(this, MainView);

	        var options = {
	            events: {
	                // 'click nav a': 'clickNav'
	            }
	        };
	        HBY.$.extend(true, options, opts);
	        return _possibleConstructorReturn(this, (MainView.__proto__ || Object.getPrototypeOf(MainView)).call(this, options));
	    }

	    _createClass(MainView, [{
	        key: 'render',
	        value: function render() {
	            var tmpl = hx(_templateObject);
	            return tmpl;
	        }
	    }, {
	        key: 'clickNav',
	        value: function clickNav(event) {
	            var target = HBY.$(event.currentTarget),
	                app = target.data('app');
	            HBY.startApp(app);
	        }
	    }]);

	    return MainView;
	}(HBY.View);

	exports.default = MainView;

/***/ }
/******/ ]);