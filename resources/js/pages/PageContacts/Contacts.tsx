import React from "react";
import { UploadOutlined } from "@ant-design/icons";
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
} from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";

interface DataType {
    key: React.Key;
    name: string;
    email: string;
    mobile: string;
    countryLink: string;
    acres: string;
    tags: string[];
    owner: string;
    avatar: any;
}

const columns: ColumnsType<DataType> = [
    {
        title: "Name",
        dataIndex: "name",
        render: (text: string, record: DataType) => (
            <>
                <Avatar src={record.avatar} size={32} />
                <span style={{ marginLeft: "8px" }}>{text}</span>
            </>
        ),
        sorter: (a, b) => a.name.length - b.name.length,
        defaultSortOrder: "descend",
        fixed: "left",
        width: 300,
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
        title: "Country Link",
        dataIndex: "countryLink",
    },
    {
        title: "Acres",
        dataIndex: "acres",
    },
    {
        title: "Tags",
        dataIndex: "tags",
        key: "tags",
        render: (tags: string[]) => (
            <>
                {tags.map((tag) => (
                    <Tag color="blue" key={tag}>
                        {tag}
                    </Tag>
                ))}
            </>
        ),
    },
    {
        title: "Owner",
        dataIndex: "owner",
    },
];

const data: DataType[] = [
    {
        key: "1",
        name: "Al Sedevic Rome Twp Zoning",
        email: "Al@gmail.com",
        mobile: "+14405612345",
        countryLink: "https://google.com",
        acres: "0",
        tags: ["TaxDeedAuction"],
        owner: "Jesse Ashley",
        avatar: "U",
    },
    {
        key: "2",
        name: "Anita Hehr Ashtbla Realtor",
        email: "Anita@gmail.com",
        mobile: "+14405645612",
        countryLink: "https://google.com",
        acres: "0",
        tags: [""],

        owner: "Jesse Ashley",
        avatar: "U",
    },
    {
        key: "3",
        name: "Anthony Iafrate",
        email: "Anthony@gmail.com",
        mobile: "+14412345678",
        countryLink: "https://google.com",
        acres: "33.66",
        tags: ["TaxDeedAuction"],
        owner: "Jesse Ashley",
        avatar: "U",
    },
    {
        key: "4",
        name: "Anton Fuduric",
        email: "Anton@gmail.com",
        mobile: "+14405612378",
        countryLink: "https://google.com",
        acres: "0.15",
        tags: ["DQ"],
        owner: "Jesse Ashley",
        avatar: "U",
    },
];

const { Option } = Select;
const { TabPane } = Tabs;

const handleTabChange = (key) => {
    // Handle tab change event
    console.log("Selected tab:", key);
};
const { Search } = Input;
const onSearch = (value: string) => console.log(value);
const menu = (
    <Card>
        <Search
            placeholder="input search text"
            allowClear
            onSearch={onSearch}
            style={{ width: 200 }}
        />
        <Tabs defaultActiveKey="tab1" onChange={handleTabChange}>
            <TabPane tab="FAVORITES" key="tab1">
                Content of Tab 1
            </TabPane>
            <TabPane tab="ALL VIEWS" key="tab2">
                <Menu
                    style={{
                        backgroundColor: "none",
                        boxShadow: "none",
                    }}
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    defaultOpenKeys={["sub1"]}
                >
                    <Menu.Item key="1">All Contacts</Menu.Item>
                    <Menu.Item key="2">My Contacts</Menu.Item>
                    <Menu.Item key="3">New last week</Menu.Item>
                    <Menu.Item key="4">New this week</Menu.Item>
                    <Menu.Item key="5">Recently modified Contacts</Menu.Item>
                </Menu>
            </TabPane>
        </Tabs>
    </Card>
);

const Activities = () => {
    return (
        <Card>
            <Row style={{ marginBottom: "20px" }}>
                <Col md={12} lg={12}>
                    <Dropdown overlay={menu} trigger={["click"]}>
                        <Button
                            className="ant-dropdown-link"
                            onClick={(e) => e.preventDefault()}
                        >
                            All Contacts
                        </Button>
                    </Dropdown>
                </Col>
                <Col
                    md={12}
                    lg={12}
                    style={{ display: "flex", justifyContent: "flex-end" }}
                >
                    <Button
                        style={{
                            marginRight: "10px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <FunnelPlotOutlined />
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        style={{
                            marginRight: "10px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        Contact
                    </Button>
                    <Button
                        style={{
                            marginRight: "10px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <TableOutlined />
                    </Button>
                    <Select
                        dropdownClassName="dropdown-select"
                        defaultValue="Action"
                        options={[
                            {
                                value: "Transfer",
                                label: "Mass Transfer Contacts",
                            },
                            { value: "Delete", label: "Mass Delete Contacts" },
                            { value: "Update", label: "Mass Update Contacts" },
                            { value: "Merge", label: "Merge Contacts" },

                            {
                                value: "ImportExcel",
                                label: "Import from Excel or CSV file",
                            },
                            {
                                value: "ImportGoogle",
                                label: "Import Google Contacts",
                            },
                            { value: "Export", label: "Export Contacts" },
                            {
                                value: "ViewDeleted",
                                label: "View Recent Deleted Records",
                            },
                        ]}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={24} lg={24}>
                    <Table
                        rowSelection={{
                            type: "checkbox",
                        }}
                        columns={columns}
                        dataSource={data}
                        scroll={{ x: 1300 }}
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default Activities;
