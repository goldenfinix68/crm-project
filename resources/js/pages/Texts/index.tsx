import React, { useState } from "react";
import {
    ClockCircleOutlined,
    FileExcelOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import {
    Button,
    Popconfirm,
    Space,
    Upload,
    Row,
    Card,
    Divider,
    Radio,
    Table,
    Checkbox,
    Col,
    Select,
    Tag,
    Avatar,
    Tabs,
    Typography,
    Menu,
    Dropdown,
    Input,
    Layout,
} from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    CheckCircleOutlined,
    FunnelPlotOutlined,
    PhoneOutlined,
    FileDoneOutlined,
    TeamOutlined,
    PlaySquareOutlined,
    TableOutlined,
    PlusCircleOutlined,
    DownOutlined,
    LockOutlined,
    CaretDownOutlined,
    MailOutlined,
    AppstoreOutlined,
    SettingOutlined,
    DeleteOutlined,
    SendOutlined,
    InboxOutlined,
    FileZipOutlined,
    SearchOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { MenuProps } from "antd";
import {
    faFilter,
    faHome,
    faFont,
    faSquare,
    fa1,
    faCircleDot,
    faCalendarDay,
    faCalendarTimes,
    faEnvelope,
    faPhone,
    faCircleArrowDown,
    faSquareCheck,
    faUser,
    faCircleUser,
    faLink,
    faPercentage,
    faDollarSign,
    faCalculator,
    faClock,
    faInbox,
    faPaperPlane,
    faBoxArchive,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const { Option } = Select;
const { TabPane } = Tabs;

const handleTabChange = (key) => {
    // Handle tab change event
    console.log("Selected tab:", key);
};
const { Search } = Input;
const onSearch = (value: string) => console.log(value);

const Texts = () => {
    return (
        <Card className="CustomCard">
            <Row>
                <Col
                    md={8}
                    xs={8}
                    style={{ height: "92.8vh", paddingTop: "25px" }}
                >
                    <Tabs
                        defaultActiveKey="1"
                        className="custom-tabs tabpadding"
                        tabPosition="left"
                        tabBarStyle={{
                            borderBottom: "none",
                            borderRight: "1px solid #e8e8e8",
                            width: "30%",
                        }}
                        size="small"
                    >
                        <TabPane
                            tab={
                                <>
                                    <MailOutlined /> All
                                </>
                            }
                            key="1"
                        >
                            <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                                size={0}
                            >
                                <Input
                                    suffix={<SearchOutlined />}
                                    placeholder="Search"
                                    style={{ marginBottom: "20px" }}
                                />
                                <Space
                                    style={{
                                        width: "100%",
                                        borderTop: "1px solid gray",
                                        padding: "10px",
                                    }}
                                >
                                    <Avatar
                                        className="avatarText m-r-sm"
                                        // src={record.avatar}
                                        size={32}
                                        style={{
                                            backgroundColor: "#1677FF",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        A
                                    </Avatar>
                                    <Space
                                        direction="vertical"
                                        style={{ width: "100%" }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                width: "100%",
                                            }}
                                        >
                                            <Typography.Text strong>
                                                Ted Rongers
                                            </Typography.Text>
                                            <Typography.Text
                                                style={{ fontSize: "11px" }}
                                            >
                                                7 hours ago
                                            </Typography.Text>
                                        </div>
                                        <div
                                            style={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                fontSize: "11px",
                                                width: "50%",
                                            }}
                                        >
                                            Not out here but I'm ok with that!
                                            The bank appraisal for my house was
                                            $375k. Auditors site it's under
                                            $300k
                                        </div>
                                    </Space>
                                </Space>
                                <Space
                                    style={{
                                        width: "100%",
                                        borderTop: "1px solid gray",
                                        padding: "10px",
                                    }}
                                >
                                    <Avatar
                                        className="avatarText m-r-sm"
                                        // src={record.avatar}
                                        size={32}
                                        style={{
                                            backgroundColor: "#1677FF",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        A
                                    </Avatar>
                                    <Space
                                        direction="vertical"
                                        style={{ width: "100%" }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                width: "100%",
                                            }}
                                        >
                                            <Typography.Text strong>
                                                Ted Rongers
                                            </Typography.Text>
                                            <Typography.Text
                                                style={{ fontSize: "11px" }}
                                            >
                                                7 hours ago
                                            </Typography.Text>
                                        </div>
                                        <div
                                            style={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                fontSize: "11px",
                                                width: "50%",
                                            }}
                                        >
                                            Not out here but I'm ok with that!
                                            The bank appraisal for my house was
                                            $375k. Auditors site it's under
                                            $300k
                                        </div>
                                    </Space>
                                </Space>
                            </Space>
                        </TabPane>
                        <TabPane
                            tab={
                                <>
                                    <InboxOutlined /> Inbox
                                </>
                            }
                            key="3"
                        >
                            Content of Tab 3
                        </TabPane>
                        <TabPane
                            tab={
                                <>
                                    <ClockCircleOutlined /> Scheduled
                                </>
                            }
                            key="2"
                        >
                            Content of Tab 2
                        </TabPane>
                        <TabPane
                            tab={
                                <>
                                    <SendOutlined /> Sent
                                </>
                            }
                            key="4"
                        >
                            <Input
                                suffix={<SearchOutlined />}
                                placeholder="Search"
                            />
                            <Tabs
                                defaultActiveKey="1"
                                size="small"
                                className="custom-tabs2"
                            >
                                <TabPane
                                    className="tabContent"
                                    tab={<strong>ALL</strong>}
                                    key="1"
                                    style={{
                                        marginTop: "260px",
                                        color: "gray",
                                    }}
                                >
                                    No emails found.
                                </TabPane>
                                <TabPane
                                    className="tabContent"
                                    tab={<strong>UNREAD</strong>}
                                    key="2"
                                    style={{
                                        marginTop: "260px",
                                        color: "gray",
                                    }}
                                >
                                    No emails found.
                                </TabPane>
                            </Tabs>
                        </TabPane>

                        <TabPane
                            tab={
                                <>
                                    <InboxOutlined /> Outbox
                                </>
                            }
                            key="3"
                        >
                            Content of Tab 3
                        </TabPane>
                        <TabPane
                            tab={
                                <>
                                    <FileExcelOutlined /> Failed
                                </>
                            }
                            key="5"
                        >
                            Content of Tab 5
                        </TabPane>
                        <TabPane
                            tab={
                                <>
                                    <DeleteOutlined /> Trash
                                </>
                            }
                            key="6"
                        >
                            Content of Tab 6
                        </TabPane>
                    </Tabs>
                </Col>
                <Col
                    md={14}
                    xs={12}
                    style={{ backgroundColor: "#F5F5F5" }}
                ></Col>
            </Row>
        </Card>
    );
};

export default Texts;
