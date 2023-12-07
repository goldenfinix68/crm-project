import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import ModalAddDeal from "./ModalAddDeal";
import { useMutation, useQueryClient } from "react-query";
import ContactsComponentsUpdate from "./ContactsComponentsUpdate";
import { TDeal } from "../../../entities";
import { useAppContextProvider } from "../../../context/AppContext";
import TextEllipsis from "../../../components/TextEllipsis";

const DealsTable = ({
    deals,
    filterPage,
    setFilterPage,
    showDeleteButton,
    setShowDeleteButton,
    selectedData,
    setSelectedData,
    selectedRowsData,
    setSelectedRows,
    isModalOpenUpdate,
    setisModalOpenUpdate,
    isTContact,
    setTContact,
    isTitle,
    setTitle,
}: {
    deals: TDeal[];
    filterPage: any;
    setFilterPage: any;
    showDeleteButton: any;
    setShowDeleteButton: any;
    selectedData: any;
    setSelectedData: any;
    selectedRowsData: any;
    setSelectedRows: any;
    isModalOpenUpdate: any;
    setisModalOpenUpdate: any;
    isTContact: any;
    setTContact: any;
    isTitle: any;
    setTitle: any;
}) => {
    const queryClient = useQueryClient();
    const { isRoleStats } = useAppContextProvider();
    const onChange: TableProps<TDeal>["onChange"] = (
        pagination: any,
        sorter: any,
        filters: any,
        extra: any
    ) => {
        setFilterPage({
            ...filterPage,
            sort_field: filters.field,
            sort_order: filters.order ? filters.order.replace("end", "") : null,
            page: pagination.current,
            page_size: pagination.pageSize,
        });
    };

    const onSelectChange = (
        selectedRowKeys: React.Key[],
        selectedRows: TDeal[]
    ) => {
        console.log(selectedRowKeys);
        console.log(selectedRows);
        setSelectedData(selectedRows);
        setSelectedRows(selectedRowKeys);

        // setSelectionType(selectedRows);
    };
    const rowSelection: TableRowSelection<TDeal> = {
        selectedRowKeys: selectedRowsData,
        onChange: onSelectChange,
    };

    useEffect(() => {
        setShowDeleteButton(
            selectedRowsData && selectedRowsData.length > 0 ? true : false
        );
    }, [selectedRowsData]);
    useEffect(() => {
        if (showDeleteButton == false) {
            setSelectedRows([]);
        }
    }, [showDeleteButton]);

    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState<TDeal | undefined>(
        undefined
    );
    return (
        <>
            <Table
                dataSource={deals}
                onChange={onChange}
                rowKey={(record) => record?.id ?? ""}
                rowSelection={{ ...rowSelection }}
                scroll={{ x: 800 }}
                pagination={{
                    defaultPageSize: 100,
                    pageSizeOptions: ["100", "250"],
                    showSizeChanger: true,
                }}
            >
                <Table.Column
                    title="Contact"
                    className="col-status"
                    sorter
                    render={(text: string, record: TDeal) => {
                        return (
                            <>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {!isRoleStats && (
                                        <EditOutlined
                                            onClick={() => {
                                                setIsModalOpenAdd(true);
                                                setSelectedDeal(record);
                                            }}
                                            className="m-r-sm"
                                        />
                                    )}

                                    <span>
                                        {record.contact?.fields.firstName +
                                            " " +
                                            record.contact?.fields.lastName}
                                    </span>
                                </div>
                            </>
                        );
                    }}
                    fixed={"left"}
                />

                <Table.Column
                    title="Pipeline"
                    render={(text: string, record: TDeal) => {
                        return (
                            <TextEllipsis>{record.pipeline?.name}</TextEllipsis>
                        );
                    }}
                />
                <Table.Column
                    title="Stage"
                    render={(text: string, record: TDeal) => {
                        return (
                            <TextEllipsis>{record.stage?.name}</TextEllipsis>
                        );
                    }}
                />
            </Table>

            <ModalAddDeal
                isModalOpen={isModalOpenAdd}
                handleSubmit={() => {
                    console.log("qwe");
                }}
                closeModal={() => {
                    setIsModalOpenAdd(false);
                    setSelectedDeal(undefined);
                }}
                deal={selectedDeal}
            />

            <ContactsComponentsUpdate
                isModalOpenUpdate={isModalOpenUpdate}
                setisModalOpenUpdate={setisModalOpenUpdate}
                record={isTContact}
                title={isTitle}
                selectedData={selectedData}
                setTContact={setTContact}
                selectedRowsData={selectedRowsData}
            />
        </>
    );
};

export default DealsTable;
