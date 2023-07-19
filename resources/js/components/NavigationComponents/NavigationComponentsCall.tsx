import React, { useState } from "react";
import { Dropdown, Space, Tabs, Typography } from "antd";
import type { MenuProps, TabsProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

const itemTabs: TabsProps["items"] = [
    {
        key: "1",
        label: `DIALER`,
        children: `Content of Tab Pane 1`,
    },
    {
        key: "2",
        label: `PENDING`,
        children: `Content of Tab Pane 2`,
    },
    {
        key: "3",
        label: `RECENT`,
        children: `Content of Tab Pane 3`,
    },
    {
        key: "4",
        label: `MISSED`,
        children: `Content of Tab Pane 3`,
    },
    {
        key: "5",
        label: `VM'S`,
        children: `Content of Tab Pane 3`,
    },
    {
        key: "6",
        label: `SETTINGS`,
        children: `Content of Tab Pane 3`,
    },
];

const NavigationComponentsCall: React.FC = () => {
    const onChange = (key: string) => {
        console.log(key);
    };

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <div className="list-data">
                    <Tabs
                        defaultActiveKey="1"
                        items={itemTabs}
                        onChange={onChange}
                    />
                </div>
            ),
        },
    ];

    return (
        <>
            <Dropdown
                menu={{ items }}
                placement="bottomRight"
                arrow
                overlayClassName="header-call"
                trigger={["click"]}
            >
                <FontAwesomeIcon icon={faPhone} />
            </Dropdown>
        </>
    );
};

export default NavigationComponentsCall;
