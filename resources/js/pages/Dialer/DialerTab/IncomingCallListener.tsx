import { Button, Modal, Space, Tabs, TabsProps } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Audio } from "@telnyx/react-client";
import DialerTab from "./DialerTab";
import { useCallContext } from "../../../context/CallContext";
import RecentTab from "./RecentTab";
import { useAppContextProvider } from "../../../context/AppContext";
import LoadingComponent from "../../../components/LoadingComponent";

const IncomingCallListener = () => {
    const [isLoading, setIsloading] = useState(false);

    const { isModalOpen, setIsModalOpen, callerNumber, destinationNumber } =
        useCallContext();

    const dialerTabs: TabsProps["items"] = [
        {
            key: "1",
            label: <b>DIALER</b>,
            children: <DialerTab />,
        },
        {
            key: "3",
            label: <b>RECENT</b>,
            children: <RecentTab />,
        },
    ];

    return (
        <>
            <Modal
                open={isModalOpen}
                footer={null}
                onCancel={() => {
                    setIsModalOpen(false);
                }}
            >
                <Tabs
                    className="dialerComponent"
                    defaultActiveKey="1"
                    items={dialerTabs}
                />
            </Modal>
        </>
    );
};

export default IncomingCallListener;
