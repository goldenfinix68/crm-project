import React from "react";
import { Button, Empty, Typography } from "antd";

const EmailTab = () => (
    <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{ height: 60 }}
        description={
            <div>
                <Typography.Title level={4}>
                    Configure your Email Account
                </Typography.Title>
                <Typography.Text>
                    Eliminate manual email logging with Salesmate's two-way
                    email sync functionality. Measure email engagement with
                    email open and click tracking. Don't forget to use email
                    templates for your canned responses and repetitive emails.
                </Typography.Text>
            </div>
        }
    >
        <Button type="primary">Configure email account</Button>
    </Empty>
);

export default EmailTab;
