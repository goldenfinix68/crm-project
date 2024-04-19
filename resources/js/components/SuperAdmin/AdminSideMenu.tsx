import React from "react";
import { UserOutlined, HomeOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";

import ReactClearCache from "../ReactClearCache";
import TopNavigation from "./TopNavigation";

const { Header, Sider, Content } = Layout;

const AdminSideMenu = ({ children }) => {
    const navigate = useNavigate();

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <>
            <ReactClearCache />
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
                                label: "Users",
                            },
                            {
                                key: "/users",
                                icon: <UserOutlined />,
                                label: "Users",
                            },
                        ]}
                        onClick={(e) => {
                            navigate(e.key);
                        }}
                    />
                </Sider>
                <Layout>
                    <Header
                        style={{
                            padding: "0px 30px",
                            background: colorBgContainer,
                        }}
                    >
                        <TopNavigation />
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
        </>
    );
};

export default AdminSideMenu;
