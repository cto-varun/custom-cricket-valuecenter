"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = GenerateCode;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function GenerateCode(props) {
  const {
    Title,
    Text
  } = _antd.Typography;

  //state
  const [code, setCode] = (0, _react.useState)(null);
  const [openoffer, setOpenOffer] = (0, _react.useState)(false);
  const [opencode, setOpencode] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    let dateSplit = props.useby.split('/');
    isLater(new Date(), new Date(dateSplit[2], dateSplit[0], dateSplit[1])) ? setOpenOffer(true) : setOpenOffer(false);
  }, [props]);
  const generateCode = () => {
    setOpencode(true);
  };
  function isLater(dateString1, dateString2) {
    return dateString1 > dateString2 ? true : false;
  }
  const cancelcode = () => {
    setCode(null);
    setOpencode(false);
  };
  return /*#__PURE__*/_react.default.createElement(_antd.Card, {
    className: "other-generate-code",
    bordered: false
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "generate-code-title"
  }, /*#__PURE__*/_react.default.createElement(Title, {
    level: 5
  }, props.title, /*#__PURE__*/_react.default.createElement("br", null), props.description)), /*#__PURE__*/_react.default.createElement("div", {
    className: "generate-code-date"
  }, /*#__PURE__*/_react.default.createElement(Text, {
    disabled: true
  }, "Use By ", props.useby)), /*#__PURE__*/_react.default.createElement("hr", null), opencode ? /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(Text, {
    style: {
      fontSize: 'small'
    },
    type: "success"
  }, props.code), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_antd.Button, {
    type: "text",
    onClick: cancelcode
  }, /*#__PURE__*/_react.default.createElement(Text, {
    type: "danger"
  }, "CANCEL"))) : /*#__PURE__*/_react.default.createElement("div", {
    className: "generate-code-action"
  }, !openoffer ? /*#__PURE__*/_react.default.createElement(_antd.Button, {
    type: "text",
    onClick: generateCode
  }, /*#__PURE__*/_react.default.createElement(Text, {
    type: "success"
  }, "REDEEM COUPON")) : /*#__PURE__*/_react.default.createElement(_antd.Button, {
    type: "text",
    disabled: true,
    danger: true
  }, /*#__PURE__*/_react.default.createElement(Text, {
    type: "danger"
  }, "OFFER EXPIRED"))));
}
module.exports = exports.default;