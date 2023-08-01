import React, { useEffect, useState } from "react";
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
    LockOutlined,
    CaretDownOutlined,
    EditOutlined,
    CloseOutlined,
    SaveOutlined,
    ExportOutlined,
    CopyOutlined,
    MailOutlined,
    MobileOutlined,
    UnorderedListOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TableProps, ColumnGroupType } from "antd/es/table";
import ContactsComponentsAddContacts from "./Components/ContactsComponentsAddContacts";
import ContactsComponentsFilter from "./Components/ContactsComponentsFilter";
import ContactsComponentsManageColumn from "./Components/ContactsComponentsManageColumn";
import { useContactsAll } from "../../api/query/contactsQuery";
import { useMutation, useQuery } from "react-query";
import { TContact } from "../../entities";
import { deleteContactMutation } from "../../api/mutation/useContactMutation";
import queryClient from "../../queryClient";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import ContactsComponentsTableEditableCell from "./Components/ContactsComponentsTableEditableCell";
import ContactsComponentsTableEditableCellTags from "./Components/ContactsComponentsTableEditableCellTags";
import ContactsComponentsTableEditableCellName from "./Components/ContactsComponentsTableEditableCellName";

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

// const data: DataType[] = [
//     {
//         key: "1",
//         name: "Al Sedevic Rome Twp Zoning",
//         email: "Al@gmail.com",
//         mobile: "+14405612345",
//         countryLink: "https://google.com",
//         acres: "0",
//         tags: ["TaxDeedAuction"],
//         owner: "Jesse Ashley",
//         avatar: "U",
//     },
//     {
//         key: "2",
//         name: "Ben Hehr Ashtbla Realtor",
//         email: "Ben@gmail.com",
//         mobile: "+14405645612",
//         countryLink: "https://google.com",
//         acres: "0",
//         tags: [""],

//         owner: "Jesse Ashley",
//         avatar: "U",
//     },
//     {
//         key: "3",
//         name: "Clyd Iafrate",
//         email: "Clyd@gmail.com",
//         mobile: "+14412345678",
//         countryLink: "https://google.com",
//         acres: "33.66",
//         tags: ["TaxDeedAuction"],
//         owner: "Jesse Ashley",
//         avatar: "U",
//     },
//     {
//         key: "4",
//         name: "David Fuduric",
//         email: "David@gmail.com",
//         mobile: "+14405612378",
//         countryLink: "https://google.com",
//         acres: "0.15",
//         tags: ["DQ"],
//         owner: "Jesse Ashley",
//         avatar: "U",
//     },
// ];

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
        <Search placeholder="Search views" allowClear onSearch={onSearch} />
        <Tabs defaultActiveKey="tab1" onChange={handleTabChange}>
            <TabPane tab="FAVORITES" key="tab1">
                <Typography.Title
                    className="m-t-md"
                    level={5}
                    style={{ display: "flex", justifyContent: "center" }}
                >
                    You have no favorites
                </Typography.Title>
                <Typography
                    style={{ display: "flex", justifyContent: "center" }}
                >
                    Select views as favorites to make it appear here.
                </Typography>
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
                    <Typography className="m-b-sm">SYSTEM</Typography>
                    <Menu.Item key="1" icon={<LockOutlined />}>
                        All Contacts
                    </Menu.Item>
                    <Menu.Item key="2" icon={<LockOutlined />}>
                        My Contacts
                    </Menu.Item>
                    <Menu.Item key="3" icon={<LockOutlined />}>
                        New last week
                    </Menu.Item>
                    <Menu.Item key="4" icon={<LockOutlined />}>
                        New this week
                    </Menu.Item>
                    <Menu.Item key="5" icon={<LockOutlined />}>
                        Recently modified Contacts
                    </Menu.Item>
                </Menu>
            </TabPane>
        </Tabs>
    </Card>
);

