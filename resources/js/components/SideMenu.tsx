import React, { useEffect } from "react";
import {
    HomeOutlined,
    PhoneOutlined,
    DollarCircleOutlined,
    MobileOutlined,
    UsergroupAddOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, notification } from "antd";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import { useCallContext } from "../context/CallContext";
import Pusher from "pusher-js";

import IncomingCallListener from "../pages/Dialer/DialerTab/IncomingCallListener";
import { useAppContextProvider } from "../context/AppContext";
import ReactClearCache from "./ReactClearCache";
import ImpersonateBanner from "./ImpersonateBanner";
import queryClient from "../queryClient";

const { Header, Sider, Content } = Layout;

const SideMenu = ({ children, title }: { children: any; title?: string }) => {
    const navigate = useNavigate();
    const { setIsModalOpen, setCallerNumber, setDestinationNumber } =
        useCallContext();
    const [api, contextHolder] = notification.useNotification();

    const { loggedInUser } = useAppContextProvider();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const pusher = new Pusher((window as any).PUSHER_APP_KEY, {
        cluster: (window as any).PUSHER_APP_CLUSTER,
    });

    useEffect(() => {
        // Subscribe to the Pusher channel and bind to the event
        const channel = pusher.subscribe("text-channel");
        channel.bind("text-received", (data) => {
            console.log("Received a text:", data);
            queryClient.invalidateQueries("callHistory");
        });

        // Clean up the subscription when the component unmounts
        return () => {
            channel.unbind("text-received");
            pusher.unsubscribe("text-channel");
        };
    }, []);

    useEffect(() => {
        const mainUserId =
            loggedInUser?.role == "mainUser"
                ? loggedInUser.id
                : loggedInUser?.main_user?.id;
        // Subscribe to the Pusher channel and bind to the event
        const channel = pusher.subscribe(`notif-channel-${mainUserId}`);
        channel.bind(`notif-received-${mainUserId}`, (data) => {
            console.log("Call webhook receive:", data);
            api.open({
                message: data?.message ?? "Default",
                description: data?.description ?? "Default",
                duration: 0,
            });
        });

        // Clean up the subscription when the component unmounts
        return () => {
            channel.unbind("text-received");
            pusher.unsubscribe("text-channel");
        };
    }, []);

    return (
        <>
            {contextHolder}
            <ReactClearCache />
            <ImpersonateBanner />
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
                        <Navigation title={title} />
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
