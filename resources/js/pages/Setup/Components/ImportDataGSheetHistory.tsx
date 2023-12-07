import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Badge,
    Button,
    Card,
    Dropdown,
    Menu,
    Modal,
    Space,
    Table,
    TableColumnsType,
    Typography,
} from "antd";

import {
    CloseOutlined,
    DownOutlined,
    PullRequestOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { data } from "jquery";
import moment from "moment";
import { gSheetCrawlResults } from "../../../api/query/importDataQuery";
import { TGSheetCrawlHistory, TGSheetCrawlResult } from "../../../entities";
import TextEllipsis from "../../../components/TextEllipsis";

const ImportDataGSheetHistory = () => {
    const { data: crawlResults, isLoading } = gSheetCrawlResults();
    const expandedRowRender = (record: TGSheetCrawlHistory) => {
        const columns: TableColumnsType<TGSheetCrawlResult> = [
            {
                title: "Row #",
                key: "created_at",
                render: (_, record, index) => {
                    return (
                        <div className="p-xs">
                            <TextEllipsis>{index + 1}</TextEllipsis>
                        </div>
                    );
                },
            },
            {
                title: "Result",
                key: "result",
                render: (_, record) => {
                    return (
                        <TextEllipsis>
                            {record.isSuccess ? "Success" : "Failed"}
                        </TextEllipsis>
                    );
                },
            },
            {
                title: "Errors",
                key: "errors",
                render: (_, record) => {
                    return (
                        <TextEllipsis>{record.errors?.join(", ")}</TextEllipsis>
                    );
                },
            },
        ];

        return (
            <Table
                columns={columns}
                dataSource={record.result}
                pagination={false}
            />
        );
    };

    const columns: TableColumnsType<TGSheetCrawlHistory> = [
        {
            title: "Google Sheet Id",
            key: "gSheetId",
            render: (_, record) => (
                <div className="p-xs">
                    <TextEllipsis>{record.gSheetId}</TextEllipsis>
                </div>
            ),
        },
        {
            title: "Initiated By",
            key: "initiated_by",
            render: (_, result) => (
                <TextEllipsis>{result.triggeredBy}</TextEllipsis>
            ),
        },

        {
            title: "Created",
            key: "created_at",
            render: (_, record) => {
                const utcDate = moment.utc(
                    record.created_at,
                    "YYYY-MM-DD HH:mm:ss"
                );
                const localDate = utcDate.clone().local(); // Convert to local timezone

                return (
                    <TextEllipsis>
                        {localDate.format("MMM DD, YYYY hh:mm A")}
                    </TextEllipsis>
                );
            },
        },
    ];

    return (
        <Space direction="vertical" className="w-100">
            <div>
                <Table
                    className="default-table-row-height"
                    columns={columns}
                    expandable={{
                        expandedRowRender,
                    }}
                    dataSource={crawlResults?.map((crawlResult, index) => {
                        return { ...crawlResult, ...{ key: index } };
                    })}
                />
            </div>
        </Space>
    );
};

export default ImportDataGSheetHistory;
