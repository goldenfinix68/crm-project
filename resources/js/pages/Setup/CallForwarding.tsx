import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Space, message, Select, Table } from "antd";

import { useMutation, useQueryClient } from "react-query";
import { DragDropContext, DraggableLocation } from "react-beautiful-dnd";
import { useUsersAll } from "../../api/query/userQuery";
import { TUser } from "../../entities";
import { userCallForwardingMutation } from "../../api/mutation/useUserMutation";
import { useAppContextProvider } from "../../context/AppContext";
import DroppableList from "../../components/DroppableList";
import TextEllipsis from "../../components/TextEllipsis";
import { ColumnsType } from "antd/es/table";
import { useArray } from "../../helpers";
import CustomResizeableTable from "../../components/CustomResizeableTable";

interface DragEndResult {
    source: DraggableLocation;
    destination?: DraggableLocation | null;
}

interface ListItem {
    id: string;
    title: string;
}

const CallForwarding: React.FC = ({}) => {
    useEffect(() => {
        document.title = "Call Forwarding - SpeedLead";
        return () => {};
    }, []);
    const queryClient = useQueryClient();
    const { users, isLoading } = useUsersAll();
    const { loggedInUser } = useAppContextProvider();

    const { array: data, updateById, setInitialArray } = useArray<TUser>();

    const [forwardingType, setForwardingType] = useState(
        loggedInUser?.forwardingType ?? "off"
    );

    const callForward = useMutation(userCallForwardingMutation, {
        onSuccess: () => {
            message.success("Succesfully saved.");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const saveCallForwarding = (data) => {
        console.log(data);
        for (const user of data.users) {
            if (user.forwardingType !== "off" && !user.forwardTo) {
                message.error(
                    "Forward to is required if forward type is not set to do not forward."
                );
                return false;
            }
        }

        callForward.mutate(data);
    };

    const columns: ColumnsType<TUser> = [
        {
            key: "Name",
            title: "Name",
            render: (key: any, record: TUser) => {
                return (
                    <TextEllipsis
                        style={{ paddingLeft: "8px" }}
                    >{`${record.firstName} ${record.lastName}`}</TextEllipsis>
                );
            },
        },
        {
            key: "telnyxConnectionName",
            title: "SIP Trunking / Mobile Numbers",
            render: (key: any, record: TUser) => {
                return (
                    <TextEllipsis style={{ paddingLeft: "8px" }}>
                        {record.telnyxConnectionName
                            ? `${record.telnyxConnectionName} (${
                                  record.numbers?.length
                                      ? record.numbers
                                            .map(
                                                (number) => number.mobileNumber
                                            )
                                            .join(", ")
                                      : ""
                              })`
                            : "Not Set"}
                    </TextEllipsis>
                );
            },
        },
        {
            key: "type",
            title: "Forward Type",
            render: (key: any, record: TUser) => {
                return (
                    <Select
                        style={{ width: "80%" }}
                        showSearch
                        options={[
                            {
                                value: "off",
                                label: "Do not forward",
                            },
                            {
                                value: "on-failure",
                                label: "Forward on failure",
                            },
                            {
                                value: "always",
                                label: "Forward always",
                            },
                        ]}
                        value={record.forwardingType}
                        onChange={(e) => {
                            updateById(record.id, {
                                ...record,
                                forwardingType: e,
                                forwardTo: e == "off" ? "" : record.forwardTo,
                            });
                        }}
                    />
                );
            },
        },
        {
            key: "forwardTo",
            title: "Forward To",
            render: (key: any, record: TUser) => {
                return (
                    <Select
                        style={{ width: "80%" }}
                        showSearch
                        options={data
                            ?.filter((user) => user.id != record.id)
                            .map((user) => {
                                return {
                                    label: `${user.firstName} ${user.lastName}`,
                                    value: user.id?.toString(),
                                };
                            })}
                        disabled={record.forwardingType == "off"}
                        value={record.forwardTo}
                        onChange={(e) => {
                            updateById(record.id, {
                                ...record,
                                forwardTo: e,
                            });
                        }}
                    />
                );
            },
        },
    ];

    useEffect(() => {
        setInitialArray(users?.filter((user: TUser) => user.numbers.length));
    }, [users]);

    return (
        <Card
            style={{
                boxShadow: "none",
            }}
            bodyStyle={{ padding: "19px" }}
            bordered={false}
            loading={isLoading}
        >
            <Space direction="vertical" className="w-100" size={"large"}>
                {/* <Table columns={columns} dataSource={data} pagination={false} /> */}

                <CustomResizeableTable
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    localStorageKey="callForwardingTableColumnsWidth"
                />
                <Button
                    type="primary"
                    onClick={() => {
                        saveCallForwarding({
                            users: data,
                        });
                    }}
                    loading={callForward.isLoading}
                    style={{ float: "right" }}
                >
                    Save
                </Button>
            </Space>
        </Card>
    );
};

export default CallForwarding;
