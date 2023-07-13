import React, { useState } from "react";
import { CaretDownFilled } from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Dropdown,
    List,
    Progress,
    Row,
    Space,
    Typography,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

interface MyProps {
    props: any;
}

const data = [
    "Built-in calling and texting",
    "Team / Shared Inbox",
    "Create forms to capture leads",
    "Automate your journeys",
    "Explore chat",
];

const DashboardComponentWidgetWatch: React.FC<MyProps> = (props) => {
    const {} = props;

    return (
        <>
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Card
                        bodyStyle={{ padding: "15px 20px 20px" }}
                        style={{ borderRadius: 5 }}
                    >
                        <Typography.Text strong>
                            Use From Anywhere
                        </Typography.Text>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card
                        bodyStyle={{ padding: "15px 20px 20px" }}
                        style={{ borderRadius: 5 }}
                    >
                        <Typography.Text strong>
                            Use From Anywhere
                        </Typography.Text>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default DashboardComponentWidgetWatch;
