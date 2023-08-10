import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useDealsAll } from "../../../api/query/dealQuery";
import ModalAddDeal from "./ModalAddDeal";
import { useMutation, useQueryClient } from "react-query";
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
    showDeleteButton,
    setShowDeleteButton,
}: {
    deals: Array<TDeals>;
    showDeleteButton: any;
    setShowDeleteButton: any;
}) => {
    const queryClient = useQueryClient();
    const onChange: TableProps<TDeals>["onChange"] = (
        pagination,
        filters,
        sorter,
        extra
    ) => {
        console.log("params", pagination, filters, sorter, extra);
    };
    const [selectedRowsData, setSelectedRows] = useState<React.Key[]>([]);
    const [selectedData, setSelectedData] = useState<TDeals[]>([]);
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
    return (
        <>
            <Table
                dataSource={deals}
                onChange={onChange}
                rowKey={(record) => record.id}
                rowSelection={{ ...rowSelection }}
                scroll={{ x: "max-content" }}
            >
                <Table.Column
                    title="Title"
                    dataIndex="title"
                    className="col-status"
                    width={300}
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
                    fixed
                />

                <Table.Column title="Name" dataIndex="contact_name" />

                <Table.Column title="Value" dataIndex="value" />
                <Table.Column title="Stage" dataIndex="stage" />

                <Table.Column title="Status" dataIndex={"status"} />
                <Table.Column title="Owner" dataIndex={"owner_name"} />
            </Table>
            <ModalAddDeal
                isModalOpenAdd={isModalOpenAdd}
                handleOkAdd={handleOkAdd}
                handleCancelAdd={handleCancelAdd}
                showModalAddDealValue={showModalAddDealValue}
                from={"update"}
                modalValue={modalValue}
            />
        </>
    );
};

export default DealsTable;
