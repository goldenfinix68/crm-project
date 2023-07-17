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
    "Import your Contacts",
    "Connect your email",
    "Sync your calendar",
    "Review your sales pipeline",
    "Invite your team",
    "Use Sequences (Sales Cadence)",
    "Quickly book meetings",
];

const DashboardComponentWidgetGuide: React.FC<MyProps> = (props) => {
    const {} = props;

    return (
        <>
            <List
                className="setup-guide"
                size="large"
                header={
                    <div>
                        <Typography.Text strong>
                            Your Setup Guide
                        </Typography.Text>

                        <Progress
                            percent={0}
                            size={["100%", 15]}
                            className="m-t-xs m-b-n-xs"
                        />
                    </div>
                }
                bordered
                dataSource={data}
                renderItem={(item) => (
                    <List.Item
                        className="cursor"
                        onClick={() => {
                            console.log("click me");
                        }}
                    >
                        <Row gutter={12} className="w-100">
                            <Col span={22}>
                                <Space wrap>
                                    <FontAwesomeIcon
                                        icon={faCircleCheck}
                                        className="font-24px"
                                    />
                                    <Typography.Text>{item}</Typography.Text>
                                </Space>
                            </Col>
                            <Col span={2} className="text-right">
                                <FontAwesomeIcon icon={faAngleRight} />
                            </Col>
                        </Row>
                    </List.Item>
                )}
            />
        </>
    );
};

export default DashboardComponentWidgetGuide;
