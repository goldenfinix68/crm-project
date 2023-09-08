import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    notification,
    message,
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
    StarFilled,
    StarOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TableProps, ColumnGroupType } from "antd/es/table";
import ContactsComponentsAddContacts from "./Components/ContactsComponentsAddContacts";
import ContactsComponentsFilter from "./Components/ContactsComponentsFilter";
import ContactsComponentsManageColumn from "./Components/ContactsComponentsManageColumn";
import { useContactsAll } from "../../api/query/contactsQuery";
import { useUserFavorites } from "../../api/query/userQuery";
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
import ContactsComponentsUpdate from "./Components/ContactsComponentsUpdate";
import Papa from "papaparse";
import {
    useContactAddFavorite,
    useContactDeleteFavorite,
} from "../../api/mutation/useContactMutation";
import ContactsComponentsAddtoList from "./Components/ContactsComponentsAddtoList";

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

interface ListItem {
    id: string;
    title: string;
}

const { Option } = Select;
const { TabPane } = Tabs;

const handleTabChange = (key) => {
    // Handle tab change event
    console.log("Selected tab:", key);
};
const { Search } = Input;
const onSearch = (value: string) => console.log(value);

// const menu = (

// );

const Contacts = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("All");
    const [isTContact, setTContact] = useState<TContact | null>(null);
    const { contacts, isLoading, refetch } = useContactsAll(filter);
    const { favorites, isLoadingFavorites, refetchFavorites } =
        useUserFavorites();
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

    const [isModalOpenUpdate, setisModalOpenUpdate] = useState(false);
    const [isModalOpenAddList, setisModalOpenAddlist] = useState(false);

    // const initialListData: ListItem[] = [
    //     { id: "1", title: "Name" },
    //     { id: "2", title: "Email" },
    //     { id: "3", title: "Mobile" },
    //     { id: "4", title: "Country Link" },
    //     { id: "5", title: "Acres" },
    //     { id: "6", title: "Tags" },
    //     { id: "7", title: "Owner" },
    //     { id: "8", title: "First Name" },
    //     { id: "9", title: "Last Name" },
    // ];

    const [listData, setListData] = useState<ListItem[]>([]);

    useEffect(() => {
        if (listData.length > 0) {
            console.log("listData", listData);
        }
    }, [listData]);

    const handleEdit = (record: TContact) => {
        setTContact(record);
    };

    useEffect(() => {
        console.log(filter);

        refetch();
    }, [filter]);

    const favoriteTitle = {
        "all-contacts": "All Contacts",
        "my-contacts": "My Contacts",
        "new-last-week": "New last week",
        "new-this-week": "New this week",
        "recent-modified-contact": "Recently modified contacts",
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
                    recordTypeFirst={record.firstName ?? null}
                    recordTypeLast={record.lastName ?? null}
                    setCurrentActiveType={setCurrentActiveType}
                    currentActiveType={currentActiveType}
                    setisModalOpen={setisModalOpen}
                    setTContact={setTContact}
                    setTitle={setTitle}
                    navigate={navigate}
                />
            ),
            sorter: (a, b) => a.firstName.length - b.firstName.length,
            defaultSortOrder: "descend",
            fixed: "left",
            width: 400,
            className: "custom-table-cell",
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

        listData.find((item) => item.id === "1")
            ? {
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
              }
            : {},
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
    const [selectedData, setSelectedData] = useState<TContact[]>([]);

    const onSelectChange = (
        selectedRowKeys: React.Key[],
        selectedRows: TContact[]
    ) => {
        console.log(selectedRowKeys);
        console.log(selectedRows);
        setSelectedData(selectedRows);
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

    const [isFavorite, setIsFavorite] = useState<string[]>([]);

    const addFavorite = useMutation(useContactAddFavorite, {
        onSuccess: (res) => {
            queryClient.invalidateQueries("contacts");
        },
    });
    const deleteFavorite = useMutation(useContactDeleteFavorite, {
        onSuccess: (res) => {
            queryClient.invalidateQueries("contacts");
        },
    });

    const handleFavoriteClick = (value) => {
        console.log("val", value);
        let isFavoriteVar = [...isFavorite];

        if (!isFavoriteVar.includes(value)) {
            isFavoriteVar.push(value);

            addFavorite.mutate({ name: value });
        } else {
            let index = isFavoriteVar.findIndex((x) => x === value);
            isFavoriteVar.splice(index, 1);

            deleteFavorite.mutate({ name: value });
        }

        setIsFavorite(isFavoriteVar);
    };

    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const handleItemClick = (item: string) => {
        setDropdownVisible(false);
    };

    const handleExportCSV = () => {
        const tableData = selectedData.map((item) => ({
            Name: item.firstName + " " + item.lastName,
            Email: item.email,
            Mobile: item.mobile,
            CountryLink: item.countryLink,
            Acres: item.acres,
            Tags: item.tags,
            Owner: item.owner,
            FirstName: item.firstName,
            LastName: item.lastName,
        }));

        const csvData = Papa.unparse(tableData, { header: true });
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute("download", "data.csv");
        link.click();
    };

    useEffect(() => {
        if (favorites) {
            console.log("asdads");

            if (favorites.length > 0) {
                let isFavoriteVar: any = [];
                console.log("deals", favorites);

                favorites.forEach((element: any) => {
                    isFavoriteVar.push(element.name);
                });

                setIsFavorite(isFavoriteVar);
            }
        }
    }, [favorites]);

    const [searchQuery, setSearchQuery] = useState<string>("");

    const onSearch = (query: string) => {
        setSearchQuery(query);
    };

    const search = (menuItems: string[], query: string) => {
        return menuItems.filter((item) => {
            const title = favoriteTitle[item];
            return title.toLowerCase().includes(query.toLowerCase());
        });
    };

    const filteredFavoriteItems = search(isFavorite, searchQuery);

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

                    <Button
                        onClick={() => {
                            setisModalOpenUpdate(true);
                        }}
                        icon={<SaveOutlined />}
                        className="m-r-sm"
                    >
                        Update
                    </Button>
                    <Button
                        icon={<ExportOutlined />}
                        className="m-r-sm"
                        onClick={() => {
                            handleExportCSV();
                        }}
                    >
                        Export
                    </Button>
                    <Button
                        icon={<CopyOutlined />}
                        className="m-r-sm"
                        onClick={() => {
                            if (
                                selectedData.length >= 2 &&
                                selectedData.length <= 3
                            ) {
                                navigate(`/contacts/mergeContacts`, {
                                    state: { data: selectedData },
                                });
                            } else {
                                notification.warning({
                                    message:
                                        "Please select either two or three Contacts to merge",
                                });
                            }
                        }}
                    >
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
                    <Button
                        icon={<UnorderedListOutlined />}
                        onClick={() => {
                            setisModalOpenAddlist(true);
                        }}
                    >
                        Add to List
                    </Button>
                </Row>
            ) : (
                <Row style={{ marginBottom: "20px" }}>
                    <Col md={12} lg={12}>
                        <Dropdown
                            visible={isDropdownVisible}
                            onVisibleChange={setDropdownVisible}
                            overlay={
                                <Card style={{ width: "370px" }}>
                                    <Search
                                        placeholder="Search views"
                                        allowClear
                                        onSearch={onSearch}
                                        value={searchQuery}
                                        onChange={(e) =>
                                            onSearch(e.target.value)
                                        }
                                    />
                                    {!searchQuery ? (
                                        <Tabs
                                            defaultActiveKey="tab1"
                                            onChange={handleTabChange}
                                        >
                                            <TabPane tab="FAVORITES" key="tab1">
                                                {isFavorite.length > 0 ? (
                                                    <Menu
                                                        style={{
                                                            backgroundColor:
                                                                "none",
                                                            boxShadow: "none",
                                                        }}
                                                        mode="inline"
                                                    >
                                                        {isFavorite.map(
                                                            (item, index) => {
                                                                return (
                                                                    <Menu.Item
                                                                        key={
                                                                            index
                                                                        }
                                                                        onClick={() => {
                                                                            setDropdownVisible(
                                                                                false
                                                                            );
                                                                            setFilter(
                                                                                item
                                                                            );
                                                                        }}
                                                                    >
                                                                        {
                                                                            favoriteTitle[
                                                                                item
                                                                            ]
                                                                        }
                                                                    </Menu.Item>
                                                                );
                                                            }
                                                        )}{" "}
                                                    </Menu>
                                                ) : (
                                                    <Col
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            flexDirection:
                                                                "column",
                                                        }}
                                                    >
                                                        <Typography.Title
                                                            level={5}
                                                        >
                                                            You have no
                                                            favorites
                                                        </Typography.Title>
                                                        <Typography.Text>
                                                            Select views as
                                                            favorites to make it
                                                            appear here.
                                                        </Typography.Text>
                                                    </Col>
                                                )}
                                            </TabPane>
                                            <TabPane tab="ALL VIEWS" key="tab2">
                                                <Menu
                                                    style={{
                                                        backgroundColor: "none",
                                                        boxShadow: "none",
                                                    }}
                                                    mode="inline"
                                                    // defaultSelectedKeys={

                                                    // }
                                                    // defaultOpenKeys={["sub1"]}
                                                >
                                                    <Typography.Text
                                                        className="m-b-sm"
                                                        strong
                                                    >
                                                        SYSTEM
                                                    </Typography.Text>
                                                    <Menu.Item
                                                        className="menuList"
                                                        key="item1"
                                                        icon={<LockOutlined />}
                                                    >
                                                        <Space>
                                                            <Button
                                                                className="disableHover"
                                                                style={{
                                                                    paddingLeft:
                                                                        "0px",
                                                                    width: "220px",
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "start",
                                                                }}
                                                                type="text"
                                                                onClick={() => {
                                                                    setDropdownVisible(
                                                                        false
                                                                    );
                                                                    setFilter(
                                                                        "all-contacts"
                                                                    );
                                                                }}
                                                            >
                                                                All Contacts
                                                            </Button>
                                                            <Button
                                                                className="disableHover"
                                                                type="text"
                                                                onClick={() => {
                                                                    console.log(
                                                                        "click"
                                                                    );

                                                                    handleFavoriteClick(
                                                                        "all-contacts"
                                                                    );
                                                                }}
                                                            >
                                                                {isFavorite.includes(
                                                                    "all-contacts"
                                                                ) ? (
                                                                    <StarFilled />
                                                                ) : (
                                                                    <StarOutlined />
                                                                )}
                                                            </Button>
                                                        </Space>
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        className="menuList"
                                                        key="item2"
                                                        icon={<LockOutlined />}
                                                    >
                                                        <Space>
                                                            <Button
                                                                className="disableHover"
                                                                style={{
                                                                    paddingLeft:
                                                                        "0px",
                                                                    width: "220px",
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "start",
                                                                }}
                                                                type="text"
                                                                onClick={() => {
                                                                    setDropdownVisible(
                                                                        false
                                                                    );
                                                                    setFilter(
                                                                        "my-contacts"
                                                                    );
                                                                }}
                                                            >
                                                                My Contacts
                                                            </Button>
                                                            <Button
                                                                className="disableHover"
                                                                type="text"
                                                                onClick={() => {
                                                                    handleFavoriteClick(
                                                                        "my-contacts"
                                                                    );
                                                                }}
                                                            >
                                                                {isFavorite.includes(
                                                                    "my-contacts"
                                                                ) ? (
                                                                    <StarFilled />
                                                                ) : (
                                                                    <StarOutlined />
                                                                )}
                                                            </Button>
                                                        </Space>
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        className="menuList"
                                                        key="item3"
                                                        icon={<LockOutlined />}
                                                    >
                                                        <Space>
                                                            <Button
                                                                className="disableHover"
                                                                style={{
                                                                    paddingLeft:
                                                                        "0px",
                                                                    width: "220px",
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "start",
                                                                }}
                                                                type="text"
                                                                onClick={() => {
                                                                    setDropdownVisible(
                                                                        false
                                                                    );
                                                                    setFilter(
                                                                        "new-last-week"
                                                                    );
                                                                }}
                                                            >
                                                                New last week
                                                            </Button>

                                                            <Button
                                                                className="disableHover"
                                                                type="text"
                                                                onClick={() => {
                                                                    handleFavoriteClick(
                                                                        "new-last-week"
                                                                    );
                                                                }}
                                                            >
                                                                {isFavorite.includes(
                                                                    "new-last-week"
                                                                ) ? (
                                                                    <StarFilled />
                                                                ) : (
                                                                    <StarOutlined />
                                                                )}
                                                            </Button>
                                                        </Space>
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        className="menuList"
                                                        key="4"
                                                        icon={<LockOutlined />}
                                                    >
                                                        <Space>
                                                            <Button
                                                                className="disableHover"
                                                                style={{
                                                                    paddingLeft:
                                                                        "0px",
                                                                    width: "220px",
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "start",
                                                                }}
                                                                type="text"
                                                                onClick={() => {
                                                                    setDropdownVisible(
                                                                        false
                                                                    );
                                                                    setFilter(
                                                                        "new-this-week"
                                                                    );
                                                                }}
                                                            >
                                                                New this week
                                                            </Button>
                                                            <Button
                                                                className="disableHover"
                                                                type="text"
                                                                onClick={() => {
                                                                    handleFavoriteClick(
                                                                        "new-this-week"
                                                                    );
                                                                }}
                                                            >
                                                                {isFavorite.includes(
                                                                    "new-this-week"
                                                                ) ? (
                                                                    <StarFilled />
                                                                ) : (
                                                                    <StarOutlined />
                                                                )}
                                                            </Button>
                                                        </Space>
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        className="menuList"
                                                        key="5"
                                                        icon={<LockOutlined />}
                                                    >
                                                        <Space>
                                                            <Button
                                                                className="disableHover"
                                                                style={{
                                                                    paddingLeft:
                                                                        "0px",
                                                                    width: "220px",
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "start",
                                                                }}
                                                                type="text"
                                                                onClick={() => {
                                                                    setDropdownVisible(
                                                                        false
                                                                    );
                                                                    setFilter(
                                                                        "recent-modified-contact"
                                                                    );
                                                                }}
                                                            >
                                                                Recently
                                                                modified
                                                                contacts
                                                            </Button>
                                                            <Button
                                                                className="disableHover"
                                                                type="text"
                                                                onClick={() => {
                                                                    handleFavoriteClick(
                                                                        "recent-modified-contact"
                                                                    );
                                                                }}
                                                            >
                                                                {isFavorite.includes(
                                                                    "recent-modified-contact"
                                                                ) ? (
                                                                    <StarFilled />
                                                                ) : (
                                                                    <StarOutlined />
                                                                )}
                                                            </Button>
                                                        </Space>
                                                    </Menu.Item>
                                                </Menu>
                                            </TabPane>
                                        </Tabs>
                                    ) : (
                                        <>
                                            {Object.values(
                                                favoriteTitle
                                            ).filter((item) =>
                                                item
                                                    .toLocaleLowerCase()
                                                    .startsWith(
                                                        searchQuery.toLocaleLowerCase()
                                                    )
                                            ).length > 0 ? (
                                                <>
                                                    <div className="m-t-md">
                                                        <Typography.Text>
                                                            {Object.values(
                                                                favoriteTitle
                                                            ).filter((item) =>
                                                                item
                                                                    .toLocaleLowerCase()
                                                                    .startsWith(
                                                                        searchQuery.toLocaleLowerCase()
                                                                    )
                                                            ).length +
                                                                " Result Found"}
                                                        </Typography.Text>
                                                    </div>
                                                    <div className="m-t-lg">
                                                        <Typography.Text strong>
                                                            SYSTEM
                                                        </Typography.Text>
                                                    </div>

                                                    <Menu
                                                        style={{
                                                            backgroundColor:
                                                                "none",
                                                            boxShadow: "none",
                                                        }}
                                                        mode="inline"
                                                    >
                                                        {Object.values(
                                                            favoriteTitle
                                                        )
                                                            .filter((item) =>
                                                                item
                                                                    .toLocaleLowerCase()
                                                                    .startsWith(
                                                                        searchQuery.toLocaleLowerCase()
                                                                    )
                                                            )
                                                            .map((item) => {
                                                                return (
                                                                    <Menu.Item
                                                                        className="menuList"
                                                                        key={
                                                                            item
                                                                        }
                                                                        icon={
                                                                            <LockOutlined />
                                                                        }
                                                                    >
                                                                        <Space>
                                                                            <Button
                                                                                className="disableHover"
                                                                                style={{
                                                                                    paddingLeft:
                                                                                        "0px",
                                                                                    width: "220px",
                                                                                    display:
                                                                                        "flex",
                                                                                    alignItems:
                                                                                        "start",
                                                                                }}
                                                                                type="text"
                                                                                onClick={() => {
                                                                                    let objkey =
                                                                                        Object.fromEntries(
                                                                                            Object.entries(
                                                                                                favoriteTitle
                                                                                            ).filter(
                                                                                                ([
                                                                                                    key,
                                                                                                    value,
                                                                                                ]) =>
                                                                                                    value.toLocaleLowerCase() ==
                                                                                                    item.toLocaleLowerCase()
                                                                                            )
                                                                                        );

                                                                                    let finalKey =
                                                                                        Object.keys(
                                                                                            objkey
                                                                                        );

                                                                                    setDropdownVisible(
                                                                                        false
                                                                                    );
                                                                                    setFilter(
                                                                                        finalKey[0]
                                                                                    );
                                                                                }}
                                                                            >
                                                                                {
                                                                                    item
                                                                                }
                                                                            </Button>
                                                                            <Button
                                                                                className="disableHover"
                                                                                type="text"
                                                                                onClick={() => {
                                                                                    let objkey =
                                                                                        Object.fromEntries(
                                                                                            Object.entries(
                                                                                                favoriteTitle
                                                                                            ).filter(
                                                                                                ([
                                                                                                    key,
                                                                                                    value,
                                                                                                ]) =>
                                                                                                    value.toLocaleLowerCase() ==
                                                                                                    item.toLocaleLowerCase()
                                                                                            )
                                                                                        );

                                                                                    let finalKey =
                                                                                        Object.keys(
                                                                                            objkey
                                                                                        );

                                                                                    console.log(
                                                                                        "asdasdsa",
                                                                                        Object.fromEntries(
                                                                                            Object.entries(
                                                                                                favoriteTitle
                                                                                            ).filter(
                                                                                                ([
                                                                                                    key,
                                                                                                    value,
                                                                                                ]) =>
                                                                                                    value.toLocaleLowerCase() ==
                                                                                                    item.toLocaleLowerCase()
                                                                                            )
                                                                                        )[0]
                                                                                    );
                                                                                    handleFavoriteClick(
                                                                                        finalKey[0]
                                                                                    );
                                                                                }}
                                                                            >
                                                                                {isFavorite.includes(
                                                                                    Object.keys(
                                                                                        Object.fromEntries(
                                                                                            Object.entries(
                                                                                                favoriteTitle
                                                                                            ).filter(
                                                                                                ([
                                                                                                    key,
                                                                                                    value,
                                                                                                ]) =>
                                                                                                    value.toLocaleLowerCase() ==
                                                                                                    item.toLocaleLowerCase()
                                                                                            )
                                                                                        )
                                                                                    )[0]
                                                                                ) ? (
                                                                                    <StarFilled />
                                                                                ) : (
                                                                                    <StarOutlined />
                                                                                )}
                                                                            </Button>
                                                                        </Space>
                                                                    </Menu.Item>
                                                                );
                                                            })}
                                                    </Menu>
                                                </>
                                            ) : (
                                                <div className="noResult m-t-lg">
                                                    <Typography.Title level={5}>
                                                        No custom view found
                                                    </Typography.Title>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </Card>
                            }
                            trigger={["click"]}
                        >
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
                listData={listData}
                setListData={setListData}
            />

            <ContactsComponentsUpdate
                isModalOpenUpdate={isModalOpenUpdate}
                setisModalOpenUpdate={setisModalOpenUpdate}
                record={isTContact}
                title={isTitle}
                selectedData={selectedData}
                setTContact={setTContact}
            />
            <ContactsComponentsAddtoList
                isModalOpenAddList={isModalOpenAddList}
                setisModalOpenAddList={setisModalOpenAddlist}
                record={isTContact}
                title={isTitle}
                selectedData={selectedData}
                setTContact={setTContact}
            />
        </Card>
    );
};

export default Contacts;
