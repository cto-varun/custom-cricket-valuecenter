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
import moment from 'moment';
import './ebbAcpStyles.css';

export default function EbbAcpSummary(props) {
    const { Title, Text } = Typography;

    const { plan, id, ebbResponse, status } = props;

    const ebbAcpStatus = status?.length ? status[0]?.value : '';
    const showDiscount = ebbAcpStatus === 'Active';
    const discount = ebbResponse?.benefits?.[0].value;
    const nextDiscountDate = ebbResponse?.benefits?.[0].nextExecution;

    const prevDiscountData = ebbResponse?.benefits?.[0]?.history.find((hi) => {
        return hi.status.toLowerCase() === 'applied';
    });

    return (
        <Card
            className="ebb-acp-summary"
            title={<div className="ebb-acp-card-head">{plan} Summary </div>}
            bordered={false}
        >
            <Divider />
            <div className="plan-summary-box">
                <div>
                    <div className="column-key"> CTN </div>
                    <div className="column-value">: {id} </div>
                </div>
                <div>
                    <div className="column-key"> Status </div>
                    <div className="column-value">
                        :{' '}
                        {ebbAcpStatus === 'active' ||
                        ebbAcpStatus === 'Active' ||
                        ebbAcpStatus === 'ACTIVE'
                            ? 'Enrolled'
                            : 'Not Enrolled'}{' '}
                    </div>
                </div>
                {showDiscount && (
                    <>
                        <div>
                            <div className="column-key"> Discount Amount </div>
                            <div className="column-value">: $ {discount} </div>
                        </div>
                        {prevDiscountData && (
                            <div>
                                <div className="column-key">
                                    {' '}
                                    Previous Discount Date{' '}
                                </div>
                                <div className="column-value">
                                    :{' '}
                                    {moment(
                                        prevDiscountData?.updateDate
                                    ).format('DD MMM YYYY')}{' '}
                                </div>
                            </div>
                        )}
                        <div>
                            <div className="column-key">
                                {' '}
                                Next Discount Date{' '}
                            </div>
                            <div className="column-value">
                                :{' '}
                                {moment(nextDiscountDate).format('DD MMM YYYY')}{' '}
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Divider />
        </Card>
    );
}
