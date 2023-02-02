"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = EbbAcpSummary;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _moment = _interopRequireDefault(require("moment"));
require("./ebbAcpStyles.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function EbbAcpSummary(props) {
  const {
    Title,
    Text
  } = _antd.Typography;
  const {
    plan,
    id,
    ebbResponse,
    status
  } = props;
  const ebbAcpStatus = status?.length ? status[0]?.value : '';
  const showDiscount = ebbAcpStatus === 'Active';
  const discount = ebbResponse?.benefits?.[0].value;
  const nextDiscountDate = ebbResponse?.benefits?.[0].nextExecution;
  const prevDiscountData = ebbResponse?.benefits?.[0]?.history.find(hi => {
    return hi.status.toLowerCase() === 'applied';
  });
  return /*#__PURE__*/_react.default.createElement(_antd.Card, {
    className: "ebb-acp-summary",
    title: /*#__PURE__*/_react.default.createElement("div", {
      className: "ebb-acp-card-head"
    }, plan, " Summary "),
    bordered: false
  }, /*#__PURE__*/_react.default.createElement(_antd.Divider, null), /*#__PURE__*/_react.default.createElement("div", {
    className: "plan-summary-box"
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: "column-key"
  }, " CTN "), /*#__PURE__*/_react.default.createElement("div", {
    className: "column-value"
  }, ": ", id, " ")), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: "column-key"
  }, " Status "), /*#__PURE__*/_react.default.createElement("div", {
    className: "column-value"
  }, ":", ' ', ebbAcpStatus === 'active' || ebbAcpStatus === 'Active' || ebbAcpStatus === 'ACTIVE' ? 'Enrolled' : 'Not Enrolled', ' ')), showDiscount && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: "column-key"
  }, " Discount Amount "), /*#__PURE__*/_react.default.createElement("div", {
    className: "column-value"
  }, ": $ ", discount, " ")), prevDiscountData && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: "column-key"
  }, ' ', "Previous Discount Date", ' '), /*#__PURE__*/_react.default.createElement("div", {
    className: "column-value"
  }, ":", ' ', (0, _moment.default)(prevDiscountData?.updateDate).format('DD MMM YYYY'), ' ')), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: "column-key"
  }, ' ', "Next Discount Date", ' '), /*#__PURE__*/_react.default.createElement("div", {
    className: "column-value"
  }, ":", ' ', (0, _moment.default)(nextDiscountDate).format('DD MMM YYYY'), ' ')))), /*#__PURE__*/_react.default.createElement(_antd.Divider, null));
}
module.exports = exports.default;