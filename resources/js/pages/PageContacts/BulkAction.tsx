import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Badge,
    Button,
    Card,
    Dropdown,
    Menu,
    Modal,
    Space,
    Table,
    TableColumnsType,
    Typography,
} from "antd";

import {
    CloseOutlined,
    DownOutlined,
    PullRequestOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import HeaderMenu from "./Components/HeaderMenu";
import { data } from "jquery";
import { useWorkflowsQuery } from "../../api/query/workflowQuery";
import { TWorkflow, TWorkflowItem } from "../../entities";
import moment from "moment";
import TextEllipsis from "../../components/TextEllipsis";

interface ExpandedDataType {
    key: React.Key;
    date: string;
    name: string;
    upgradeNum: string;
}
const items = [
    { key: "1", label: "Action 1" },
    { key: "2", label: "Action 2" },
];

const BulkAction = () => {
    const navigate = useNavigate();
    const { workflows, isLoading } = useWorkflowsQuery();
    const expandedRowRender = (record: TWorkflow) => {
        console.log(record);
        const columns: TableColumnsType<TWorkflowItem> = [
            {
                title: "Trigger At",
                key: "trigger_at",

                render: (_, record) => {
                    const utcDate = moment.utc(
                        record.trigger_at,
                        "YYYY-MM-DD HH:mm:ss"
                    );
                    const localDate = utcDate.clone().local(); // Convert to local timezone

                    return (
                        <div className="p-xs">
                            <TextEllipsis>
                                {localDate.format("MMM DD, YYYY hh:mm A")}
                            </TextEllipsis>
                        </div>
                    );
                },
            },
            {
                title: "Status",
                key: "queue_lock",
                render: (data) => {
                    if (data.success + data.failed == data.total) {
                        return <Badge status="success" text="Completed" />;
                    } else if (data.success || data.failed) {
                        return <Badge status="processing" text="In Progress" />;
                    } else if (!data.queue_lock) {
                        return <Badge status="default" text="Pending" />;
                    } else if (data.queue_lock) {
                        return <Badge status="processing" text="Queued" />;
                    }
                },
            },
            {
                title: "Success",
                key: "success",
                render: (data) => (
                    <TextEllipsis style={{ color: "green" }}>
                        {data.success}
                    </TextEllipsis>
                ),
            },
            {
                title: "Failed",
                key: "failed",
                render: (data) => (
                    <TextEllipsis style={{ color: "red" }}>
                        {data.failed}
                    </TextEllipsis>
                ),
            },
            {
                title: "Total",
                key: "contactIds",
                render: (data) => {
                    const parsedData = JSON.parse(data.contactIds);
                    return <TextEllipsis>{parsedData.length}</TextEllipsis>;
                },
            },
        ];

        return (
            <Table
                columns={columns}
                dataSource={record.items}
                pagination={false}
            />
        );
    };

    const isWorkflowCompleted = (workflow) => {
        const items = workflow.items;
        const successSum = items.reduce(
            (accumulator, item) => accumulator + item.success,
            0
        );

        const failedSum = items.reduce(
            (accumulator, item) => accumulator + item.failed,
            0
        );
        if (successSum + failedSum == workflow.total) {
            return "completed";
        } else if (successSum || failedSum) {
            return "inProgress";
        } else {
            return "pending";
        }
    };

    const columns: TableColumnsType<TWorkflow> = [
        { title: "Name", dataIndex: "action", key: "action" },
        {
            title: "Bulk Operation (Type)",
            key: "operation",
            render: () => (
                <div className="p-xs">
                    <TextEllipsis>Bulk Workflow</TextEllipsis>
                </div>
            ),
        },
        {
            title: "Status",
            key: "status",
            render: (data) => {
                if (isWorkflowCompleted(data) == "completed") {
                    return <Badge status="success" text="Completed" />;
                } else if (isWorkflowCompleted(data) == "inProgress") {
                    return <Badge status="processing" text="In Progress" />;
                } else {
                    return <Badge status="default" text="Pending" />;
                }
            },
        },
        {
            title: "Created",
            key: "created_at",
            render: (text) => (
                <TextEllipsis>
                    {moment(text).format("MMM D, YYYY")}
                </TextEllipsis>
            ),
        },
        {
            title: "User",
            key: "user",
            render: (_, workflow) => (
                <TextEllipsis>{`${workflow.user?.firstName} ${workflow.user?.lastName}`}</TextEllipsis>
            ),
        },
        {
            title: "Completed (Date and Time)",
            key: "completedAt",
            render: (data) => {
                const parsedDate = moment(
                    data.completedAt,
                    "YYYY-MM-DD HH:mm:ss"
                );
                return isWorkflowCompleted(data) == "completed" ? (
                    <TextEllipsis>
                        {parsedDate.format("MMM DD, YYYY hh:mm A")}
                    </TextEllipsis>
                ) : null;
            },
        },
    ];

    return (
        <Space direction="vertical" className="w-100">
            <HeaderMenu />
            <Card>
                <Table
                    columns={columns}
                    expandable={{
                        expandedRowRender,
                    }}
                    dataSource={workflows?.map((workflow, index) => {
                        return { ...workflow, ...{ key: index } };
                    })}
                />
            </Card>
        </Space>
    );
};

export default BulkAction;
