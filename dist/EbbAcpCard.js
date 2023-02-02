"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = EbbAcpCard;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _moment = _interopRequireDefault(require("moment"));
var _componentLinkButton = _interopRequireDefault(require("@ivoyant/component-link-button"));
require("./ebbAcpStyles.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function EbbAcpCard(_ref) {
  let {
    plan,
    ebbResponse,
    needHelp = false
  } = _ref;
  const {
    Title,
    Text
  } = _antd.Typography;
  const {
    validityPeriod = {}
  } = ebbResponse;
  return !needHelp ? /*#__PURE__*/_react.default.createElement(_antd.Card, {
    className: "ebb-acp-card display-none",
    bordered: false
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "ebb-acp-code-title"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "ebb-acp-card-head"
  }, plan, " adjustment has been applied")), validityPeriod?.start && /*#__PURE__*/_react.default.createElement("div", {
    className: "ebb-acp-code-date",
    style: {
      marginBottom: '20px'
    }
  }, /*#__PURE__*/_react.default.createElement(Text, null, "Applied on", ' ', (0, _moment.default)(validityPeriod?.start).format('DD MMM YYYY'))), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_componentLinkButton.default, {
    href: "/dashboards/history-board#enrollments",
    routeData: {
      currentTab: 2
    }
  }, /*#__PURE__*/_react.default.createElement(Text, {
    style: {
      color: '#52C41A'
    }
  }, "SEE ADJUSTMENT")))) : /*#__PURE__*/_react.default.createElement(_antd.Card, {
    className: "ebb-acp-card display-none",
    bordered: false
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "ebb-acp-code-title",
    style: {
      marginBottom: '58px'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "ebb-acp-card-head"
  }, "Need help with ", plan, " Enrollment?")), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_componentLinkButton.default, {
    href: "/dashboards/ebb-enrollment"
  }, /*#__PURE__*/_react.default.createElement(Text, {
    style: {
      color: '#52C41A'
    }
  }, "SEE ", plan, " FORM"))));
}
module.exports = exports.default;