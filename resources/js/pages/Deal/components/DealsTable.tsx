import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useDealsAll, useDealsAllFiter } from "../../../api/query/dealQuery";
import ModalAddDeal from "./ModalAddDeal";
import { useMutation, useQueryClient } from "react-query";
import ContactsComponentsUpdate from "./ContactsComponentsUpdate";
interface TDeals {
    id: number;
    title: string;
    name: string;
    value: string;
    stage: string;
    status: string;
    owner: string;
}

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
    deals: any;
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
    const onChange: TableProps<TDeals>["onChange"] = (
        pagination: any,
        sorter: any,
        filters: any,
        extra: any
    ) => {
        setFilterPage({
            ...setFilterPage,
            sort_field: filters.field,
            sort_order: filters.order ? filters.order.replace("end", "") : null,
            page: pagination.current,
            page_size: pagination.pageSize,
        });
    };

    const onSelectChange = (
        selectedRowKeys: React.Key[],
        selectedRows: TDeals[]
    ) => {
        console.log(selectedRowKeys);
        console.log(selectedRows);
        setSelectedData(selectedRows);
        setSelectedRows(selectedRowKeys);

        // setSelectionType(selectedRows);
    };
    const rowSelection: TableRowSelection<TDeals> = {
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

    const [showModalAddDealValue, setshowModalAddDealValue] =
        useState<string>("");
    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
    const [modalValue, setModalValue] = useState(false);
    const showModalAdd = (record: any) => {
        setModalValue(record);
        setIsModalOpenAdd(true);
    };

    const handleOkAdd = () => {
        setIsModalOpenAdd(false);
        queryClient.invalidateQueries("deals");
    };

    const handleCancelAdd = () => {
        setIsModalOpenAdd(false);
    };
    const handleEdit = (record: any) => {
        setTContact(record);
    };

    return (
        <>
            <Table
                dataSource={deals?.data && deals?.data?.data}
                onChange={onChange}
                rowKey={(record) => record.id}
                rowSelection={{ ...rowSelection }}
                scroll={{ x: 1300 }}
                pagination={{
                    total: deals?.data?.total,
                    current: filterPage.page,
                    pageSize: filterPage.page_size,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50, 100, 200],
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`,
                }}
            >
                <Table.Column
                    title="Title"
                    dataIndex="title"
                    className="col-status"
                    width={400}
                    sorter
                    render={(text: string, record: any) => {
                        return (
                            <>
                                <Button
                                    type="text"
                                    className="m-r-sm"
                                    icon={<FontAwesomeIcon icon={faPen} />}
                                    onClick={() => showModalAdd(record)}
                                />

                                <span>{text}</span>
                            </>
                        );
                    }}
                    fixed={"left"}
                />

                <Table.Column title="Name" dataIndex="contact_name" sorter />

                <Table.Column title="Value" dataIndex="value" sorter />
                <Table.Column title="Stage" dataIndex="stage" sorter />

                <Table.Column title="Status" dataIndex={"status"} sorter />
                <Table.Column title="Owner" dataIndex={"owner_name"} sorter />
            </Table>
            <ModalAddDeal
                isModalOpenAdd={isModalOpenAdd}
                handleOkAdd={handleOkAdd}
                handleCancelAdd={handleCancelAdd}
                showModalAddDealValue={showModalAddDealValue}
                from={"update"}
                modalValue={modalValue}
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
