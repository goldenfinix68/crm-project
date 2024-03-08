import React from "react";
import { Button, Space, Table, TableColumnsType, message } from "antd";

import moment from "moment";
import { gSheetCrawlResults } from "../../../api/query/importDataQuery";
import { TGSheetCrawlHistory, TGSheetCrawlResult } from "../../../entities";
import TextEllipsis from "../../../components/TextEllipsis";
import copy from "copy-to-clipboard";

const ImportDataGSheetHistory = () => {
    const { data: crawlResults, isLoading } = gSheetCrawlResults();

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
                <TextEllipsis>{result.initiatedBy}</TextEllipsis>
            ),
        },
        {
            title: "Row Count",
            key: "row_count",
            render: (_, result) => (
                <TextEllipsis>{result.rowCount}</TextEllipsis>
            ),
        },
        {
            title: "Processed",
            key: "sucess_imported",
            render: (_, result) => {
                const getProcessedCount = () => {
                    if (
                        result.status == "Queued" ||
                        result.status == "Failed"
                    ) {
                        return "0";
                    } else if (result.status == "Completed") {
                        return result.processed;
                    } else if (result.status == "Running") {
                        return result.importedCount;
                    }
                };

                return <TextEllipsis>{getProcessedCount()}</TextEllipsis>;
            },
        },
        {
            title: "Status",
            key: "status",
            render: (_, result) => <TextEllipsis>{result.status}</TextEllipsis>,
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
                    dataSource={crawlResults}
                />
            </div>
        </Space>
    );
};

export default ImportDataGSheetHistory;
