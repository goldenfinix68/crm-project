import React, { useState } from "react";
import {
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    CheckCircleOutlined,
    PhoneOutlined,
    DollarCircleOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import { useNavigate } from "react-router-dom";
import Deal from "../pages/Deal";
import Navigation from "./Navigation";

const { Header, Sider, Content } = Layout;

const SideMenu = ({ children }) => {
    const navigate = useNavigate();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={true}
                style={{
                    backgroundColor: "#F4F5F7",
                    borderInlineEnd: "1px solid rgba(5, 5, 5, 0.06)",
                }}
            >
                <div className="demo-logo-vertical" />
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    style={{
                        minHeight: "100vh",
                        backgroundColor: "#F4F5F7",
                        border: 0,
                    }}
                    items={[
                        {
                            key: "/dashboard",
                            icon: <HomeOutlined />,
                            label: "Dashboard",
                        },
                        {
                            key: "/users",
                            icon: <UserOutlined />,
                            label: "Users",
                        },
                        {
                            key: "/contacts",
                            icon: <PhoneOutlined />,
                            label: "Contacts",
                        },
                        {
                            key: "/activities",
                            icon: <CheckCircleOutlined />,
                            label: "Activities",
                        },
                        {
                            key: "/deals",
                            icon: <DollarCircleOutlined />,
                            label: "Deals",
                        },
                    ]}
                    onClick={(e) => {
                        navigate(e.key);
                    }}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Navigation />
                </Header>
                <Content
                    style={{
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default SideMenu;
