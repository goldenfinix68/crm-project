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

const DashboardComponentWidgetDiscover: React.FC<MyProps> = (props) => {
    const {} = props;

    return (
        <>
            <List
                className="setup-guide"
                size="large"
                header={
                    <div>
                        <Typography.Text strong>Discover More</Typography.Text>
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

export default DashboardComponentWidgetDiscover;
