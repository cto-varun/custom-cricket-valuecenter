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
import './styles.css';

//hbomax icon
import hbomax from '../../../../public/assets/svgs/hbomax.svg';

export default function HboMaxAvod({ hboMaxAvodWorkflow, datasources }) {
    const {
        datasource,
        workflow,
        responseMapping,
        successStates,
        errorStates,
    } = hboMaxAvodWorkflow;
    const [status, setStatus] = useState('Show Status');

    const handlePromotionStatus = (
        subscriptionId,
        topic,
        eventData,
        closure
    ) => {
        const isSuccess = successStates.includes(eventData.value);
        const isError = errorStates.includes(eventData.value);
        if (isSuccess || isError) {
            if (isSuccess) {
                setStatus(eventData?.event?.data?.data?.enrollmentStatus);
            }
            MessageBus.unsubscribe(subscriptionId);
        }
    };

    const handleStatus = () => {
        if (status === 'Show Status') {
            MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
                header: {
                    registrationId: workflow,
                    workflow,
                    eventType: 'INIT',
                },
            });
            MessageBus.subscribe(
                workflow,
                'WF.'.concat(workflow).concat('.STATE.CHANGE'),
                handlePromotionStatus,
                {}
            );
            MessageBus.send('WF.'.concat(workflow).concat('.SUBMIT'), {
                header: {
                    registrationId: workflow,
                    workflow,
                    eventType: 'SUBMIT',
                },
                body: {
                    datasource: datasources[datasource],
                    request: {
                        params: {
                            programId: 'HBOMAXAVOD',
                            accountId: window[sessionStorage.tabId]?.NEW_BAN,
                        },
                    },
                    responseMapping,
                },
            });
        }
    };

    return (
        <Card
            className="special-generate-code"
            title={
                <div className="hbo-card-head">
                    Introducing HBO Max™ On Cricket Wireless{' '}
                </div>
            }
            bordered={false}
            extra={<Avatar shape="square" src={<><img src={hbomax} /></>}  />}
        >
            <Typography className="hbo-card-text">
                Customers on the $60 plan get the ad-supported version of HBO
                Max as an included benefit
                <br />
                One benefit per BAN, activation required
            </Typography>
            <Button className="hbo-button" onClick={handleStatus}>
                {status === 'NOTENROLLED' ? 'NOT ENROLLED' : status}
            </Button>
        </Card>
    );
}
