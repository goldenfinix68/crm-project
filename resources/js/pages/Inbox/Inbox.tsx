import React, { useState } from "react";
import { ClockCircleOutlined, UploadOutlined } from "@ant-design/icons";
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

const Inbox = () => {
    const [isModalOpen, setisModalOpen] = useState(false);
    const [isModalManageColumnOpen, setIsModalManageColumnOpen] =
        useState(false);
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState("mail");

    const onClick: MenuProps["onClick"] = (e) => {
        console.log("click ", e);
        setCurrent(e.key);
    };

    // const items: MenuProps["items"] = [
    //     {
    //         label: "BCC/Forwarded",
    //         key: "BCC/Forwarded",
    //         icon: <MailOutlined />,
    //     },
    //     {
    //         label: "Scheduled",
    //         key: "Scheduleed",
    //         icon: <ClockCircleOutlined />,
    //     },
    //     {
    //         label: "Outbox",
    //         key: "Outbox",
    //         icon: <InboxOutlined />,
    //     },
    //     {
    //         label: "Sent",
    //         key: "Sent",
    //         icon: <SendOutlined />,
    //     },
    //     {
    //         label: "Archive",
    //         key: "Archive",
    //         icon: <FileZipOutlined />,
    //     },
    //     {
    //         label: "Trash",
    //         key: "Trash",
    //         icon: <DeleteOutlined />,
    //     },
    // ];
    return (
        <Card>
            <Row>
                <Col md={10} xs={10} style={{ height: "80vh" }}>
                    <Button>wew</Button>
                    <Tabs
                        className="custom-tabs"
                        tabPosition="left"
                        tabBarStyle={{
                            borderBottom: "none",
                            borderRight: "1px solid #e8e8e8",
                        }}
                        size="large"
                    >
                        <TabPane
                            tab={
                                <>
                                    <MailOutlined /> BCC/Forwarded
                                </>
                            }
                            key="1"
                        ></TabPane>
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
                                    <SendOutlined /> Sent
                                </>
                            }
                            key="4"
                        >
                            Content of Tab 3
                        </TabPane>
                        <TabPane
                            tab={
                                <>
                                    <FileZipOutlined /> Archive
                                </>
                            }
                            key="5"
                        >
                            Content of Tab 3
                        </TabPane>
                        <TabPane
                            tab={
                                <>
                                    <DeleteOutlined /> Trash
                                </>
                            }
                            key="6"
                        >
                            Content of Tab 3
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </Card>
    );
};

export default Inbox;
