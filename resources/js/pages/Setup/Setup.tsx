import React, { useEffect } from "react";
import { Button, Col, Divider, Row, Space, Typography } from "antd";
import {
    AppstoreOutlined,
    BarChartOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DollarCircleOutlined,
    PhoneOutlined,
    TagsOutlined,
    UserOutlined,
    ZoomInOutlined,
    DatabaseOutlined,
    UsergroupAddOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContextProvider } from "../../context/AppContext";
import { allowedroleToAccess } from "../../constants";

const Setup: React.FC = (props) => {
    const navigate = useNavigate();
    const { loggedInUser } = useAppContextProvider();
    const customizationButtons: any = [
        {
            icon: <UsergroupAddOutlined />,
            title: "Contact",
            link: "/setup/customizations/contact",
        },
        {
            icon: <DollarCircleOutlined />,
            title: "Deal Pipeline",
            link: "/setup/customizations/deal-pipeline",
        },
        // {
        //     icon: <DollarCircleOutlined />,
        //     title: "Deal",
        //     link: "/setup/customizations/deal",
        // },
        // {
        //     icon: <CheckCircleOutlined />,
        //     title: "Activity",
        //     link: "/setup/customizations/activity",
        // },
        // {
        //     icon: <DollarOutlined />,
        //     title: "Deal",
        //     link: "/setup/customizations/deal",
        // },
        // {
        //     icon: <CheckCircleOutlined />,
        //     title: "Activity",
        //     link: "/setup/customizations/activity",
        // },
        // {
        //     icon: <PhoneOutlined />,
        //     title: "Calling Configurations",
        //     link: "/setup/customizations/activity",
        // },c
        // {
        //     icon: <BarChartOutlined />,
        //     title: "Deal Pipeline",
        //     link: "/setup/customizations/tag",
        // },
        {
            icon: <ZoomInOutlined />,
            title: "Activity Types",
            link: "/setup/customizations/activity-types",
        },
        // {
        //     icon: <AppstoreOutlined />,
        //     title: "System Modules",
        //     link: "/setup/customizations/modules",
        // },
        // {
        //     icon: <ClockCircleOutlined />,
        //     title: "Availability",
        //     link: "/setup/customizations/availability",
        // },
    ];

    const usersAndSecurityButtons: any = [
        {
            icon: <UserOutlined />,
            title: "Users",
            link: "/setup/customizations/users",
        },
        {
            icon: <PhoneOutlined />,
            title: "Call Forwarding",
            link: "/setup/customizations/call-forwarding",
        },
    ];

    const dataAdministration: any = [
        {
            icon: <DatabaseOutlined />,
            title: "Import Data",
            link: "/setup/data-administration/import-file",
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
            <Row gutter={[12, 20]}>
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

            <br />
            <br />
            <Divider
                orientation="left"
                orientationMargin="0"
                style={{ fontSize: 20 }}
            >
                Data Administration
            </Divider>
            <Row gutter={[12, 20]}>
                {dataAdministration.map((item: any, key: React.Key) => {
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

            {allowedroleToAccess.includes(loggedInUser?.role ?? "") && (
                <>
                    <br />
                    <br />
                    <Divider
                        orientation="left"
                        orientationMargin="0"
                        style={{ fontSize: 20 }}
                    >
                        Users & Security
                    </Divider>
                    <Row gutter={[12, 20]}>
                        {usersAndSecurityButtons.map(
                            (item: any, key: React.Key) => {
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
                                                onClick={() =>
                                                    navigate(item.link)
                                                }
                                            />

                                            <Typography.Text
                                                style={{ fontSize: 16 }}
                                            >
                                                {item.title}
                                            </Typography.Text>
                                        </Space>
                                    </Col>
                                );
                            }
                        )}
                    </Row>
                </>
            )}
        </>
    );
};

export default Setup;
