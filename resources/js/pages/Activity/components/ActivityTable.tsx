import React, { useState } from "react";
import {
    Button,
    Card,
    Col,
    Dropdown,
    Input,
    Modal,
    Radio,
    Row,
    Space,
    Table,
    Tabs,
    Tooltip,
    Typography,
} from "antd";
import { MenuProps, Menu } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { TUser } from "../../../entities";
import type { TableRowSelection } from "antd/es/table/interface";
import {
    AuditOutlined,
    ContainerOutlined,
    DownOutlined,
    FilterOutlined,
    GroupOutlined,
    InsertRowBelowOutlined,
    MobileOutlined,
    PhoneOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Title from "antd/es/skeleton/Title";
import ModalAddActivity from "./ModalAddActivity";
import Search from "antd/es/input/Search";
import ModalManageColumn from "./ModalManageColumn";
interface TActivity {
    key: React.Key;
    title: string;
    start_date: string;
    duration: string;
    owner: string;
    title2: string;
    name: string;
    tags: any;
}

const columns: ColumnsType<TActivity> = [
    {
        title: "Title",
        dataIndex: "title",
        fixed: "left",
        width: 300,
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

const action_type: MenuProps["items"] = [
    {
        key: "1",
        label: <div>Mass Transfer Activites</div>,
    },
    {
        key: "2",
        label: <div>Mass Delete Activites</div>,
    },
    {
        key: "3",
        label: <div>Mass Update Activites</div>,
    },
    {
        key: "4",
        label: <div>Import From Excel or CSV file</div>,
    },
    {
        key: "5",
        label: <div>Export Activites</div>,
    },
    {
        key: "6",
        label: <div>View Recent Deleted Records</div>,
    },
];

const activities_type = (
    <Card>
        <Search
            placeholder="input search text"
            allowClear
            // onSearch={onSearch}
            style={{ width: 200 }}
        />
        <Tabs
            defaultActiveKey="tab1"
            // onChange={handleTabChange}
        >
            <Tabs.TabPane tab="FAVORITES" key="tab1">
                You have no favorties
            </Tabs.TabPane>
            <Tabs.TabPane tab="ALL VIEWS" key="tab2">
                <Menu
                    style={{
                        backgroundColor: "none",
                        boxShadow: "none",
                    }}
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    defaultOpenKeys={["sub1"]}
                >
                    <Menu.Item key="1">Activites I am following</Menu.Item>
                    <Menu.Item key="2">All Closed Activities</Menu.Item>
                    <Menu.Item key="3">All Open Activities</Menu.Item>
                    <Menu.Item key="4">My Open Activities</Menu.Item>
                    <Menu.Item key="5">My Overdue Activites</Menu.Item>
                </Menu>
            </Tabs.TabPane>
        </Tabs>
    </Card>
);

const ActivityTable = ({ activites }: { activites: Array<TActivity> }) => {
    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
    const showModalAdd = () => {
        setIsModalOpenAdd(true);
    };

    const handleOkAdd = () => {
        setIsModalOpenAdd(false);
    };

    const handleCancelAdd = () => {
        setIsModalOpenAdd(false);
    };

    const [isModalManageColumnOpen, setIsModalManageColumnOpen] =
        useState(false);

    return (
        <>
            <Row className="activity-group-row">
                <Col md={24}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 15,
                        }}
                    >
                        <div>
                            <Dropdown
                                overlay={activities_type}
                                placement="bottomLeft"
                            >
                                <Button>
                                    <Space>
                                        My Open Activities
                                        <DownOutlined />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </div>

                        <div>
                            <span style={{ marginRight: 10 }}>
                                <Radio.Group>
                                    <Radio.Button value="Overdue">
                                        List
                                    </Radio.Button>
                                    <Radio.Button value="Today">
                                        Calendar
                                    </Radio.Button>
                                </Radio.Group>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Button type="primary" onClick={showModalAdd}>
                                    <PlusCircleOutlined /> &nbsp;Activity
                                </Button>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Tooltip
                                    title="Manage Columns"
                                    placement="bottom"
                                >
                                    <Button
                                        onClick={() => {
                                            setIsModalManageColumnOpen(true);
                                        }}
                                    >
                                        <InsertRowBelowOutlined />
                                    </Button>
                                </Tooltip>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Dropdown
                                    menu={{ items: action_type }}
                                    placement="bottomLeft"
                                >
                                    <Button>
                                        <Space>
                                            Action
                                            <DownOutlined />
                                        </Space>
                                    </Button>
                                </Dropdown>
                            </span>
                        </div>
                    </div>
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
                            <Radio.Button value="Tomorrow">
                                Tomorrow
                            </Radio.Button>
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
                        scroll={{ x: 1300 }}
                    />
                </Col>
            </Row>
            <ModalAddActivity
                isModalOpenAdd={isModalOpenAdd}
                handleOkAdd={handleOkAdd}
                handleCancelAdd={handleCancelAdd}
            />
            <ModalManageColumn
                isModalManageColumnOpen={isModalManageColumnOpen}
                setIsModalManageColumnOpen={setIsModalManageColumnOpen}
            />
        </>
    );
};

export default ActivityTable;
