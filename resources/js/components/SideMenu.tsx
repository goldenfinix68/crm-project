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
    GiftOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import { useNavigate } from "react-router-dom";
import Deal from "../pages/Deal";
import Navigation from "./Navigation";
import { useCallContext } from "../context/CallContext";
import { useLoggedInUser } from "../api/query/userQuery";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faUser } from "@fortawesome/free-solid-svg-icons";
import IncomingCallListener from "../pages/Dialer/DialerTab/IncomingCallListener";
import { useAppContextProvider } from "../context/AppContext";
import { updateAppVersion } from "../helpers";

const { Header, Sider, Content } = Layout;

const SideMenu = ({ children }) => {
    const navigate = useNavigate();
    const { setIsModalOpen, setCallerNumber, setDestinationNumber } =
        useCallContext();

    const { loggedInUser, isAppLatestVersion } = useAppContextProvider();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <>
            {!isAppLatestVersion && (
                <div className="updateAvailableDiv">
                    <div className="div1">
                        <GiftOutlined />
                    </div>
                    <div className="div2">
                        <h5>Updates available</h5>
                        <p>
                            A new and better version of the app is installed
                            <br />
                            and ready. Reload the page to get all the changes.
                        </p>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                updateAppVersion();
                            }}
                            type="primary"
                        >
                            Reload
                        </Button>
                    </div>
                </div>
            )}
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
                                key: "/contacts",
                                icon: <UsergroupAddOutlined />,
                                label: "Contacts",
                            },
                            // {
                            //     key: "/activities",
                            //     icon: <CheckCircleOutlined />,
                            //     label: "Activities",
                            // },
                            {
                                key: "/deals",
                                icon: <DollarCircleOutlined />,
                                label: "Deals",
                            },
                            // {
                            //     key: "/inbox",
                            //     icon: <MailOutlined />,
                            //     label: "Inbox",
                            // },
                            {
                                key: "/text-threads",
                                icon: <MobileOutlined />,
                                label: "Text Threads",
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
                                    loggedInUser?.numbers?.length
                                        ? loggedInUser.numbers[0].mobileNumber
                                        : ""
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

                <IncomingCallListener />
            </Layout>
        </>
    );
};

export default SideMenu;
