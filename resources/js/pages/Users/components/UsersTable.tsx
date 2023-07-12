import React from "react";
import { Button, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { TUser } from "../../../entities";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

const columns: ColumnsType<TUser> = [
    {
        key: "firstName",
        title: "First Name",
        dataIndex: "firstName",
    },
    {
        key: "lastName",
        title: "Last Name",
        dataIndex: "lastName",
    },
    {
        key: "email",
        title: "Email Address",
        dataIndex: "email",
    },
    {
        title: "Action",
        key: "action",
        render: (key: any, record: any) => {
            return (
                <Link to={`/users/${record.id}`}>
                    <Button type="link">
                        <EditOutlined />
                    </Button>
                </Link>
            );
        },
    },
];

const onChange: TableProps<TUser>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
) => {
    console.log("params", pagination, filters, sorter, extra);
};

const UsersTable = ({ users }: { users: Array<TUser> }) => {
    return <Table columns={columns} dataSource={users} onChange={onChange} />;
};

export default UsersTable;
