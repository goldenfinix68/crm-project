import {
    Card,
    Button,
    Dropdown,
    Space,
    Radio,
    Tooltip,
    MenuProps,
    Tabs,
    Menu,
    Row,
    Col,
} from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    UserAddOutlined,
    PlusCircleOutlined,
    DownOutlined,
    InsertRowBelowOutlined,
    FilterOutlined,
    PhoneOutlined,
    MailOutlined,
    UserOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import ModalAddDeal from "./components/ModalAddDeal";
import Filter from "./components/Filter";
const Deal = () => {
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

    const [openFilter, setOpenFilter] = useState(false);

    const action: MenuProps["items"] = [
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
    const acq: MenuProps["items"] = [
        {
            key: "1",
            label: <div>Marketing</div>,
        },
        {
            key: "2",
            label: <div>ACQ</div>,
        },
    ];
    const title: MenuProps["items"] = [
        {
            key: "1",
            label: <div>Title</div>,
        },
        {
            key: "2",
            label: <div>Win Probability</div>,
        },
        {
            key: "3",
            label: <div>Owner</div>,
        },
        {
            key: "4",
            label: <div>Estimated Close Date</div>,
        },
        {
            key: "5",
            label: <div>Created At</div>,
        },
        {
            key: "6",
            label: <div>Last Modified Date</div>,
        },
        {
            key: "7",
            label: <div> Inactive Days</div>,
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

    return (
        <Row className="deal-group-row">
            <Col md={24}>
                <Card title="Deals">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 15,
                        }}
                    >
                        <div>
                            <span style={{ marginRight: 10 }}>
                                <Dropdown
                                    menu={{ items: acq }}
                                    placement="bottomLeft"
                                >
                                    <Button>
                                        <Space>
                                            ACQ
                                            <DownOutlined />
                                        </Space>
                                    </Button>
                                </Dropdown>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Dropdown
                                    overlay={activities_type}
                                    placement="bottomLeft"
                                >
                                    <Button>
                                        <Space>
                                            My Open Deals
                                            <DownOutlined />
                                        </Space>
                                    </Button>
                                </Dropdown>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Dropdown
                                    menu={{ items: title }}
                                    placement="bottomLeft"
                                >
                                    <Button>
                                        <Space>
                                            Title
                                            <DownOutlined />
                                        </Space>
                                    </Button>
                                </Dropdown>
                            </span>
                        </div>

                        <div>
                            <span style={{ marginRight: 10 }}>
                                <Button
                                    icon={<FilterOutlined />}
                                    onClick={() => {
                                        setOpenFilter(true);
                                    }}
                                ></Button>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Radio.Group>
                                    <Radio.Button value="Overdue">
                                        List
                                    </Radio.Button>
                                    <Radio.Button value="Today">
                                        Board
                                    </Radio.Button>
                                </Radio.Group>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Button type="primary" onClick={showModalAdd}>
                                    <PlusCircleOutlined /> &nbsp;Deal
                                </Button>
                            </span>

                            <span style={{ marginRight: 10 }}>
                                <Dropdown
                                    menu={{ items: action }}
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
                        <div></div>
                        <div>
                            <span style={{ marginRight: 15 }}>
                                {" "}
                                # of Deals: <b>$0</b>
                            </span>
                            <span style={{ marginRight: 15 }}>
                                {" "}
                                Pipeline Value: <b>$0</b>
                            </span>
                            <span>
                                {" "}
                                Forecase Value: <b>$0</b>
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="mainDealArrow">
                            <div className="bx-pager bx-default-pager">
                                <div className="bx-pager-item active">
                                    <a
                                        className="bx-pager-link "
                                        data-slide-index="0"
                                        href=""
                                    >
                                        {" "}
                                        <div>
                                            <b>Comp & Qualify</b>
                                        </div>
                                        <div> $0</div>
                                    </a>

                                    <div className="arrow"></div>
                                </div>

                                <div className="bx-pager-item">
                                    <a
                                        className="bx-pager-link"
                                        data-slide-index="1"
                                        href=""
                                    >
                                        {" "}
                                        <div>
                                            <b>First Offer Given</b>
                                        </div>
                                        <div> $0</div>
                                    </a>

                                    <div className="arrow"></div>
                                </div>

                                <div className="bx-pager-item">
                                    <a
                                        className="bx-pager-link"
                                        data-slide-index="2"
                                        href=""
                                    >
                                        {" "}
                                        <div>
                                            {" "}
                                            <b>In Negotiation</b>
                                        </div>
                                        <div> $0</div>
                                    </a>
                                    <div className="arrow"></div>
                                </div>

                                <div className="bx-pager-item">
                                    <a
                                        className="bx-pager-link"
                                        data-slide-index="3"
                                        href=""
                                    >
                                        {" "}
                                        <div>
                                            {" "}
                                            <b>Verbal Offer Accepted</b>
                                        </div>
                                        <div> $0</div>
                                    </a>
                                    <div className="arrow"></div>
                                </div>
                                <div className="bx-pager-item">
                                    <a
                                        className="bx-pager-link"
                                        data-slide-index="3"
                                        href=""
                                    >
                                        <div>
                                            <b>Under Contract</b>{" "}
                                        </div>
                                        <div> $111,000</div>
                                    </a>
                                    <div className="arrow"></div>
                                </div>
                            </div>

                            <Card style={{ width: 338 }}>
                                <div>Ron Tanburinno - ASHTABULA</div>
                                <div style={{ fontSize: 12, color: "#9b9999" }}>
                                    Ron Tanburinno - $0{" "}
                                </div>
                                <div style={{ fontSize: 10, color: "#9b9999" }}>
                                    None
                                </div>

                                <div style={{ marginTop: 10, float: "right" }}>
                                    <span
                                        style={{
                                            marginLeft: 5,
                                            padding: 4,
                                            border: " 1px solid #e5e5e5",
                                            borderRadius: "53%",
                                        }}
                                    >
                                        <PhoneOutlined />
                                    </span>
                                    <span
                                        style={{
                                            marginLeft: 5,
                                            padding: 4,
                                            border: " 1px solid #e5e5e5",
                                            borderRadius: "53%",
                                        }}
                                    >
                                        <MailOutlined />
                                    </span>
                                    <span
                                        style={{
                                            marginLeft: 5,
                                            padding: 4,
                                            border: " 1px solid #e5e5e5",
                                            borderRadius: "53%",
                                        }}
                                    >
                                        <UserOutlined />
                                    </span>
                                </div>
                            </Card>
                        </div>
                    </div>
                    <Filter
                        openFilter={openFilter}
                        setOpenFilter={setOpenFilter}
                    />
                    <ModalAddDeal
                        isModalOpenAdd={isModalOpenAdd}
                        handleOkAdd={handleOkAdd}
                        handleCancelAdd={handleCancelAdd}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default Deal;
