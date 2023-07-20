import React from "react";
import { Button, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";

import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

interface TDeals {
    title: string;
    name: string;
    value: string;
    stage: string;
    status: string;
    owner: string;
}

const columns: ColumnsType<TDeals> = [
    {
        key: "title",
        title: "Title",
        dataIndex: "title",
        fixed: "left",
        width: 300,
    },
    {
        key: "name",
        title: "Name",
        dataIndex: "Name",
    },
    {
        key: "value",
        title: "Value",
        dataIndex: "value",
    },
    {
        key: "stage",
        title: "Stage",
        dataIndex: "stage",
    },
    {
        key: "status",
        title: "Status",
        dataIndex: "status",
    },
    {
        key: "owner",
        title: "Owner",
        dataIndex: "owner",
    },
];

const onChange: TableProps<TDeals>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
) => {
    console.log("params", pagination, filters, sorter, extra);
};

const DealsTable = ({ deals }: { deals: Array<TDeals> }) => {
    return (
        <Table
            columns={columns}
            dataSource={deals}
            onChange={onChange}
            scroll={{ x: 1300 }}
        />
    );
};

export default DealsTable;
