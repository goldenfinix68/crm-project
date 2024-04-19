import React, { useEffect } from "react";
import { Layout, theme, notification } from "antd";
import Navigation from "./Navigation";
import Pusher from "pusher-js";

import IncomingCallListener from "../pages/Dialer/DialerTab/IncomingCallListener";
import { useAppContextProvider } from "../context/AppContext";
import ReactClearCache from "./ReactClearCache";
import ImpersonateBanner from "./ImpersonateBanner";
import queryClient from "../queryClient";

const { Header, Content } = Layout;

const SideMenu = ({ children, title }: { children: any; title?: string }) => {
    const [api, contextHolder] = notification.useNotification();

    const { loggedInUser } = useAppContextProvider();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const pusher = new Pusher((window as any).PUSHER_APP_KEY, {
        cluster: (window as any).PUSHER_APP_CLUSTER,
    });

    useEffect(() => {
        const mainUserId =
            loggedInUser?.role == "mainUser"
                ? loggedInUser.id
                : loggedInUser?.main_user?.id;
        // Subscribe to the Pusher channel and bind to the event

        const channel = pusher.subscribe(`notif-channel-${mainUserId}`);
        channel.bind(`notif-received-${mainUserId}`, (data) => {
            console.log("notif received", data);

            if (data?.type == "invalidateQuery") {
                queryClient.invalidateQueries(data.message);
            } else {
                if (data?.type == "text") {
                    queryClient.invalidateQueries("thread");
                    queryClient.invalidateQueries("textThreads");
                    const audio = new Audio("/sounds/text_sound.mp3");
                    audio.play();
                }

                api.open({
                    message: <b>{data?.message}</b> ?? "Default",
                    description: data?.description ?? "Default",
                });
            }
        });

        // Clean up the subscription when the component unmounts
        return () => {
            channel.unbind(`notif-received-${mainUserId}`);
            pusher.unsubscribe(`notif-channel-${mainUserId}`);
        };
    }, []);

    return (
        <>
            {contextHolder}
            <ReactClearCache />
            <ImpersonateBanner />
            <Layout style={{ minHeight: "100vh" }}>
                <Header
                    style={{
                        padding: "0px 30px",
                        background: colorBgContainer,
                    }}
                >
                    <Navigation title={title} />
                </Header>
                <Layout>
                    <Content
                        style={{
                            padding: "10px",
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
