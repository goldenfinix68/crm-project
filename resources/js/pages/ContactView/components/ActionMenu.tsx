import {
    PhoneFilled,
    MessageFilled,
    MailFilled,
    EllipsisOutlined,
} from "@ant-design/icons";
import { Button, Popover, Space, Tooltip } from "antd";
import React from "react";
import ActionMenuBtn from "./ActionMenuBtn";

const ActionMenu = () => (
    <Space
        style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #e8e8e8",
            borderBottom: "2px solid #e8e8e8",
            padding: "8px",
        }}
    >
        <ActionMenuBtn
            handleClick={() => {
                console.log("phone");
            }}
            icon={<PhoneFilled style={{ color: "white", fontSize: "10px" }} />}
            tooltip="Click to call"
        />
        <ActionMenuBtn
            handleClick={() => {
                console.log("phone");
            }}
            icon={
                <MessageFilled style={{ color: "white", fontSize: "10px" }} />
            }
            tooltip="Click to text"
        />
        <ActionMenuBtn
            handleClick={() => {
                console.log("phone");
            }}
            icon={<MailFilled style={{ color: "white", fontSize: "10px" }} />}
            tooltip="No email address found"
            isDisabled={true}
        />
        <ActionMenuBtn
            handleClick={() => {
                console.log("phone");
            }}
            icon={
                <span
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <MailFilled style={{ color: "white", fontSize: "10px" }} />
                    <MailFilled style={{ color: "white", fontSize: "10px" }} />
                    <MailFilled style={{ color: "white", fontSize: "10px" }} />
                </span>
            }
            tooltip="Enroll to sequence"
        />
        <ActionMenuBtn
            handleClick={() => {
                console.log("phone");
            }}
            icon={<EllipsisOutlined style={{ color: "white" }} />}
        />
    </Space>
);

export default ActionMenu;
