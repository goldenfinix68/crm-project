import React from "react";
import { Avatar, Space } from "antd";
import { TText } from "../../../entities";

const ChatBoxItem = ({ name, text }: { name: string; text: TText }) => {
    return text.isFromApp ? (
        <div
            style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
            }}
        >
            <Avatar
                className="avatarText m-r-sm"
                size={32}
                style={{
                    backgroundColor: "#1677FF",
                    verticalAlign: "middle",
                    flexShrink: 0, // Prevent the Avatar from being shrunk
                }}
            >
                {name.charAt(0)}
            </Avatar>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                    style={{
                        backgroundColor: "white",
                        padding: "12px 24px", // Adjust the padding as needed
                        borderRadius: "20px 20px 20px 0",
                    }}
                >
                    {text.message}
                </div>
                <div style={{ marginTop: "8px", fontSize: "10px" }}>
                    {text.month.substring(0, 3) +
                        " " +
                        text.day +
                        ", " +
                        text.year +
                        " " +
                        text.time}
                </div>
            </div>
        </div>
    ) : (
        <div
            style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
                flexDirection: "row-reverse", // Reverse the order of flex items (avatar on the right)
            }}
        >
            <Avatar
                className="avatarText m-r-sm"
                size={32}
                style={{
                    backgroundColor: "#1677FF",
                    verticalAlign: "middle",
                    marginLeft: "10px",
                    flexShrink: 0, // Prevent the Avatar from being shrunk
                }}
            >
                {name.charAt(0)}
            </Avatar>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#D6EAFF",
                        padding: "12px 24px",
                        borderRadius: "20px 20px 0 20px",
                    }}
                >
                    {text.message}
                </div>
                <div style={{ marginTop: "8px", fontSize: "10px" }}>
                    {text.month.substring(0, 3) +
                        " " +
                        text.day +
                        ", " +
                        text.year +
                        " " +
                        text.time}
                </div>
            </div>
        </div>
    );
};

export default ChatBoxItem;
