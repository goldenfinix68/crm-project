import React, { useEffect, useState } from "react";
import { Button, DatePicker, Space, Table, Tooltip } from "antd";
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

const onChange: TableProps<TCallHistory>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
) => {
    console.log("params", pagination, filters, sorter, extra);
};

const CallLogsTable = () => {
    const { calls, isLoading } = useCallHistory();
    const [dateFilter, setDateFilter] = useState<
        [EventValue<Dayjs>, EventValue<Dayjs>]
    >([dayjs().add(-7, "d"), dayjs()]);
    const [dataSource, setDataSource] = useState<TCallHistory[]>();

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
    const rangePresets: TimeRangePickerProps["presets"] = [
        { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
        { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
        { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
        { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
    ];
    const onRangeChange = (
        dates: null | (Dayjs | null)[],
        dateStrings: string[]
    ) => {
        if (dates) {
            setDateFilter([dates[0] || dayjs(), dates[1] || dayjs()]);
        } else {
            console.log("Clear");
        }
    };

    useEffect(() => {
        if (dateFilter.length) {
            const filteredCalls = calls?.filter((call) => {
                const callDateTime = dayjs(call.dateTime);
                return (
                    callDateTime.isAfter(dateFilter[0]) &&
                    callDateTime.isBefore(dateFilter[1])
                );
            });
            setDataSource(filteredCalls);
        } else {
            setDataSource(calls);
        }
    }, [dateFilter, calls]);

    return (
        <Space direction="vertical" className="w-100">
            <Space>
                Period:
                <DatePicker.RangePicker
                    presets={rangePresets}
                    onChange={onRangeChange}
                    value={dateFilter}
                />
            </Space>
            <CustomResizeableTable
                columns={columns}
                dataSource={dataSource ?? []}
                localStorageKey="callsTableColumnsWidth"
            />
            {/*             
            <Table
                columns={columns}
                dataSource={dataSource}
                onChange={onChange}
                pagination={{
                    defaultPageSize: 100,
                    pageSizeOptions: ["100", "250"],
                    showSizeChanger: true,
                }}
            /> */}
        </Space>
    );
};

export default CallLogsTable;
