import React, { useState } from "react";
import { Avatar, Button, Space, Table } from "antd";

import { useAppContextProvider } from "../../../context/AppContext";
import { ColumnsType } from "antd/es/table";
import ContactsEditableTableCell from "./ContactsEditableTableCell";
import CustomFieldFormModal from "../../../components/CustomFieldFormModal";
import { TContact } from "../../../entities";
import queryClient from "../../../queryClient";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { ENDPOINTS } from "../../../endpoints";
import TextEllipsis from "../../../components/TextEllipsis";
import { EditOutlined } from "@ant-design/icons";
interface Props {
    setSelectedRows: any;
    setSelectedRowKeys: any;
    selectedRowKeys: string[];
    contacts?: TContact[];
}
const ContactsTable = ({
    setSelectedRows,
    setSelectedRowKeys,
    selectedRowKeys,
    contacts,
}: Props) => {
    const { contactFields, isRoleStats } = useAppContextProvider();
    const [isModalOpen, setisModalOpen] = useState(false);
    const [selectedContactFields, setSelectedContactFields] = useState<
        | {
              [key: string]: any;
          }[]
        | undefined
    >();
    const firstNameField = contactFields.find(
        (field) => field.fieldName == "firstName"
    )!;

    const rowSelection = {
        selectedRowKeys,
        onChange: (
            selectedRowKeys: React.Key[],
            selectedRows: ColumnsType<{ [key: string]: any }>
        ) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
        },
    };

    const columns = contactFields
        ?.filter(
            (field) =>
                !["firstName", "lastName"].includes(field.fieldName) &&
                field.isDisplayTable
        )
        .sort((a, b) => a?.tableSort! - b?.tableSort!)
        .map((field, index) => {
            return {
                title: field.label,
                dataIndex: field.fieldName,
                key: field.id,
                render: (text, record) => {
                    return (
                        <TextEllipsis>
                            <ContactsEditableTableCell
                                record={record}
                                field={field}
                                handleSubmit={() => {
                                    queryClient.invalidateQueries(
                                        ENDPOINTS.filteredContacts.cache
                                    );
                                }}
                            />
                        </TextEllipsis>
                    );
                },
            };
        });

    return (
        <>
            <Table
                className="tableCell"
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }}
                // size="small"
                rowKey={(record) => (record as any)?.contactId}
                // columns={orderedColumns ? orderedColumns : columns}
                columns={
                    [
                        {
                            title: "Full Name",
                            dataIndex: "fullName",
                            key: "fullName",
                            render: (
                                text,
                                record: {
                                    [key: string]: any;
                                }[]
                            ) => {
                                return (
                                    <TextEllipsis>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            {!isRoleStats && (
                                                <EditOutlined
                                                    onClick={() => {
                                                        setisModalOpen(true);
                                                        setSelectedContactFields(
                                                            record
                                                        );
                                                    }}
                                                    className="m-r-sm"
                                                />
                                            )}

                                            <Link
                                                to={
                                                    "/contacts/" +
                                                    record["contactId"]
                                                }
                                            >
                                                {`${record["firstName"]} ${record["lastName"]}`}
                                            </Link>
                                        </div>
                                    </TextEllipsis>
                                );
                            },
                            sorter: (a, b) =>
                                a[firstNameField?.fieldName]?.length -
                                b[firstNameField?.fieldName]?.length,
                            defaultSortOrder: "descend",
                            fixed: "left",
                        },
                        ...columns,
                    ] as ColumnsType<{ [key: string]: any }>
                }
                dataSource={contacts?.map((contact) => contact.fields)}
                scroll={{ x: 1300 }}
                pagination={{
                    defaultPageSize: 100,
                    pageSizeOptions: ["100", "250"],
                    showSizeChanger: true,
                }}
            />

            <CustomFieldFormModal
                isModalOpen={isModalOpen}
                closeModal={() => {
                    setisModalOpen(false);
                    setSelectedContactFields(undefined);
                }}
                handleSubmit={() => {
                    queryClient.invalidateQueries("contacts");
                    queryClient.invalidateQueries(
                        ENDPOINTS.filteredContacts.cache
                    );
                }}
                type="contact"
                record={selectedContactFields}
            />
        </>
    );
};

export default ContactsTable;
