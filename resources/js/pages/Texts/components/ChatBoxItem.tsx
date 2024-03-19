import React from "react";
import { Avatar, Button, Space, Tooltip, Typography } from "antd";
import { TText } from "../../../entities";
import { CalendarOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { useMutation } from "react-query";
import { mutatePost } from "../../../api/mutation/useSetupMutation";
import queryClient from "../../../queryClient";

const ChatBoxItem = ({ name, text }: { name: string; text: TText }) => {
    const resendText = useMutation(mutatePost, {
        onSuccess: (res) => {
            queryClient.invalidateQueries("thread");
        },
    });

    return !text.isFromApp ? (
        <div
            style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
            }}
        >
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
                    {`${text.from.replace(
                        /^(\d{3})(\d{3})(\d{4})$/,
                        "($1) $2-$3"
                    )} ${moment
                        .utc(text.created_at)
                        .local()
                        .format("MMM DD, YYYY hh:mm A")}`}
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
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                }}
            >
                <div
                    style={{
                        display: "flex", // Use flexbox
                        alignItems: "center", // Align items vertically in the center
                        backgroundColor: "#D6EAFF",
                        padding: "12px 24px",
                        borderRadius: "20px 20px 0 20px",
                    }}
                >
                    {text.status == "failed" ? (
                        <Tooltip title={text?.errorMessage}>
                            <ExclamationCircleOutlined
                                style={{ color: "red" }}
                            />
                        </Tooltip>
                    ) : null}
                    {text.status == "scheduled" && text.schedule ? (
                        <Tooltip
                            title={`Will be sent on ${moment
                                .utc(text.schedule)
                                .local()
                                .format("MMM DD, YYYY hh:mm A")}`}
                        >
                            <CalendarOutlined />
                        </Tooltip>
                    ) : null}
                    <div className="p-l-xs">{text.message}</div>
                </div>
                <Space style={{ marginTop: "8px", fontSize: "10px" }} size={1}>
                    {`${moment
                        .utc(text.created_at)
                        .local()
                        .format("MMM DD, YYYY hh:mm A")} ${text.to.replace(
                        /^(\d{3})(\d{3})(\d{4})$/,
                        "($1) $2-$3"
                    )}`}
                    {text.status == "failed" && (
                        <Button
                            className="p-0"
                            type="text"
                            style={{
                                color: "red",
                                cursor: "pointer",
                                fontSize: "10px",
                            }}
                            onClick={() => {
                                resendText.mutate({
                                    data: { id: text.id },
                                    url: "/api/texts/resend",
                                });
                            }}
                            loading={resendText.isLoading}
                        >
                            Re-try
                        </Button>
                    )}
                    {text.status == "queued" && <div>(Sending)</div>}
                </Space>
            </div>
        </div>
    );
};

export default ChatBoxItem;
