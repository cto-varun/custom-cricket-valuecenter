"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IncentiveEnrollment;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _icons = require("@ant-design/icons");
var _componentMessageBus = require("@ivoyant/component-message-bus");
var _hbomax = _interopRequireDefault(require("../../../../public/assets/svgs/hbomax.svg"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
//hbomax icon

function IncentiveEnrollment(props) {
  const {
    Title,
    Text
  } = _antd.Typography;
  const {
    promo,
    workflowConfig,
    data,
    datasources
  } = props;
  const {
    title,
    type,
    maxCoupons,
    numOverrides = 0,
    overrideShortCode,
    description,
    coupons,
    startDate,
    shortCode
  } = promo;
  const {
    datasource,
    workflow,
    requestMapping,
    responseMapping,
    successStates,
    errorStates
  } = workflowConfig;

  //state

  const [currentCoupons, setCurrentCoupons] = (0, _react.useState)(coupons);
  const showNotification = (type, title) => {
    _antd.notification[type]({
      message: title
    });
  };
  const handleEnrollmentResponse = (subscriptionId, topic, eventData, closure) => {
    const isSuccess = successStates.includes(eventData.value);
    const isError = errorStates.includes(eventData.value);
    if (isError) {
      showNotification('error', eventData.event.data.message);
    }
    if (isSuccess) {
      let allCoupons = sessionStorage.getItem('coupons') ? JSON.parse(sessionStorage.getItem('coupons')) : [];
      const newCoupon = {
        couponCode: eventData.event.data.data.message.couponCode,
        startDate: eventData.event.data.data.message?.startDate || new Date().toLocaleDateString(),
        endDate: eventData.event.data.data.message.expirationDate
      };
      allCoupons.push(newCoupon);
      setCurrentCoupons(allCoupons);
    }
  };
  (0, _react.useEffect)(() => {
    return () => {
      sessionStorage.removeItem('coupons');
      _componentMessageBus.MessageBus.unsubscribe(workflow);
    };
  }, []);
  const enroll = () => {
    sessionStorage.setItem('coupons', JSON.stringify(currentCoupons));
    _componentMessageBus.MessageBus.subscribe(workflow, 'WF.'.concat(workflow).concat('.STATE.CHANGE'), handleEnrollmentResponse, {});
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
      header: {
        registrationId: workflow,
        workflow,
        eventType: 'INIT'
      }
    });
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.SUBMIT'), {
      header: {
        registrationId: workflow,
        workflow,
        eventType: 'SUBMIT'
      },
      body: {
        datasource: datasources[datasource],
        request: {
          data,
          type: currentCoupons.length >= maxCoupons ? overrideShortCode || shortCode : shortCode
        },
        requestMapping,
        responseMapping
      }
    });
  };
  return /*#__PURE__*/_react.default.createElement(_antd.Card, {
    className: "special-generate-code",
    title: /*#__PURE__*/_react.default.createElement(Title, {
      level: 5
    }, title),
    bordered: false,
    extra: /*#__PURE__*/_react.default.createElement(_antd.Avatar, {
      shape: "square",
      src: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("img", {
        className: "hbo-icon",
        src: _hbomax.default
      }))
    })
  }, currentCoupons.length ? /*#__PURE__*/_react.default.createElement("div", {
    className: "coupon-list"
  }, currentCoupons.map((coupon, index) => /*#__PURE__*/_react.default.createElement("div", {
    key: index
  }, /*#__PURE__*/_react.default.createElement(Text, {
    strong: true,
    type: "success"
  }, coupon.couponCode), /*#__PURE__*/_react.default.createElement(_antd.Row, {
    justify: "space-between"
  }, /*#__PURE__*/_react.default.createElement(_antd.Col, null, /*#__PURE__*/_react.default.createElement(Text, {
    style: {
      fontSize: '12px'
    }
  }, "Offered : ", coupon.startDate)), /*#__PURE__*/_react.default.createElement(_antd.Col, null, /*#__PURE__*/_react.default.createElement(Text, {
    style: {
      fontSize: '12px'
    }
  }, "Expires : ", coupon.endDate)))))) : /*#__PURE__*/_react.default.createElement("div", {
    className: "coupon-none"
  }, /*#__PURE__*/_react.default.createElement(Text, {
    disabled: true
  }, /*#__PURE__*/_react.default.createElement(_icons.GiftOutlined, {
    className: "coupon-discount"
  })), /*#__PURE__*/_react.default.createElement(Text, {
    disabled: true,
    className: "coupon-available"
  }, new Date() > new Date(startDate) ? 'Coupons Available' : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "Starting \xA0 ", startDate))), /*#__PURE__*/_react.default.createElement(_antd.Divider, null), /*#__PURE__*/_react.default.createElement(_antd.Row, {
    justify: "space-between",
    align: "middle",
    className: "footer"
  }, /*#__PURE__*/_react.default.createElement(_antd.Col, {
    span: 18
  }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    type: "text",
    disabled: currentCoupons.length === maxCoupons + numOverrides,
    onClick: () => enroll()
  }, /*#__PURE__*/_react.default.createElement(Text, {
    type: "success",
    disabled: currentCoupons.length === maxCoupons + numOverrides || new Date() < new Date(startDate)
  }, "GET COUPON"))), /*#__PURE__*/_react.default.createElement(_antd.Col, {
    style: {
      textAlign: 'center'
    },
    span: 6
  }, currentCoupons.length < maxCoupons + numOverrides && new Date() > new Date(startDate) && /*#__PURE__*/_react.default.createElement(Text, {
    style: {
      fontSize: 'small'
    }
  }, /*#__PURE__*/_react.default.createElement(_icons.GiftOutlined, null), "\xA0", maxCoupons + numOverrides - currentCoupons.length))));
}
module.exports = exports.default;