import React, { useState, useEffect } from 'react';
import { Button, Typography, Card } from 'antd';

export default function GenerateCode(props) {
    const { Title, Text } = Typography;

    //state
    const [code, setCode] = useState(null);
    const [openoffer, setOpenOffer] = useState(false);
    const [opencode, setOpencode] = useState(false);

    useEffect(() => {
        let dateSplit = props.useby.split('/');
        isLater(new Date(), new Date(dateSplit[2], dateSplit[0], dateSplit[1]))
            ? setOpenOffer(true)
            : setOpenOffer(false);
    }, [props]);

    const generateCode = () => {
        setOpencode(true);
    };

    function isLater(dateString1, dateString2) {
        return dateString1 > dateString2 ? true : false;
    }

    const cancelcode = () => {
        setCode(null);
        setOpencode(false);
    };

    return (
        <Card className="other-generate-code" bordered={false}>
            <div className="generate-code-title">
                <Title level={5}>
                    {props.title}
                    <br />
                    {props.description}
                </Title>
            </div>

            <div className="generate-code-date">
                <Text disabled>Use By {props.useby}</Text>
            </div>
            <hr />
            {opencode ? (
                <div>
                    <Text style={{ fontSize: 'small' }} type="success">
                        {props.code}
                    </Text>
                    <br />
                    <Button type="text" onClick={cancelcode}>
                        <Text type="danger">CANCEL</Text>
                    </Button>
                </div>
            ) : (
                <div className="generate-code-action">
                    {!openoffer ? (
                        <Button type="text" onClick={generateCode}>
                            <Text type="success">REDEEM COUPON</Text>
                        </Button>
                    ) : (
                        <Button type="text" disabled danger>
                            <Text type="danger">OFFER EXPIRED</Text>
                        </Button>
                    )}
                </div>
            )}
        </Card>
    );
}
