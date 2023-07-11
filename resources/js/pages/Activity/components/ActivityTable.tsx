import React from "react";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { TUser } from "../../../entities";
import type { TableRowSelection } from "antd/es/table/interface";
interface TActivity {
    key: React.ReactNode;
    start_date: string;
    duration: string;
    address: string;
    title2: string;
    name: string;
    tags: string;
}

const columns: ColumnsType<TActivity> = [
    {
        title: "Title",
        dataIndex: "title",
    },
    {
        title: "Start Date",
        dataIndex: "start_date",
    },
    {
        title: "Duration",
        dataIndex: "duration",
    },
    {
        title: "Owner",
        dataIndex: "owner",
    },
    {
        title: "Title",
        dataIndex: "title2",
    },
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Tags",
        dataIndex: "tags",
    },
];

const onChange: TableProps<TActivity>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
) => {
    console.log("params", pagination, filters, sorter, extra);
};

const rowSelection: TableRowSelection<TActivity> = {
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

const ActivityTable = ({ activites }: { activites: Array<TActivity> }) => {
    return (
        <Table
            columns={columns}
            dataSource={activites}
            onChange={onChange}
            rowSelection={{ ...rowSelection }}
        />
    );
};

export default ActivityTable;
