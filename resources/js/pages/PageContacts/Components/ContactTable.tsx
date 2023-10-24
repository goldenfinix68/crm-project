import React, { useState } from "react";
import { Table } from "antd";

import { useAppContextProvider } from "../../../context/AppContext";
import { ColumnsType } from "antd/es/table";
import ContactsEditableTableCell from "./ContactsEditableTableCell";
import CustomFieldFormModal from "../../../components/CustomFieldFormModal";
import { TContact } from "../../../entities";
import queryClient from "../../../queryClient";
interface Props {
    handleUpdateContactClick?: (contactId) => void;
}
const ContactsTable = ({ handleUpdateContactClick }: Props) => {
    const [selectedRowsData, setSelectedRows] = useState<React.Key[]>([]);
    const [selectedData, setSelectedData] = useState<any>([]);
    const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
        "checkbox"
    );
    const { contacts, contactFields } = useAppContextProvider();
    const [isModalOpen, setisModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<
        TContact | undefined
    >();

    const onSelectChange = (
        selectedRowKeys: React.Key[],
        selectedRows: any
    ) => {
        console.log(selectedRowKeys);
        console.log(selectedRows);
        setSelectedData(selectedRows);
        setSelectedRows(selectedRowKeys);

        // setSelectionType(selectedRows);
    };
    const rowSelection = {
        selectedRowKeys: selectedRowsData,
        onChange: onSelectChange,

        // setSelectionType(selectedRows);
    };

    const columns = contactFields
        ?.filter((field) => field.fieldName != "lastName")
        ?.map((field) => {
            if (field.fieldName == "firstName") {
                return {
                    title: field.label,
                    dataIndex: field.fieldName,
                    key: field.id,
                    render: (text, record) => {
                        return (
                            <ContactsEditableTableCell
                                record={record}
                                field={field}
                                lastNameField={contactFields.find(
                                    (field) => field.fieldName == "lastName"
                                )}
                                isNameField
                                handleUpdateContactClick={(contactId) => {
                                    setSelectedContact(
                                        contacts.find(
                                            (contact) => contact.id == contactId
                                        )
                                    );
                                    setisModalOpen(true);
                                }}
                            />
                        );
                    },
                    sorter: (a, b) =>
                        a[field.fieldName].length - b[field.fieldName].length,
                    defaultSortOrder: "descend",
                    fixed: "left",
                    className: "custom-table-cell",
                };
            }
            return {
                title: field.label,
                dataIndex: field.fieldName,
                key: field.id,
                render: (text, record) => {
                    return (
                        <ContactsEditableTableCell
                            record={record}
                            field={field}
                        />
                    );
                },
            };
        });
    return (
        <>
            <Table
                className="tableCell"
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                rowKey={(record) => record.id}
                // columns={orderedColumns ? orderedColumns : columns}
                columns={columns as ColumnsType<{ [key: string]: any }>}
                dataSource={contacts.map((contact) => contact.fields)}
                scroll={{ x: 1300 }}
            />

            <CustomFieldFormModal
                isModalOpen={isModalOpen}
                closeModal={() => {
                    setisModalOpen(false);
                    setSelectedContact(undefined);
                }}
                handleSubmit={() => {
                    queryClient.invalidateQueries("contacts");
                }}
                type="contact"
                record={selectedContact?.fields}
            />
        </>
    );
};

export default ContactsTable;
