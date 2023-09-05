import { Button, Mentions, Form, Space, List, Avatar } from "antd";
import React, { useContext } from "react";
import { useCallHistory } from "../../../api/query/callQuery";
import LoadingComponent from "../../../components/LoadingComponent";
import "bootstrap-icons/font/bootstrap-icons.css";
import { UserOutlined } from "@ant-design/icons";

const RecentTab = () => {
    const { calls, isLoading } = useCallHistory();

    if (isLoading) {
        return <LoadingComponent />;
    }

    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={calls}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar icon={<UserOutlined />} />}
                            title={`${item.contactName}`}
                            description={
                                <Space direction="vertical" size={0}>
                                    {item.isFromApp ? (
                                        <i
                                            className="bi bi-telephone-outbound"
                                            style={{
                                                color:
                                                    item.duration != "0"
                                                        ? "green"
                                                        : "red",
                                            }}
                                        >
                                            &nbsp;&nbsp;Outbound
                                        </i>
                                    ) : (
                                        <i
                                            className="bi bi-telephone-inbound"
                                            style={{
                                                color:
                                                    item.duration != "0"
                                                        ? "green"
                                                        : "red",
                                            }}
                                        >
                                            &nbsp;&nbsp;Inbound
                                        </i>
                                    )}
                                    <p>{`Duration: ${item.duration} secs Date: ${item.dateTime}`}</p>
                                </Space>
                            }
                        />
                    </List.Item>
                )}
            />
        </>
    );
};

export default RecentTab;
