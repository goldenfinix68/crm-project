import React from "react";
import { Tabs, TabsProps } from "antd";
import { TelnyxRTCProvider } from "@telnyx/react-client";
import "./Dialer.css";
import DialerTab from "./DialerTab/DialerTab";

const Dialer = () => {
    const credential = {
        login_token:
            "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ0ZWxueXhfdGVsZXBob255IiwiZXhwIjoxNjg5MzQ4NzQ4LCJpYXQiOjE2ODkyNjIzNDgsImlzcyI6InRlbG55eF90ZWxlcGhvbnkiLCJqdGkiOiI0M2JjM2MyMi02NjI1LTQxNzgtOGI4NS0xZWVjZGJmYzE2OTIiLCJuYmYiOjE2ODkyNjIzNDcsInN1YiI6ImZkOGM5MjdiLWY2OTYtNDM2MS04MmRlLTVkZDg3NTI2ZTNiYSIsInRlbF90b2tlbiI6IlQ5RTNCYnQ4UTlqWTl5OE1td1Z0cHV1UDEzSFJwVXhVS3g2dDVNUXJwUlV0UlJCVkRRdE1MR1pfMWxNYzdvLUV6WlladFY0bS1lNFcxV1N0ck8wRjBKVkMxempxdU1QdW96T19UTkRHdVRQU1FTUUxiMjJjYXNfVWY3clhpVWRFbkl5bDk1UHd0el9VV25YY0VkdDRZZTNZIiwidHlwIjoiYWNjZXNzIn0.d_sQRBR6Xefnc6LdLpp3UcxIrHWCG4vRUIgaANDfRWExVRNnl29K0aDb3AtVBsePpRBdkBWPVxklQlsdKh-iFw",
    };
    const dialerTabs: TabsProps["items"] = [
        {
            key: "1",
            label: <b>DIALER</b>,
            children: <DialerTab />,
        },
        {
            key: "2",
            label: <b>PENDING</b>,
            children: `Content of Tab Pane 2`,
        },
        {
            key: "3",
            label: <b>RECENT</b>,
            children: `Content of Tab Pane 3`,
        },
        {
            key: "4",
            label: <b>MISSED</b>,
            children: `Content of Tab Pane 4`,
        },
        {
            key: "5",
            label: <b>VM'S</b>,
            children: `Content of Tab Pane 5`,
        },
        {
            key: "6",
            label: <b>SETTINGS</b>,
            children: `Content of Tab Pane 6`,
        },
    ];

    return (
        <>
            <TelnyxRTCProvider credential={credential}>
                <Tabs
                    className="dialerComponent"
                    defaultActiveKey="1"
                    items={dialerTabs}
                ></Tabs>
            </TelnyxRTCProvider>
        </>
    );

    // return (
    //     <TelnyxRTCProvider credential={credential}>
    //         <Phone />
    //     </TelnyxRTCProvider>
    // );
};

export default Dialer;
