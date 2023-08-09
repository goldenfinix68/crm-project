import React from "react";
import { Avatar, Button, Card, Empty, Space, Typography } from "antd";
import { TText } from "../../../entities";
import { useTexts } from "../../../api/query/textQuery";
import { getTimeAgo } from "../../../helpers";

const SentBox = ({ menu }) => {
    const { texts, isLoading } = useTexts();
    const filteredTexts = texts?.filter((text) => text?.type == menu);
    return (
        <Space direction="vertical" style={{ margin: "12px", width: "95%" }}>
            {filteredTexts?.length ? (
                filteredTexts.map((text, index) => {
                    const monthYear = text?.month + " " + text?.year;

                    // Check if it's the first item or the monthYear has changed
                    if (index != 0) {
                        const prevData = filteredTexts[index - 1];
                        const prevMonthYear =
                            prevData?.month + " " + prevData?.year;

                        // Use a ternary operator directly in the JSX to conditionally render the header
                        return (
                            <div key={index}>
                                {monthYear !== prevMonthYear && (
                                    <Typography.Text>
                                        {monthYear}
                                    </Typography.Text>
                                )}
                                <SentBoxItem text={text!} />
                            </div>
                        );
                    } else {
                        // For the first item, render the header unconditionally
                        return (
                            <div key={index}>
                                <Typography.Text>{monthYear}</Typography.Text>
                                <SentBoxItem text={text!} />
                            </div>
                        );
                    }
                })
            ) : (
                <Card>
                    <Typography.Text>
                        <center>No texts found.</center>
                    </Typography.Text>
                </Card>
            )}
        </Space>
    );
};

const SentBoxItem = ({ text }: { text: TText }) => {
    return (
        <Card>
            <Avatar
                className="avatarText m-r-sm"
                size={32}
                style={{
                    backgroundColor: "#1677FF",
                    verticalAlign: "middle",
                }}
            >
                {text.receiver.charAt(0)}
            </Avatar>
            <Space direction="vertical" size={0} style={{ width: "95%" }}>
                <div>
                    <Typography.Text strong>{text.receiver}</Typography.Text>
                    <div style={{ float: "right" }}>
                        {getTimeAgo(text.created_at)}
                    </div>
                </div>
                <Typography.Text style={{ fontSize: "10px" }}>
                    by {text.sender}
                </Typography.Text>
                <Typography.Text>{text.message}</Typography.Text>
            </Space>
        </Card>
    );
};

export default SentBox;
