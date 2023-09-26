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
        <Space
            direction="vertical"
            style={{
                width: "100%",
                borderTop: "1px solid gray",
                padding: "10px",
            }}
        >
            <Space
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Space>
                    {label ? (
                        <Tag style={{ float: "right" }}>{label}</Tag>
                    ) : null}
                    <Typography.Text strong style={{ fontSize: "11px" }}>
                        {name}
                    </Typography.Text>
                </Space>
                <Typography.Text style={{ fontSize: "10px" }}>
                    {text.day + " " + text.month}
                </Typography.Text>
            </Space>
            <div
                style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "11px",
                    color: text.status == "failed" ? "red" : "black",
                }}
            >
                {text.message}
            </div>
        </Space>
    );
};

export default TextItem;
