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
    UserOutlined,
    DownOutlined,
    SearchOutlined,
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
import ContactsComponentsManageColumn from "./ContactsComponentsManageColumn";
import { filtersQuery } from "../../../api/query/useFilterQuery";
import { MenuProps } from "antd/lib";
interface Props {
    selectedRows?: {
        [key: string]: any;
    }[];
    selectedRowKeys: string[];
    setSelectedRows: any;
    setSelectedRowKeys: any;
    filter: any;
    setFilter: any;
    handleChangeViewAs: (filter?) => void;
}
const ContactTableHeader = ({
    selectedRows,
    setSelectedRows,
    setSelectedRowKeys,
    selectedRowKeys,
    filter,
    setFilter,
    handleChangeViewAs,
}: Props) => {
    const navigate = useNavigate();
    const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSendToManyModalOpen, setIsSendToManyModalOpen] = useState(false);
    const [isAddListModalOpen, setIsAddListModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isManageColumnModalOpen, setIsManageColumnModalOpen] =
        useState(false);

    const { data: savedFilters, isLoading } = filtersQuery();

    const filterViewItems: MenuProps["items"] = [
        { key: 0, label: "All Contacts", onClick: () => handleChangeViewAs() },
        ...(savedFilters?.map((val) => {
            return {
                key: val.id,
                label: val.name,
                onClick: () => handleChangeViewAs(val),
            };
        }) ?? []),
    ];

    const { contactFields } = useAppContextProvider();

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
                        <>
                            <Dropdown
                                menu={{
                                    items: filterViewItems,
                                }}
                                placement="bottomLeft"
                            >
                                <Button
                                    icon={<FunnelPlotOutlined />}
                                    style={{
                                        marginRight: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {filter.id
                                        ? savedFilters?.find(
                                              (val) => val.id == filter.id
                                          )?.name
                                        : "All Contacts"}
                                </Button>
                            </Dropdown>
                        </>
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

            <ContactsComponentsManageColumn
                isModalManageColumnOpen={isManageColumnModalOpen}
                closeModal={() => {
                    setIsManageColumnModalOpen(false);
                }}
                handleSubmit={() => {
                    queryClient.invalidateQueries("customFields");
                }}
            />

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
                columns={contactFields.map((field) => {
                    return { label: field.label, value: field.fieldName };
                })}
                filter={filter}
                setFilter={setFilter}
                type="contact"
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
