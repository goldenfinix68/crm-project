import React from "react";
import { Avatar, Button, Empty, Space, Tag, Typography } from "antd";
import { TText } from "../../../entities";

const TextItem = ({
    name,
    text,
    label,
}: {
    name: string;
    text: TText;
    label?: string;
}) => {
    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <div
                style={{
                    borderTop: "1px solid gray",
                    padding: "10px",
                    width: "100%",
                    display: "flex", // Add this line to create a flex container
                    alignItems: "center", // Center items vertically within the flex container
                }}
                key={text.id}
            >
                <Avatar
                    className="avatarText m-r-sm"
                    size={32}
                    style={{
                        backgroundColor: "#1677FF",
                        verticalAlign: "middle",
                    }}
                >
                    {name.charAt(0)}
                </Avatar>
                <div style={{ flex: "1" }}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <Typography.Text
                                strong
                                style={{ fontSize: "11px" }}
                            >
                                {name}
                            </Typography.Text>
                            <Typography.Text style={{ fontSize: "10px" }}>
                                {text.day + " " + text.month}
                            </Typography.Text>
                        </div>
                        <div
                            style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontSize: "11px",
                                width: "50%",
                                color:
                                    text.status == "failed" ? "red" : "black",
                            }}
                        >
                            {text.message}
                        </div>
                    </Space>
                </div>
            </div>

            {label ? <Tag style={{ float: "right" }}>{label}</Tag> : null}
        </Space>
    );
};

export default TextItem;
