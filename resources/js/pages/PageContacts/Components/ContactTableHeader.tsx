import React, { useState } from "react";
import {
    Button,
    Card,
    Col,
    Dropdown,
    Menu,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
    Tabs,
    Typography,
    notification,
} from "antd";

import { useAppContextProvider } from "../../../context/AppContext";
import { ColumnsType } from "antd/es/table";
import ContactsEditableTableCell from "./ContactsEditableTableCell";
import CustomFieldFormModal from "../../../components/CustomFieldFormModal";
import { TContact } from "../../../entities";
import queryClient from "../../../queryClient";
import {
    CloseOutlined,
    SaveOutlined,
    ExportOutlined,
    CopyOutlined,
    MailOutlined,
    MobileOutlined,
    CheckCircleOutlined,
    UnorderedListOutlined,
    LockOutlined,
    StarFilled,
    StarOutlined,
    FunnelPlotOutlined,
    CaretDownOutlined,
    PlusCircleOutlined,
    TableOutlined,
} from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";
import { Search, useNavigate } from "react-router-dom";
import { CONTACT_COLUMNS, CONTACT_LIST_ACTION } from "../../../constants";
import { useMutation } from "react-query";
import { deleteContactMutation } from "../../../api/mutation/useContactMutation";
import ContactsComponentsUpdate from "./ContactBulkUpdate";
import ContactBulkUpdate from "./ContactBulkUpdate";
import SendToManyModal from "../../../components/SentToManyModal";
import Papa from "papaparse";
import Filter from "../../Deal/components/Filter";
interface Props {
    selectedRows?: {
        [key: string]: any;
    }[];
    selectedRowKeys: string[];
    setSelectedRows: any;
    setSelectedRowKeys: any;
}
const ContactTableHeader = ({
    selectedRows,
    setSelectedRows,
    setSelectedRowKeys,
    selectedRowKeys,
}: Props) => {
    const navigate = useNavigate();
    const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSendToManyModalOpen, setIsSendToManyModalOpen] = useState(false);
    const [isAddListModalOpen, setIsAddListModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isManageColumnModalOpen, setIsManageColumnModalOpen] =
        useState(false);

    const deleteContact = useMutation(deleteContactMutation, {
        onSuccess: () => {
            console.log("success");
            queryClient.invalidateQueries("contacts");
            clearSelection();
        },
    });

    const handleDelete = () => {
        console.log(selectedRowKeys);
        deleteContact.mutate({ contactId: selectedRowKeys });
    };

    const clearSelection = () => {
        setSelectedRowKeys([]); // Clear selected row keys
        setSelectedRows([]); // Clear selected rows
    };

    const handleExportCSV = () => {
        // const tableData = selectedData.map((item) => ({
        //     Name: item.firstName + " " + item.lastName,
        //     Email: item.email,
        //     Mobile: item.mobile,
        //     CountryLink: item.countryLink,
        //     Acres: item.acres,
        //     Tags: item.tags,
        //     Owner: item.owner,
        //     FirstName: item.firstName,
        //     LastName: item.lastName,
        // }));
        // Get the current timestamp in the user's local time zone
        const timestamp = new Date().toLocaleString();
        // Format the timestamp to be suitable for a filename
        const formattedTimestamp = timestamp.replace(/[\s:]/g, "-");
        const fileName = `Speedlead_Export_${formattedTimestamp}.csv`; // Add timestamp to the filename
        const csvData = Papa.unparse(selectedRows, { header: true });
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute("download", fileName);
        link.click();
    };

    return (
        <>
            {selectedRows?.length ? (
                <Row style={{ alignItems: "center", marginBottom: "20px" }}>
                    <Button
                        icon={<CloseOutlined />}
                        type="text"
                        className="m-r-md"
                        onClick={() => {
                            clearSelection();
                        }}
                    ></Button>
                    <Typography.Text className="m-r-md">
                        {selectedRows?.length + " Selected"}
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
                            setIsBulkUpdateModalOpen(true);
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
                                selectedRows.length >= 2 &&
                                selectedRows.length <= 3
                            ) {
                                navigate(`/contacts/mergeContacts`, {
                                    state: { data: selectedRows },
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
                    <Button
                        icon={<MobileOutlined />}
                        className="m-r-sm"
                        onClick={() => setIsSendToManyModalOpen(true)}
                    >
                        Text
                    </Button>
                    <Button icon={<CheckCircleOutlined />} className="m-r-sm">
                        Create Activities
                    </Button>
                    <Button
                        icon={<UnorderedListOutlined />}
                        onClick={() => {
                            setIsAddListModalOpen(true);
                        }}
                    >
                        Add to List
                    </Button>
                </Row>
            ) : (
                <Row style={{ marginBottom: "20px" }}>
                    <Col md={12} lg={12}>
                        {/* <Dropdown
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
                        </Dropdown> */}
                    </Col>
                    <Col
                        md={12}
                        lg={12}
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            style={{
                                marginRight: "10px",
                                display: "flex",
                                alignItems: "center",
                            }}
                            onClick={() => {
                                setIsFilterModalOpen(true);
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
                                setIsAddModalOpen(true);
                            }}
                        >
                            Contact
                        </Button>
                        <Button
                            onClick={() => setIsManageColumnModalOpen(true)}
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
                            showSearch
                            onChange={(e) => {
                                if (e == "ImportExcel") {
                                    navigate(
                                        "/setup/data-administration/import-file"
                                    );
                                }
                            }}
                        >
                            {CONTACT_LIST_ACTION.map((action) => (
                                <Select.Option
                                    value={action.value}
                                    disabled={action.disabled}
                                >
                                    {action.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            )}

            <CustomFieldFormModal
                isModalOpen={isAddModalOpen}
                closeModal={() => {
                    setIsAddModalOpen(false);
                }}
                handleSubmit={() => {
                    queryClient.invalidateQueries("contacts");
                }}
                type="contact"
            />

            <Filter
                openFilter={isFilterModalOpen}
                setOpenFilter={setIsFilterModalOpen}
                columns={CONTACT_COLUMNS}
            />
            <ContactBulkUpdate
                isModalOpen={isBulkUpdateModalOpen}
                closeModal={() => setIsBulkUpdateModalOpen(false)}
                handleSubmit={() => {
                    console.log("qwe");
                }}
                selectedRowKeys={selectedRowKeys}
            />

            <SendToManyModal
                isModalOpen={isSendToManyModalOpen}
                closeModal={() => setIsSendToManyModalOpen(false)}
                contacts={(selectedRows as any) ?? []}
            />
        </>
    );
};

export default ContactTableHeader;
