import React, { Key, useEffect, useState } from "react";
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
    Tag,
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

import { TActivities } from "../ActivityEntities";
import { activitiList } from "../../../api/query/activityQuery";

import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

const onChange: TableProps<TActivities>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
) => {
    console.log("params", pagination, filters, sorter, extra);
};

const rowSelection: TableRowSelection<TActivities> = {
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

const ActivityTable = () => {
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

    const { dataSource, isLoadingUsers } = activitiList();

    // useEffect(() => {
    //     console.log("dataSource", dataSource);
    // }, [dataSource]);

    //
    const [activitiesSelectColumn, setActivitiesSelectColumn] = useState(
        localStorage.activitiesSelectColumn
            ? JSON.parse(localStorage.activitiesSelectColumn)
            : [
                  { title: "Title", id: "1" },
                  { title: "Start Date", id: "2" },
                  { title: "Duration", id: "3" },
                  { title: "Owner", id: "4" },
                  { title: "Name", id: "5" },
                  { title: "Tags", id: "6" },
              ]
    );

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
                        dataSource={dataSource}
                        onChange={onChange}
                        rowKey={(record) => record.id}
                        rowSelection={{ ...rowSelection }}
                        scroll={{ x: "max-content" }}
                    >
                        <Table.Column
                            title=""
                            dataIndex="status"
                            className="col-status"
                            width={50}
                            render={(text: string, record: any) => {
                                return record.status === 1 ? (
                                    <FontAwesomeIcon
                                        icon={faCircleCheck}
                                        className="cursor-pointer"
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faCircleCheck}
                                        className="cursor-pointer"
                                    />
                                );
                            }}
                            fixed
                        />

                        <Table.Column
                            title="Title"
                            dataIndex="title"
                            width={300}
                            fixed
                        />

                        <Table.Column
                            title="Start Date"
                            dataIndex="start_date"
                            width={300}
                            render={(text: string, record: any) => {
                                return (
                                    <>
                                        {moment(
                                            `${record.start_date}${
                                                record.start_time
                                                    ? " " + record.start_time
                                                    : ""
                                            }`
                                        ).format("MMM DD, YYYY hh:mm A")}
                                    </>
                                );
                            }}
                        />
                        <Table.Column
                            title="End Date"
                            dataIndex="end_date"
                            width={300}
                            render={(text: string, record: any) => {
                                return (
                                    <>
                                        {record.end_date ? (
                                            <>
                                                {moment(
                                                    `${record.end_date}${
                                                        record.end_time
                                                            ? " " +
                                                              record.end_time
                                                            : ""
                                                    }`
                                                ).format(
                                                    "MMM DD, YYYY hh:mm A"
                                                )}
                                            </>
                                        ) : (
                                            ""
                                        )}
                                    </>
                                );
                            }}
                        />

                        <Table.Column title="Duration" dataIndex={"duration"} />
                        <Table.Column title="Owner" dataIndex={"owner"} />
                        <Table.Column title="Title" dataIndex={"title2"} />
                        <Table.Column title="Name" dataIndex={"name"} />
                        <Table.Column
                            title="Tags"
                            dataIndex={"tags"}
                            render={(text: string, record: any) => {
                                return (
                                    <>
                                        {record?.activity_tags &&
                                            record?.activity_tags.map(
                                                (item: any, key: React.Key) => {
                                                    return (
                                                        <Tag>{item.tag}</Tag>
                                                    );
                                                }
                                            )}
                                    </>
                                );
                            }}
                        />

                        <Table.Column title="Availability" dataIndex={"name"} />
                        <Table.Column title="Location" dataIndex={"name"} />
                        <Table.Column
                            title="Video Conferencing"
                            dataIndex={"name"}
                        />
                        <Table.Column title="Outcome" dataIndex={"name"} />
                        <Table.Column title="ID" dataIndex={"id"} />
                    </Table>
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
                activitiesSelectColumn={activitiesSelectColumn}
                setActivitiesSelectColumn={setActivitiesSelectColumn}
                localStorageName="activitiesSelectColumn"
            />
        </>
    );
};

export default ActivityTable;
