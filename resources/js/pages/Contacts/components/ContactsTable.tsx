import React from "react";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { TUser } from "../../../entities";
import type { TableRowSelection } from "antd/es/table/interface";
interface TContacts {
    key: React.ReactNode;
    name: string;
    email: string;
    address: string;
    mobile: number;
    countylink: string;
    acres: string;
    tags: string;
    owner: string;
}

const columns: ColumnsType<TContacts> = [
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Email",
        dataIndex: "email",
    },
    {
        title: "Mobile",
        dataIndex: "mobile",
    },
    {
        title: "County Link",
        dataIndex: "countylink",
    },
    {
        title: "Acres",
        dataIndex: "",
    },
    {
        title: "Tags",
        dataIndex: "",
    },
    {
        title: "Owner",
        dataIndex: "owner",
    },
];

const onChange: TableProps<TContacts>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
) => {
    console.log("params", pagination, filters, sorter, extra);
};

const rowSelection: TableRowSelection<TContacts> = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
        );
    },
    onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
    },
};

const ContactsTable = ({ contacts }: { contacts: Array<TContacts> }) => {
    return (
        <Table
            columns={columns}
            dataSource={contacts}
            onChange={onChange}
            rowSelection={{ ...rowSelection }}
        />
    );
};

export default ContactsTable;
