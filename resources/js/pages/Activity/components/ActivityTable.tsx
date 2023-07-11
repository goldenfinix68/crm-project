import React from "react";
import { Col, Radio, Row, Table, Tooltip } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { TUser } from "../../../entities";
import type { TableRowSelection } from "antd/es/table/interface";
import {
    AuditOutlined,
    ContainerOutlined,
    GroupOutlined,
    MobileOutlined,
    PhoneOutlined,
} from "@ant-design/icons";
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
        <>
            <Row>
                <Col md={24}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 15,
                        }}
                    >
                        <Radio.Group>
                            <Tooltip title="All" placement="bottom">
                                <Radio.Button value="all">All</Radio.Button>
                            </Tooltip>
                            <Tooltip title="Call" placement="bottom">
                                <Radio.Button value="default">
                                    <PhoneOutlined />
                                </Radio.Button>
                            </Tooltip>
                            <Tooltip title="Task" placement="bottom">
                                <Radio.Button value="task">
                                    <AuditOutlined />
                                </Radio.Button>
                            </Tooltip>
                            <Tooltip title="Meeting" placement="bottom">
                                <Radio.Button value="meeting">
                                    <GroupOutlined />
                                </Radio.Button>
                            </Tooltip>
                            <Tooltip title="Demo" placement="bottom">
                                <Radio.Button value="demo">
                                    <AuditOutlined />
                                </Radio.Button>
                            </Tooltip>
                        </Radio.Group>
                        <Radio.Group>
                            <Radio.Button value="Overdue">Overdue</Radio.Button>
                            <Radio.Button value="Today">Today</Radio.Button>
                            <Radio.Button value="Today">Tomorrow</Radio.Button>
                            <Radio.Button value="This Week">
                                This Week
                            </Radio.Button>
                            <Radio.Button value="Custom">Custom</Radio.Button>
                        </Radio.Group>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={activites}
                        onChange={onChange}
                        rowSelection={{ ...rowSelection }}
                    />
                </Col>
            </Row>
        </>
    );
};

export default ActivityTable;
