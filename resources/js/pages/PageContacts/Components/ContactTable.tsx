import React, { useEffect, useState } from "react";
import { Avatar, Button, Col, Row, Space, Table, Tooltip } from "antd";

import { useAppContextProvider } from "../../../context/AppContext";
import { ColumnsType } from "antd/es/table";
import ContactsEditableTableCell from "./ContactsEditableTableCell";
import CustomFieldFormModal from "../../../components/CustomFieldFormModal";
import { TContact, TCustomField, TFilter } from "../../../entities";
import queryClient from "../../../queryClient";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { ENDPOINTS } from "../../../endpoints";
import TextEllipsis from "../../../components/TextEllipsis";
import { EditOutlined } from "@ant-design/icons";
import CustomResizeableTable from "../../../components/CustomResizeableTable";
import { useCustomFields } from "../../../api/query/customFieldQuery";
import LoadingComponent from "../../../components/LoadingComponent";
import UpdateContactFieldModal from "../../../components/UpdateContactFieldModal";
interface Props {
    setSelectedRows: any;
    setSelectedRowKeys: any;
    selectedRowKeys: string[];
    contacts?: TContact[];
    filter: TFilter;
    setFilter: any;
    pagination: any;
    setPagination: any;
    isContactLoading: boolean;
}
const ContactsTable = ({
    setSelectedRows,
    setSelectedRowKeys,
    selectedRowKeys,
    contacts,
    filter,
    setFilter,
    setPagination,
    pagination,
    isContactLoading,
}: Props) => {
    const { isRoleStats } = useAppContextProvider();
    const [isModalOpen, setisModalOpen] = useState(false);
    const [selectedContactFields, setSelectedContactFields] = useState<
        | {
              [key: string]: any;
          }[]
        | undefined
    >();
    const [isUpdateCellModalOpen, setIsUpdateCellModalOpen] = useState(false);
    const [updateCell, setUpdateCell] = useState<{
        field: TCustomField | undefined;
        fields: any; // Assuming 'record' is of any type
    }>({
        field: undefined,
        fields: undefined,
    });

    const {
        data: contactFields,
        isLoading: isContactFieldsLoading,
        refetch: refetchContactFields,
    } = useCustomFields("contact");

    const firstNameField = contactFields?.find(
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
        ? [
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
                                              setSelectedContactFields(record);
                                          }}
                                          className="m-r-sm"
                                      />
                                  )}
                                  <Tooltip
                                      title={`${record["firstName"]} ${record["lastName"]}`}
                                  >
                                      <Link
                                          to={
                                              "/contacts/" + record["contactId"]
                                          }
                                      >
                                          {`${record["firstName"]} ${record["lastName"]}`}
                                      </Link>
                                  </Tooltip>
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
              ...contactFields
                  .filter(
                      (field) =>
                          !["firstName", "lastName"].includes(
                              field.fieldName
                          ) && field.isDisplayTable
                  )
                  .sort((a, b) => a?.tableSort! - b?.tableSort!)
                  .map((field, index) => {
                      return {
                          title: field.label,
                          dataIndex: field.fieldName,
                          key: field.id,
                          render: (text, record) => {
                              return (
                                  <div
                                      style={{
                                          width: "100%",
                                          cursor: "pointer",
                                      }}
                                      onDoubleClick={() => {
                                          setIsUpdateCellModalOpen(true);
                                          setUpdateCell({
                                              field,
                                              fields: record,
                                          });
                                      }}
                                  >
                                      <TextEllipsis>
                                          {record[field.fieldName] ?? "_"}
                                      </TextEllipsis>
                                  </div>
                              );
                          },
                      };
                  }),
          ]
        : [];

    const handleTableChange = (pagination, sorter) => {
        setPagination({
            ...pagination,
            page: pagination.current,
            page_size: pagination.pageSize,
        });
    };
    if (isContactFieldsLoading) {
        return <LoadingComponent />;
    }

    return (
        <>
            <CustomResizeableTable
                columns={columns as ColumnsType<{ [key: string]: any }>}
                dataSource={contacts?.map((contact) => contact.fields)}
                localStorageKey="contactsTableColumnsWidth"
                className="tableCell"
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }}
                rowKey={(record) => (record as any)?.contactId}
                scroll={{ x: 1300 }}
                pagination={{
                    pageSizeOptions: ["50", "100", "250"],
                    showSizeChanger: true,
                    pageSize: pagination.page_size,
                    total: pagination.total,
                }}
                onChange={handleTableChange}
                loading={isContactLoading}
            />
            {isModalOpen && (
                <CustomFieldFormModal
                    isModalOpen={isModalOpen}
                    closeModal={() => {
                        setisModalOpen(false);
                        setSelectedContactFields(undefined);
                    }}
                    handleSubmit={() => {
                        queryClient.invalidateQueries(ENDPOINTS.contacts.cache);
                    }}
                    type="contact"
                    record={selectedContactFields}
                />
            )}
            {isUpdateCellModalOpen && (
                <UpdateContactFieldModal
                    isModalOpen={isUpdateCellModalOpen}
                    closeModal={() => {
                        setIsUpdateCellModalOpen(false);
                        setUpdateCell({
                            field: undefined,
                            fields: undefined,
                        });
                    }}
                    handleSubmit={() => {
                        queryClient.invalidateQueries(ENDPOINTS.contacts.cache);
                    }}
                    fields={updateCell.fields}
                    field={updateCell.field!}
                />
            )}
        </>
    );
};

export default ContactsTable;
