import React from "react";
import { Button, Col, Divider, Row, Space, Typography } from "antd";
import {
    CheckCircleOutlined,
    DollarOutlined,
    TagsOutlined,
    UserOutlined,
    ZoomInOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Setup: React.FC = () => {
    const navigate = useNavigate();
    const customizationButtons: any = [
        {
            icon: <UserOutlined />,
            title: "Contact",
            link: "setup/contact",
        },
        {
            icon: <DollarOutlined />,
            title: "Deal",
            link: "setup/deal",
        },
        {
            icon: <CheckCircleOutlined />,
            title: "Activity",
            link: "setup/activity",
        },
        {
            icon: <TagsOutlined />,
            title: "Tag Management",
            link: "setup/tag",
        },
        {
            icon: <ZoomInOutlined />,
            title: "Activity Types",
            link: "setup/activity-types",
        },
    ];

    return (
        <>
            <Divider
                orientation="left"
                orientationMargin="0"
                style={{ fontSize: 20 }}
            >
                Customizations
            </Divider>
            <Row gutter={[12, 15]}>
                {customizationButtons.map((item: any, key: React.Key) => {
                    return (
                        <Col xs={6} sm={6} md={4} key={key}>
                            <Space
                                direction="vertical"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Button
                                    className="button-link"
                                    shape="circle"
                                    size="large"
                                    icon={item.icon}
                                    style={{
                                        height: 80,
                                        width: 80,
                                    }}
                                    onClick={() => navigate(item.link)}
                                />

                                <Typography.Text style={{ fontSize: 16 }}>
                                    {item.title}
                                </Typography.Text>
                            </Space>
                        </Col>
                    );
                })}
            </Row>
        </>
    );
};

export default Setup;
