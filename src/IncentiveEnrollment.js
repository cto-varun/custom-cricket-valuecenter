import React, { useState, useEffect } from 'react';
import {
    Button,
    Divider,
    Typography,
    Row,
    Col,
    Card,
    Avatar,
    notification,
} from 'antd';
import { GiftOutlined } from '@ant-design/icons';
import { MessageBus } from '@ivoyant/component-message-bus';

//hbomax icon
import hbomax from '../../../../public/assets/svgs/hbomax.svg';

export default function IncentiveEnrollment(props) {
    const { Title, Text } = Typography;
    const { promo, workflowConfig, data, datasources } = props;
    const {
        title,
        type,
        maxCoupons,
        numOverrides = 0,
        overrideShortCode,
        description,
        coupons,
        startDate,
        shortCode,
    } = promo;
    const {
        datasource,
        workflow,
        requestMapping,
        responseMapping,
        successStates,
        errorStates,
    } = workflowConfig;

    //state

    const [currentCoupons, setCurrentCoupons] = useState(coupons);

    const showNotification = (type, title) => {
        notification[type]({ message: title });
    };

    const handleEnrollmentResponse = (
        subscriptionId,
        topic,
        eventData,
        closure
    ) => {
        const isSuccess = successStates.includes(eventData.value);
        const isError = errorStates.includes(eventData.value);
        if (isError) {
            showNotification('error', eventData.event.data.message);
        }
        if (isSuccess) {
            let allCoupons = sessionStorage.getItem('coupons')
                ? JSON.parse(sessionStorage.getItem('coupons'))
                : [];
            const newCoupon = {
                couponCode: eventData.event.data.data.message.couponCode,
                startDate:
                    eventData.event.data.data.message?.startDate ||
                    new Date().toLocaleDateString(),
                endDate: eventData.event.data.data.message.expirationDate,
            };
            allCoupons.push(newCoupon);
            setCurrentCoupons(allCoupons);
        }
    };

    useEffect(() => {
        return () => {
            sessionStorage.removeItem('coupons');
            MessageBus.unsubscribe(workflow);
        };
    }, []);

    const enroll = () => {
        sessionStorage.setItem('coupons', JSON.stringify(currentCoupons));
        MessageBus.subscribe(
            workflow,
            'WF.'.concat(workflow).concat('.STATE.CHANGE'),
            handleEnrollmentResponse,
            {}
        );
        MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
            header: {
                registrationId: workflow,
                workflow,
                eventType: 'INIT',
            },
        });
        MessageBus.send('WF.'.concat(workflow).concat('.SUBMIT'), {
            header: {
                registrationId: workflow,
                workflow,
                eventType: 'SUBMIT',
            },
            body: {
                datasource: datasources[datasource],
                request: {
                    data,
                    type:
                        currentCoupons.length >= maxCoupons
                            ? overrideShortCode || shortCode
                            : shortCode,
                },
                requestMapping,
                responseMapping,
            },
        });
    };

    return (
        <Card
            className="special-generate-code"
            title={<Title level={5}>{title}</Title>}
            bordered={false}
            extra={<Avatar shape="square" src={<><img className="hbo-icon" src={hbomax} /></>} />}
        >
            {currentCoupons.length ? (
                <div className="coupon-list">
                    {currentCoupons.map((coupon, index) => (
                        <div key={index}>
                            <Text strong type="success">
                                {coupon.couponCode}
                            </Text>
                            <Row justify="space-between">
                                <Col>
                                    <Text style={{ fontSize: '12px' }}>
                                        Offered : {coupon.startDate}
                                    </Text>
                                </Col>
                                <Col>
                                    <Text style={{ fontSize: '12px' }}>
                                        Expires : {coupon.endDate}
                                    </Text>
                                </Col>
                            </Row>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="coupon-none">
                    <Text disabled>
                        <GiftOutlined className="coupon-discount" />
                    </Text>
                    <Text disabled className="coupon-available">
                        {new Date() > new Date(startDate) ? (
                            'Coupons Available'
                        ) : (
                            <>Starting &nbsp; {startDate}</>
                        )}
                    </Text>
                </div>
            )}
            <Divider />
            <Row justify="space-between" align="middle" className="footer">
                <Col span={18}>
                    <Button
                        type="text"
                        disabled={
                            currentCoupons.length === maxCoupons + numOverrides
                        }
                        onClick={() => enroll()}
                    >
                        <Text
                            type="success"
                            disabled={
                                currentCoupons.length ===
                                    maxCoupons + numOverrides ||
                                new Date() < new Date(startDate)
                            }
                        >
                            GET COUPON
                        </Text>
                    </Button>
                </Col>
                <Col style={{ textAlign: 'center' }} span={6}>
                    {currentCoupons.length < maxCoupons + numOverrides &&
                        new Date() > new Date(startDate) && (
                            <Text style={{ fontSize: 'small' }}>
                                <GiftOutlined />
                                &nbsp;
                                {maxCoupons +
                                    numOverrides -
                                    currentCoupons.length}
                            </Text>
                        )}
                </Col>
            </Row>
        </Card>
    );
}
