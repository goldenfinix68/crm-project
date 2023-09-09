import React, { useEffect, useState } from "react";
import { Col, Layout, Menu, Row, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import {
    SlidersOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";

interface SetupLayoutProps {
    content: any;
    title: string;
}

const SetupLayout: React.FC<SetupLayoutProps> = (props) => {
    const { content, title } = props;
    const sideMenuItems: any = [
        {
            key: "customizations",
            icon: <SlidersOutlined />,
            label: "Customizations",
            children: [
                {
                    key: "customizations/Contacts",
                    label: "Contact",
                },
                {
                    key: "customizations/Deal",
                    label: "Deal",
                },
                {
                    key: "customizations/Activity",
                    label: "Activity",
                },
                {
                    key: "customizations/Calling",
                    label: "Calling Configurations",
                },
                {
                    key: "customizations/Tag",
                    label: "Tag Management",
                    path: "/setup/tag",
                },
                {
                    key: "customizations/Pipeline",
                    label: "Deal Pipeline",
                },
                {
                    key: "customizations/Types",
                    label: "Activity Types",
                },
                {
                    key: "customizations/System",
                    label: "System Modules",
                },
                {
                    key: "customizations/Availabity",
                    label: "Availabity",
                },
            ],
        },
        {},
    ];

    return (
        <Layout className="setup-layout">
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <div className="demo-logo-vertical" />
                <Menu theme="dark" mode="inline" items={sideMenuItems} />
            </Sider>
            <Layout>
                <Layout.Header
                    style={{
                        padding: 0,
                        // background: colorBgContainer
                    }}
                >
                    <Row gutter={12}>
                        <Col span={12} className="p-l-md">
                            <Typography.Text>{title}</Typography.Text>
                        </Col>
                        <Col span={12} className="text-right"></Col>
                    </Row>
                </Layout.Header>
                <Layout.Content style={{ margin: "24px 16px 0" }}>
                    {content}
                </Layout.Content>
            </Layout>
        </Layout>
    );
};

export default SetupLayout;
