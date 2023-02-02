import React, { useState, useEffect } from 'react';
import { Button, Typography, Card, Divider } from 'antd';
import moment from 'moment';
import LinkButton from '@ivoyant/component-link-button';
import './ebbAcpStyles.css';

export default function EbbAcpCard({ plan, ebbResponse, needHelp = false }) {
    const { Title, Text } = Typography;
    const { validityPeriod = {} } = ebbResponse;
    return !needHelp ? (
        <Card className="ebb-acp-card display-none" bordered={false}>
            <div className="ebb-acp-code-title">
                <div className="ebb-acp-card-head">
                    {plan} adjustment has been applied
                </div>
            </div>
            {validityPeriod?.start && (
                <div
                    className="ebb-acp-code-date"
                    style={{ marginBottom: '20px' }}
                >
                    <Text>
                        Applied on{' '}
                        {moment(validityPeriod?.start).format('DD MMM YYYY')}
                    </Text>
                </div>
            )}
            <div>
                <LinkButton
                    href="/dashboards/history-board#enrollments"
                    routeData={{ currentTab: 2 }}
                >
                    <Text style={{ color: '#52C41A' }}>SEE ADJUSTMENT</Text>
                </LinkButton>
            </div>
        </Card>
    ) : (
        <Card className="ebb-acp-card display-none" bordered={false}>
            <div
                className="ebb-acp-code-title"
                style={{ marginBottom: '58px' }}
            >
                <div className="ebb-acp-card-head">
                    Need help with {plan} Enrollment?
                </div>
            </div>
            <div>
                <LinkButton href="/dashboards/ebb-enrollment">
                    <Text style={{ color: '#52C41A' }}>SEE {plan} FORM</Text>
                </LinkButton>
            </div>
        </Card>
    );
}
