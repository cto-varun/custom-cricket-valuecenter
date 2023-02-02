"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ValueCenter;
var _react = _interopRequireWildcard(require("react"));
require("./styles.css");
var _componentMessageBus = require("@ivoyant/component-message-bus");
var _OtherGenerateCode = _interopRequireDefault(require("./OtherGenerateCode"));
var _IncentiveEnrollment = _interopRequireDefault(require("./IncentiveEnrollment"));
var _HboMaxAvod = _interopRequireDefault(require("./HboMaxAvod"));
var _EbbAcpSummary = _interopRequireDefault(require("./EbbAcpSummary"));
var _EbbAcpCard = _interopRequireDefault(require("./EbbAcpCard"));
var _antd = require("antd");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ValueCenter(props) {
  const {
    Title
  } = _antd.Typography;
  const {
    properties,
    data,
    parentProps
  } = props;
  const {
    couponOrder = [],
    couponConfig,
    couponExclusions = [],
    couponInclusions = [],
    workflowConfig = [],
    hboMaxAvodWorkflow,
    ebbWorkflow,
    disabledEbbStatuses
  } = properties;
  let promotions = data.data?.promotions?.promotions?.current || [];
  const showHboMaxAvod = data.data?.promotions?.promotions?.hboMaxAvod;
  const [plan, setPlan] = (0, _react.useState)();
  const ebbDetails = data?.data?.ebbDetails;
  const ebbAcpData = ebbDetails?.associations?.find(_ref => {
    let {
      type
    } = _ref;
    return type === 'BroadbandBenefit';
  });
  const ebbAcpStatus = ebbAcpData?.status?.length ? ebbAcpData?.status[0]?.value : '';
  const [errorMessage, setErrorMessage] = (0, _react.useState)(false);
  const [ebbResponse, setEbbResponse] = (0, _react.useState)({
    enrollmentData: {
      ctn: ebbDetails?.associations?.length > 0 ? data?.data?.ebbDetails?.associations[0]?.id : ''
    },
    enrollmentTableData: [],
    timelineData: {
      events: []
    }
  });
  (0, _react.useEffect)(() => {
    if (ebbDetails?.cohorts?.length > 0) {
      if (ebbDetails?.cohorts?.indexOf('ACP') > -1 || ebbDetails?.cohorts?.indexOf('acp') > -1) {
        setPlan('ACP');
      } else if (ebbDetails?.cohorts?.indexOf('EBB') > -1 || ebbDetails?.cohorts?.indexOf('ebb') > -1) {
        setPlan('EBB');
      }
    }
  }, []);
  const ebbAcpworkflow = ebbWorkflow?.workflow;
  const ebbAcpResponseMapping = ebbWorkflow?.responseMapping;
  (0, _react.useEffect)(() => {
    handleEbbAcpData(ebbAcpworkflow, ebbAcpResponseMapping);
    return () => {
      _componentMessageBus.MessageBus.unsubscribe(ebbWorkflow?.workflow);
    };
  }, []);
  function handleEbbAcpResponse(subscriptionId, topic, eventData, closure) {
    const state = eventData.value;
    const isSuccess = ebbWorkflow?.successStates.includes(state);
    const isFailure = ebbWorkflow?.errorStates.includes(state);
    if (isSuccess || isFailure) {
      if (isSuccess) {
        let response = eventData?.event?.data?.data;
        setEbbResponse({
          ...ebbResponse,
          ...response,
          enrollmentData: {
            ...ebbResponse?.enrollmentData,
            ctn: response?.benefits[0]?.attributes?.find(_ref2 => {
              let {
                key
              } = _ref2;
              return key === 'BroadbandBenefit';
            })?.value,
            enrollmentId: response?.benefits[0]?.benefitCode,
            nextPaymentAmount: response?.benefits[0]?.value,
            nextExecution: response?.benefits[0]?.nextExecution
          },
          enrollmentTableData: response?.benefits[0]?.history || []
        });
      }
      if (isFailure) {
        setErrorMessage(eventData?.event?.data?.message || 'No data found matching the request criteria');
      }
      _componentMessageBus.MessageBus.unsubscribe(subscriptionId);
    }
  }
  function handleEbbAcpData(workflow, responseMapping) {
    const registrationId = `${workflow}`;
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
      header: {
        registrationId: registrationId,
        workflow,
        eventType: 'INIT'
      }
    });
    _componentMessageBus.MessageBus.subscribe(registrationId, 'WF.'.concat(workflow).concat('.STATE.CHANGE'), handleEbbAcpResponse, null);
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.SUBMIT'), {
      header: {
        registrationId: registrationId,
        workflow,
        eventType: 'SUBMIT'
      },
      body: {
        datasource: parentProps.datasources['360-enrollment-ebb'],
        request: {
          params: {
            billingAccountNumber: window[window.sessionStorage?.tabId].NEW_BAN
          },
          body: {}
        },
        responseMapping
      }
    });
  }
  const mergeConfigData = () => {
    const promosFromConfig = Object.keys(couponConfig);
    const idxOfDefault = promosFromConfig.indexOf('default');
    if (idxOfDefault !== -1) {
      promosFromConfig.splice(idxOfDefault, 1);
    }
    // Add data not present in currentPromos from config

    promotions = promotions.filter(
    //  Filter excluded promotions from conf
    p => p.promoCodeDescShort && (couponInclusions.length > 0 ? couponInclusions.includes(p.promoCodeDescShort) : !couponExclusions.includes(p.promoCodeDescShort))).map(p => {
      const idxOfDefault = promosFromConfig.indexOf('default');
      if (idxOfDefault !== -1) {
        promosFromConfig.splice(idxOfDefault, 1);
      }
      return {
        ...p,
        ...(couponConfig.hasOwnProperty(p.promoCodeDescShort) ? couponConfig[p.promoCodeDescShort] : couponConfig.default)
      };
    });
    promosFromConfig.forEach(pc => {
      const promo = {
        ...couponConfig[pc]
      };
      promo.shortCode = pc;
      promotions.push(promo);
    });
    promotions = promotions.map(p => {
      const promotion = {
        ...p
      };
      promotion.title = promotion.title || promotion.promoCodeDescLong;
      promotion.description = promotion.description || promotion.promoCodeDescLong;
      promotion.shortCode = promotion.shortCode || promotion.promoCodeDescShort;
      promotion.couponCode = promotion.couponCode || promotion.promoCode;
      promotion.startDate = promotion.startDate || promotion.promoAddDate;
      promotion.endDate = promotion.endDate || promotion.promoEndDate;
      return promotion;
    });
    const reducedData = promotions.reduce((acc, p) => {
      if (!acc[p.shortCode]) {
        acc[p.shortCode] = {
          type: p.type || p.shortCode,
          title: p.title,
          maxCoupons: p.maxCoupons,
          numOverrides: p.numOverrides,
          overrideShortCode: p.overrideShortCode,
          description: p.description,
          shortCode: p.shortCode,
          startDate: p.startDate,
          coupons: [],
          icon: p.icon
        };
      }
      if (p.couponCode) {
        acc[p.shortCode].coupons.push({
          couponCode: p.couponCode,
          startDate: p.startDate,
          endDate: p.endDate,
          icon: p.icon
        });
      }
      return acc;
    }, {});
    let values = Object.values(reducedData);
    return values.sort(p => couponOrder.indexOf(p.shortCode) >= 0 ? -1 * (couponOrder.length - couponOrder.indexOf(p.shortCode)) : 1);
  };
  const promoData = mergeConfigData() || {};
  const showEbbAcpDetails = plan && ebbAcpData && ebbResponse && !disabledEbbStatuses?.includes(ebbAcpStatus);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "value-center-layout"
  }, /*#__PURE__*/_react.default.createElement("div", {
    id: "colorstrip"
  }), /*#__PURE__*/_react.default.createElement(Title, {
    className: "text-setup",
    level: 5
  }, "Value Center"), /*#__PURE__*/_react.default.createElement("div", {
    className: "value-center-item-container"
  }, showEbbAcpDetails && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_EbbAcpSummary.default, _extends({
    plan: plan
  }, ebbAcpData, {
    ebbResponse: ebbResponse
  }))), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_EbbAcpCard.default, _extends({
    plan: plan
  }, ebbAcpData, {
    ebbResponse: ebbResponse
  }))), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_EbbAcpCard.default, _extends({
    plan: plan
  }, ebbAcpData, {
    ebbResponse: ebbResponse,
    needHelp: true
  })))), showHboMaxAvod && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_HboMaxAvod.default, {
    hboMaxAvodWorkflow: hboMaxAvodWorkflow,
    datasources: parentProps.datasources
  })), promoData && promoData.map((promo, promoIdx) => promo.type === 'enrollment' ? /*#__PURE__*/_react.default.createElement("div", {
    key: promoIdx
  }, /*#__PURE__*/_react.default.createElement(_IncentiveEnrollment.default, {
    promo: promo,
    workflowConfig: workflowConfig[promo.type],
    data: data.data,
    datasources: parentProps.datasources
  })) : /*#__PURE__*/_react.default.createElement("div", {
    key: promoIdx
  }, /*#__PURE__*/_react.default.createElement(_OtherGenerateCode.default, {
    title: promo.title || promo.shortCode,
    description: promo.description,
    type: promo.type,
    useby: promo.coupons[0].endDate,
    code: promo.coupons[0].couponCode
  })))));
}
module.exports = exports.default;