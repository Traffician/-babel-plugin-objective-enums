"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _objectiveEnums = _interopRequireDefault(require("objective-enums"));

var Colors = new (
/*#__PURE__*/
function (_Enum) {
  (0, _inherits2.default)(Colors, _Enum);

  function Colors() {
    (0, _classCallCheck2.default)(this, Colors);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Colors).apply(this, arguments));
  }

  return Colors;
}(_objectiveEnums.default))({
  'Red': "#FF0000",
  'Yellow': ({r:255,g:255,b:0}),
  'Green': 32768,
  'Blue': true,
  'White': 5,
  'Black': 250
});