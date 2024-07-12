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
import CustomResizeableTable from "../../../components/CustomResizeableTable";

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

    const columns = [
        {
            title: "Contact",
            className: "col-status",
            sorter: true,
            render: (text, record) => (
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

                        <span>{record?.fullName}</span>
                    </div>
                </>
            ),
        },
        {
            title: "Pipeline",
            render: (text, record) => (
                <TextEllipsis>{record.pipeline?.name}</TextEllipsis>
            ),
        },
        {
            title: "Stage",
            render: (text, record) => (
                <TextEllipsis>{record.stage?.name}</TextEllipsis>
            ),
        },
    ];
    return (
        <>
            {/* <Table
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
                columns={columns}
            /> */}

            <CustomResizeableTable
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
                columns={columns}
                localStorageKey="dealsTableColumnsWidth"
            />

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