const Contacts = () => {
    const navigate = useNavigate();
    const [isTContact, setTContact] = useState<TContact | null>(null);
    const { contacts, isLoading } = useContactsAll();
    const [isModalOpen, setisModalOpen] = useState(false);
    const [isModalManageColumnOpen, setIsModalManageColumnOpen] =
        useState(false);
    const [open, setOpen] = useState(false);
    const [isTitle, setTitle] = useState("");

    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [currentActiveCell, setCurrentActiveCell] = useState("");
    const [currentBtnActive, setCurrentBtnActive] = useState("");
    const [currentActiveType, setCurrentActiveType] = useState("");

    const [hideHeader, setHideHeader] = useState(true);

    const handleEdit = (record: TContact) => {
        setTContact(record);
    };

    const columns: ColumnsType<TContact> = [
        {
            key: "firstName",
            title: "Name",
            dataIndex: "name",
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCellName
                    type="name"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    recordType={(record.firstName && record.lastName) ?? null}
                    setCurrentActiveType={setCurrentActiveType}
                    currentActiveType={currentActiveType}
                    setisModalOpen={setisModalOpen}
                    setTContact={setTContact}
                    setTitle={setTitle}
                    navigate={navigate}
                />
                // <>
                //     <div>
                //         <Button
                //             type="text"
                //             className="m-r-sm"
                //             icon={<FontAwesomeIcon icon={faPen} />}
                //             onClick={() => {
                //                 setisModalOpen(true);
                //                 handleEdit(record);
                //                 console.log("data", record);
                //                 setTitle("Edit Contact");
                //             }}
                //         />
                //         <Avatar
                //             className="avatarText m-r-sm"
                //             // src={record.avatar}
                //             size={32}
                //             style={{
                //                 backgroundColor: "#1677FF",
                //                 verticalAlign: "middle",
                //             }}
                //         >
                //             {record.firstName.charAt(0)}
                //         </Avatar>
                //         <span style={{ marginLeft: "8px" }}>
                //             <Button
                //                 type="link"
                //                 style={{ padding: 0 }}
                //                 onClick={() => {
                //                     navigate(`/contacts/${record.id}`);
                //                 }}
                //             >
                //                 {record.firstName} {record.lastName}
                //             </Button>
                //         </span>
                //         <span>
                //             <Button
                //                 type="text"
                //                 icon={<FontAwesomeIcon icon={faPen} />}
                //                 onClick={() => {
                //                     setisModalOpen(true);
                //                     handleEdit(record);
                //                     console.log("data", record);
                //                     setTitle("Edit Contact");
                //                 }}
                //             />
                //             <Button
                //                 type="text"
                //                 icon={<EyeOutlined />}
                //                 onClick={() => {
                //                     setisModalOpen(true);
                //                     handleEdit(record);
                //                     console.log("data", record);
                //                     setTitle("Edit Contact");
                //                 }}
                //             />
                //         </span>
                //     </div>
                // </>
            ),
            sorter: (a, b) => a.firstName.length - b.firstName.length,
            defaultSortOrder: "descend",
            fixed: "left",
            width: 400,
        },
        {
            key: "email",
            title: "Email",
            dataIndex: "email",
            width: 250,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="email"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    recordType={record.email ?? null}
                    setCurrentActiveType={setCurrentActiveType}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "mobile",
            title: "Mobile",
            dataIndex: "mobile",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="mobile"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.mobile ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "countryLink",
            title: "Country Link",
            dataIndex: "countryLink",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="countryLink"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.countryLink ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "acres",
            title: "Acres",
            dataIndex: "acres",
            width: 150,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="acres"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.acres ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            title: "Tags",
            dataIndex: "tags",
            key: "tags",
            render: (text: string, record: TContact) => (
                <>
                    {/* {record.firstName} */}
                    {/* {record &&
                        record.tags &&
                        record.tags.length > 0 &&
                        record.tags.map((tag) => (
                            <Tag color="blue" key={tag}>
                                {tag}
                            </Tag>
                        ))} */}

                    <ContactsComponentsTableEditableCellTags
                        type="tags"
                        setCurrentActiveCell={setCurrentActiveCell}
                        currentActiveCell={currentActiveCell}
                        setCurrentBtnActive={setCurrentBtnActive}
                        currentBtnActive={currentBtnActive}
                        record={record}
                        setCurrentActiveType={setCurrentActiveType}
                        recordType={record.tags ?? null}
                        currentActiveType={currentActiveType}
                    />
                </>
            ),
            width: 250,
        },
        {
            key: "owner",
            title: "Owner",
            dataIndex: "owner",
            width: 200,
        },
        {
            key: "firstName",
            title: "First Name",
            dataIndex: "firstName",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="firstName"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.firstName ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "lastName",
            title: "Last Name",
            dataIndex: "lastName",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="lastName"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.lastName ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
    ];

    const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
        "checkbox"
    );
    const [selectedRowsData, setSelectedRows] = useState<React.Key[]>([]);

    const onSelectChange = (
        selectedRowKeys: React.Key[],
        selectedRows: TContact[]
    ) => {
        console.log(selectedRowKeys);
        setSelectedRows(selectedRowKeys);

        // setSelectionType(selectedRows);
    };

    useEffect(() => {
        setShowDeleteButton(
            selectedRowsData && selectedRowsData.length > 0 ? true : false
        );
    }, [selectedRowsData]);

    const rowSelection = {
        selectedRowKeys: selectedRowsData,
        onChange: onSelectChange,

        // setSelectionType(selectedRows);
    };

    const deleteContact = useMutation(deleteContactMutation, {
        onSuccess: () => {
            console.log("success");
            queryClient.invalidateQueries("contacts");
            setShowDeleteButton(false);
        },
    });

    const handleDelete = () => {
        deleteContact.mutate({ contactId: selectedRowsData });
    };

    // getCheckboxProps: (record: TContact) => ({
    //     disabled: record.name === "Disabled User", // Column configuration not to be checked
    //     name: record.name,
    // }),

    // useEffect(() => {
    //     console.log("selectionType", selectionType);
    // }, [selectionType]);

    return (
        <Card>
            {showDeleteButton ? (
                <Row style={{ alignItems: "center", marginBottom: "20px" }}>
                    <Button
                        icon={<CloseOutlined />}
                        type="text"
                        className="m-r-md"
                        onClick={() => {
                            setSelectedRows([]);
                            setShowDeleteButton(false);
                        }}
                    ></Button>
                    <Typography.Text className="m-r-md">
                        {selectedRowsData?.length + " Selected"}
                    </Typography.Text>
                    <Popconfirm
                        title="Delete Contact"
                        description="Are you sure to delete this contact?"
                        onConfirm={() => {
                            handleDelete();
                        }}
                    >
                        <Button type="primary" danger className="m-r-sm">
                            Delete
                        </Button>
                    </Popconfirm>

                    <Button icon={<SaveOutlined />} className="m-r-sm">
                        Update
                    </Button>
                    <Button icon={<ExportOutlined />} className="m-r-sm">
                        Export
                    </Button>
                    <Button icon={<CopyOutlined />} className="m-r-sm">
                        Merge
                    </Button>
                    <Button icon={<MailOutlined />} className="m-r-sm">
                        Email
                    </Button>
                    <Button icon={<MobileOutlined />} className="m-r-sm">
                        Text
                    </Button>
                    <Button icon={<CheckCircleOutlined />} className="m-r-sm">
                        Create Activities
                    </Button>
                    <Button icon={<UnorderedListOutlined />}>
                        Add to List
                    </Button>
                </Row>
            ) : (
                <Row style={{ marginBottom: "20px" }}>
                    <Col md={12} lg={12}>
                        <Dropdown overlay={menu} trigger={["click"]}>
                            <Button
                                className="ant-dropdown-link"
                                onClick={(e) => e.preventDefault()}
                                icon={<FunnelPlotOutlined />}
                            >
                                All Contacts <CaretDownOutlined />
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
                            onClick={() => {
                                setOpen(true);
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
                            onClick={() => {
                                setisModalOpen(true);
                                setTitle("Add Contact");
                            }}
                        >
                            Contact
                        </Button>
                        <Button
                            onClick={() => setIsModalManageColumnOpen(true)}
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
                                {
                                    value: "Delete",
                                    label: "Mass Delete Contacts",
                                },
                                {
                                    value: "Update",
                                    label: "Mass Update Contacts",
                                },
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
            )}

            <Row>
                <Col md={24} lg={24}>
                    <Table
                        className="tableCell"
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}
                        rowKey={(record) => record.id}
                        columns={columns}
                        dataSource={contacts}
                        scroll={{ x: 1300 }}
                    />
                </Col>
            </Row>

            <ContactsComponentsAddContacts
                isModalOpen={isModalOpen}
                setIsModalOpen={setisModalOpen}
                record={isTContact}
                title={isTitle}
                setTContact={setTContact}
            />
            <ContactsComponentsFilter open={open} setOpen={setOpen} />
            <ContactsComponentsManageColumn
                isModalManageColumnOpen={isModalManageColumnOpen}
                setIsModalManageColumnOpen={setIsModalManageColumnOpen}
            />
        </Card>
    );
};

export default Contacts;
