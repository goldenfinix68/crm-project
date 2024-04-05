import React, { useEffect, useState } from "react";
import { Button, Card, DatePicker, Space, Table, Tooltip } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { TCallHistory, TUser } from "../../../entities";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { userRoleOption } from "../../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDownload,
    faPlay,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useCallHistory } from "../../../api/query/callQuery";
import { TimeRangePickerProps } from "antd/lib";
import dayjs, { Dayjs } from "dayjs";
import { EventValue } from "rc-picker/lib/interface";
import CustomResizeableTable from "../../../components/CustomResizeableTable";

const CallLogsTable = ({ dateFilter }) => {
    // const { calls, isLoading, refetch } = useCallHistory();

    const [isCallsLoading, setIsCallsLoading] = useState(true);

    const [pagination, setPagination] = useState({
        page_size: 10,
        page: 1,
        dateFilter: dateFilter,
        total: 0,
    });

    const { data: calls, refetch: refetchCalls } = useCallHistory(
        pagination,
        () => {
            setIsCallsLoading(false);
        }
    );

    const columns: ColumnsType<TCallHistory> = [
        {
            title: "Date",
            dataIndex: "dateTime",
            key: "date",
        },
        {
            title: "Duration",
            key: "duration",
            render: (_: any, record: TCallHistory) => {
                return record.duration;
            },
        },
        {
            title: "Type",
            key: "type",
            dataIndex: "type",
        },
        {
            title: "Outcome",
            dataIndex: "outcome",
            key: "outcome",
        },
        {
            title: "From",
            // dataIndex: "from",
            key: "from",
            render: (_: any, record: TCallHistory) => {
                if (record.contactNameFrom !== "Not saved") {
                    return <div>{record.contactNameFrom}</div>;
                } else {
                    return (
                        <div>
                            <Tooltip title={record.from}>
                                <span>Not saved</span>
                            </Tooltip>
                        </div>
                    );
                }
            },
        },
        {
            title: "To",
            // dataIndex: "to",
            key: "to",
            render: (_: any, record: TCallHistory) => {
                if (record.contactNameTo !== "Not saved") {
                    return <div>{record.contactNameTo}</div>;
                } else {
                    return (
                        <div>
                            <Tooltip title={record.to}>
                                <span>Not saved</span>
                            </Tooltip>
                        </div>
                    );
                }
            },
        },
        // {
        //     title: "Contact",
        //     key: "contact",
        //     render: (_: any, record: TCallHistory) => {
        //         const contactNumber = record.isFromApp
        //             ? record.to
        //             : record.from;
        //         return contactNumber == record.contactName
        //             ? "Not saved"
        //             : record.contactName;
        //     },
        // },
        // {
        //     title: "Contact Number",
        //     key: "contact_number",
        //     render: (_: any, record: TCallHistory) => {
        //         return record.isFromApp ? record.to : record.from;
        //     },
        // },
        // {
        //     title: "SM Number",
        //     key: "sm_number",
        //     render: (_: any, record: TCallHistory) => {
        //         return record.isFromApp ? record.from : record.to;
        //     },
        // },
        // {
        //     title: "User",
        //     dataIndex: "userName",
        //     key: "user",
        // },
        {
            title: "Call Recording",
            // dataIndex: "url_recording",
            key: "url_recording",
            render: (_: any, record: TCallHistory) => {
                // play audio for record.url_recording
                console.log(record);
                let url: any = record.recording_url;
                url = url.split(",");
                url = url[0];
                url = url.replace("playAudio('", "");
                console.log("url", url);
                return (
                    <div style={{ padding: 10 }}>
                        <audio src={url} controls />
                    </div>
                );
            },
        },
    ];

    const handleTableChange = (p) => {
        setPagination({
            ...pagination,
            page: p.current,
            page_size: p.pageSize,
        });
    };

    useEffect(() => {
        setIsCallsLoading(true);
        refetchCalls();
    }, [dateFilter, pagination.page_size, pagination.page]);

    useEffect(() => {
        setPagination({
            ...pagination,
            total: calls?.total,
            dateFilter: dateFilter,
        });
    }, [calls, dateFilter]);

    return (
        <Card title="Call Logs" loading={isCallsLoading}>
            <CustomResizeableTable
                columns={columns}
                dataSource={calls?.data ?? []}
                localStorageKey="callsTableColumnsWidth"
                pagination={{
                    pageSizeOptions: ["50", "100", "250"],
                    showSizeChanger: true,
                    pageSize: pagination.page_size,
                    total: pagination.total,
                }}
                onChange={handleTableChange}
            />
        </Card>
    );
};

export default CallLogsTable;
