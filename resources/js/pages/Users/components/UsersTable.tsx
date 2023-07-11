import React from "react";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { TUser } from "../../../entities";

const columns: ColumnsType<TUser> = [
    {
        title: "First Name",
        dataIndex: "firstName",
    },
    {
        title: "Last Name",
        dataIndex: "lastName",
    },
    {
        title: "Email Address",
        dataIndex: "email",
    },
    {
        title: "Action",
        dataIndex: "",
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
