import React, { useEffect, useState } from 'react';
import './styles.css';

import { MessageBus } from '@ivoyant/component-message-bus';
import GenerateCode from './OtherGenerateCode';
import IncentiveEnrollment from './IncentiveEnrollment';
import HboMaxAvod from './HboMaxAvod';
import EbbAcpSummary from './EbbAcpSummary';
import EbbAcpCard from './EbbAcpCard';

import { Row, Typography } from 'antd';

export default function ValueCenter(props) {
    const { Title } = Typography;

    const { properties, data, parentProps } = props;
    const {
        couponOrder = [],
        couponConfig,
        couponExclusions = [],
        couponInclusions = [],
        workflowConfig = [],
        hboMaxAvodWorkflow,
        ebbWorkflow,
        disabledEbbStatuses,
    } = properties;

    let promotions = data.data?.promotions?.promotions?.current || [];

    const showHboMaxAvod = data.data?.promotions?.promotions?.hboMaxAvod;

    const [plan, setPlan] = useState();
    const ebbDetails = data?.data?.ebbDetails;

    const ebbAcpData = ebbDetails?.associations?.find(
        ({ type }) => type === 'BroadbandBenefit'
    );
    const ebbAcpStatus = ebbAcpData?.status?.length
        ? ebbAcpData?.status[0]?.value
        : '';

    const [errorMessage, setErrorMessage] = useState(false);

    const [ebbResponse, setEbbResponse] = useState({
        enrollmentData: {
            ctn:
                ebbDetails?.associations?.length > 0
                    ? data?.data?.ebbDetails?.associations[0]?.id
                    : '',
        },
        enrollmentTableData: [],
        timelineData: {
            events: [],
        },
    });

    useEffect(() => {
        if (ebbDetails?.cohorts?.length > 0) {
            if (
                ebbDetails?.cohorts?.indexOf('ACP') > -1 ||
                ebbDetails?.cohorts?.indexOf('acp') > -1
            ) {
                setPlan('ACP');
            } else if (
                ebbDetails?.cohorts?.indexOf('EBB') > -1 ||
                ebbDetails?.cohorts?.indexOf('ebb') > -1
            ) {
                setPlan('EBB');
            }
        }
    }, []);

    const ebbAcpworkflow = ebbWorkflow?.workflow;
    const ebbAcpResponseMapping = ebbWorkflow?.responseMapping;

    useEffect(() => {
        handleEbbAcpData(ebbAcpworkflow, ebbAcpResponseMapping);
        return () => {
            MessageBus.unsubscribe(ebbWorkflow?.workflow);
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
                        ctn: response?.benefits[0]?.attributes?.find(
                            ({ key }) => key === 'BroadbandBenefit'
                        )?.value,
                        enrollmentId: response?.benefits[0]?.benefitCode,
                        nextPaymentAmount: response?.benefits[0]?.value,
                        nextExecution: response?.benefits[0]?.nextExecution,
                    },
                    enrollmentTableData: response?.benefits[0]?.history || [],
                });
            }
            if (isFailure) {
                setErrorMessage(
                    eventData?.event?.data?.message ||
                        'No data found matching the request criteria'
                );
            }
            MessageBus.unsubscribe(subscriptionId);
        }
    }

    function handleEbbAcpData(workflow, responseMapping) {
        const registrationId = `${workflow}`;
        MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
            header: {
                registrationId: registrationId,
                workflow,
                eventType: 'INIT',
            },
        });
        MessageBus.subscribe(
            registrationId,
            'WF.'.concat(workflow).concat('.STATE.CHANGE'),
            handleEbbAcpResponse,
            null
        );
        MessageBus.send('WF.'.concat(workflow).concat('.SUBMIT'), {
            header: {
                registrationId: registrationId,
                workflow,
                eventType: 'SUBMIT',
            },
            body: {
                datasource: parentProps.datasources['360-enrollment-ebb'],
                request: {
                    params: {
                        billingAccountNumber:
                            window[window.sessionStorage?.tabId].NEW_BAN,
                    },
                    body: {},
                },
                responseMapping,
            },
        });
    }

    const mergeConfigData = () => {
        const promosFromConfig = Object.keys(couponConfig);
        const idxOfDefault = promosFromConfig.indexOf('default');
        if (idxOfDefault !== -1) {
            promosFromConfig.splice(idxOfDefault, 1);
        }
        // Add data not present in currentPromos from config

        promotions = promotions
            .filter(
                //  Filter excluded promotions from conf
                (p) =>
                    p.promoCodeDescShort &&
                    (couponInclusions.length > 0
                        ? couponInclusions.includes(p.promoCodeDescShort)
                        : !couponExclusions.includes(p.promoCodeDescShort))
            )
            .map((p) => {
                const idxOfDefault = promosFromConfig.indexOf('default');
                if (idxOfDefault !== -1) {
                    promosFromConfig.splice(idxOfDefault, 1);
                }
                return {
                    ...p,
                    ...(couponConfig.hasOwnProperty(p.promoCodeDescShort)
                        ? couponConfig[p.promoCodeDescShort]
                        : couponConfig.default),
                };
            });

        promosFromConfig.forEach((pc) => {
            const promo = { ...couponConfig[pc] };
            promo.shortCode = pc;
            promotions.push(promo);
        });

        promotions = promotions.map((p) => {
            const promotion = { ...p };
            promotion.title = promotion.title || promotion.promoCodeDescLong;
            promotion.description =
                promotion.description || promotion.promoCodeDescLong;
            promotion.shortCode =
                promotion.shortCode || promotion.promoCodeDescShort;
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
                    icon: p.icon,
                };
            }
            if (p.couponCode) {
                acc[p.shortCode].coupons.push({
                    couponCode: p.couponCode,
                    startDate: p.startDate,
                    endDate: p.endDate,
                    icon: p.icon,
                });
            }
            return acc;
        }, {});

        let values = Object.values(reducedData);

        return values.sort((p) =>
            couponOrder.indexOf(p.shortCode) >= 0
                ? -1 * (couponOrder.length - couponOrder.indexOf(p.shortCode))
                : 1
        );
    };

    const promoData = mergeConfigData() || {};

    const showEbbAcpDetails =
        plan &&
        ebbAcpData &&
        ebbResponse &&
        !disabledEbbStatuses?.includes(ebbAcpStatus);

    return (
        <div className="value-center-layout">
            <div id="colorstrip"></div>
            <Title className="text-setup" level={5}>
                Value Center
            </Title>
            <div className="value-center-item-container">
                {showEbbAcpDetails && (
                    <>
                        <div>
                            <EbbAcpSummary
                                plan={plan}
                                {...ebbAcpData}
                                ebbResponse={ebbResponse}
                            />
                        </div>
                        <div>
                            <EbbAcpCard
                                plan={plan}
                                {...ebbAcpData}
                                ebbResponse={ebbResponse}
                            />
                        </div>
                        <div>
                            <EbbAcpCard
                                plan={plan}
                                {...ebbAcpData}
                                ebbResponse={ebbResponse}
                                needHelp={true}
                            />
                        </div>
                    </>
                )}
                {showHboMaxAvod && (
                    <div>
                        <HboMaxAvod
                            hboMaxAvodWorkflow={hboMaxAvodWorkflow}
                            datasources={parentProps.datasources}
                        />
                    </div>
                )}
                {promoData &&
                    promoData.map((promo, promoIdx) =>
                        promo.type === 'enrollment' ? (
                            <div key={promoIdx}>
                                <IncentiveEnrollment
                                    promo={promo}
                                    workflowConfig={workflowConfig[promo.type]}
                                    data={data.data}
                                    datasources={parentProps.datasources}
                                />
                            </div>
                        ) : (
                            <div key={promoIdx}>
                                <GenerateCode
                                    title={promo.title || promo.shortCode}
                                    description={promo.description}
                                    type={promo.type}
                                    useby={promo.coupons[0].endDate}
                                    code={promo.coupons[0].couponCode}
                                />
                            </div>
                        )
                    )}
            </div>
        </div>
    );
}
