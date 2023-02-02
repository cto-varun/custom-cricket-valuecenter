"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = HboMaxAvod;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _icons = require("@ant-design/icons");
var _componentMessageBus = require("@ivoyant/component-message-bus");
require("./styles.css");
var _hbomax = _interopRequireDefault(require("../../../../public/assets/svgs/hbomax.svg"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
//hbomax icon

function HboMaxAvod(_ref) {
  let {
    hboMaxAvodWorkflow,
    datasources
  } = _ref;
  const {
    datasource,
    workflow,
    responseMapping,
    successStates,
    errorStates
  } = hboMaxAvodWorkflow;
  const [status, setStatus] = (0, _react.useState)('Show Status');
  const handlePromotionStatus = (subscriptionId, topic, eventData, closure) => {
    const isSuccess = successStates.includes(eventData.value);
    const isError = errorStates.includes(eventData.value);
    if (isSuccess || isError) {
      if (isSuccess) {
        setStatus(eventData?.event?.data?.data?.enrollmentStatus);
      }
      _componentMessageBus.MessageBus.unsubscribe(subscriptionId);
    }
  };
  const handleStatus = () => {
    if (status === 'Show Status') {
      _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
        header: {
          registrationId: workflow,
          workflow,
          eventType: 'INIT'
        }
      });
      _componentMessageBus.MessageBus.subscribe(workflow, 'WF.'.concat(workflow).concat('.STATE.CHANGE'), handlePromotionStatus, {});
      _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.SUBMIT'), {
        header: {
          registrationId: workflow,
          workflow,
          eventType: 'SUBMIT'
        },
        body: {
          datasource: datasources[datasource],
          request: {
            params: {
              programId: 'HBOMAXAVOD',
              accountId: window[sessionStorage.tabId]?.NEW_BAN
            }
          },
          responseMapping
        }
      });
    }
  };
  return /*#__PURE__*/_react.default.createElement(_antd.Card, {
    className: "special-generate-code",
    title: /*#__PURE__*/_react.default.createElement("div", {
      className: "hbo-card-head"
    }, "Introducing HBO Max\u2122 On Cricket Wireless", ' '),
    bordered: false,
    extra: /*#__PURE__*/_react.default.createElement(_antd.Avatar, {
      shape: "square",
      src: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("img", {
        src: _hbomax.default
      }))
    })
  }, /*#__PURE__*/_react.default.createElement(_antd.Typography, {
    className: "hbo-card-text"
  }, "Customers on the $60 plan get the ad-supported version of HBO Max as an included benefit", /*#__PURE__*/_react.default.createElement("br", null), "One benefit per BAN, activation required"), /*#__PURE__*/_react.default.createElement(_antd.Button, {
    className: "hbo-button",
    onClick: handleStatus
  }, status === 'NOTENROLLED' ? 'NOT ENROLLED' : status));
}
module.exports = exports.default;