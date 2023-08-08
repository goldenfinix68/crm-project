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
interface TDeals {
    id: number;
    title: string;
    name: string;
    value: string;
    stage: string;
    status: string;
    owner: string;
}

const DealsTable = ({ deals }: { deals: Array<TDeals> }) => {
    const onChange: TableProps<TDeals>["onChange"] = (
        pagination,
        filters,
        sorter,
        extra
    ) => {
        console.log("params", pagination, filters, sorter, extra);
    };

    const rowSelection: TableRowSelection<TDeals> = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                "selectedRows: ",
                selectedRows
            );
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
    };
    const [showModalAddDealValue, setshowModalAddDealValue] =
        useState<string>("");
    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
    const [modalValue, setModalValue] = useState(false);
    const showModalAdd = (record: any) => {
        setIsModalOpenAdd(true);
        setModalValue(record);
    };

    const handleOkAdd = () => {
        setIsModalOpenAdd(false);
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
            />
        </>
    );
};

export default DealsTable;
