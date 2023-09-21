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
    MailOutlined,
    MessageOutlined,
    MobileOutlined,
    PhoneFilled,
    UsergroupAddOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import { useNavigate } from "react-router-dom";
import Deal from "../pages/Deal";
import Navigation from "./Navigation";
import { useCallContext } from "../context/CallContext";
import { useLoggedInUser } from "../api/query/userQuery";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const { Header, Sider, Content } = Layout;

const SideMenu = ({ children }) => {
    const navigate = useNavigate();
    const { setIsModalOpen, setCallerNumber, setDestinationNumber } =
        useCallContext();
    const { user, isLoading: isLogginUserLoading } = useLoggedInUser();
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
                            icon: <UsergroupAddOutlined />,
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
                        {
                            key: "/inbox",
                            icon: <MailOutlined />,
                            label: "Inbox",
                        },
                        {
                            key: "/texts",
                            icon: <MobileOutlined />,
                            label: "Text",
                        },
                        {
                            key: "/dialer",
                            icon: <PhoneOutlined />,
                            label: "Dialer",
                        },
                    ]}
                    onClick={(e) => {
                        if (e.key == "/dialer") {
                            setCallerNumber(
                                user.numbers?.length ? user.numbers[0] : ""
                            );
                            setDestinationNumber("");
                            setIsModalOpen(true);
                        } else {
                            navigate(e.key);
                        }
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
