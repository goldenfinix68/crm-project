import React from "react";
import { DatePicker, Form, Modal, Select, Typography } from "antd";

interface MyComponentProps {
    modateDateRange: boolean;
    setModateDateRange: boolean;
}

export default function DashboardModalDateRange({
    modateDateRange,
    setModateDateRange,
}) {
    const [form] = Form.useForm();

    const dateRange = [
        {
            label: "Last 7 Days",
            value: "Last 7 Days",
        },
        {
            label: "Last 7 Days",
            value: "Last 7 Days",
        },
        {
            label: "Last 14 Days",
            value: "Last 14 Days",
        },
        {
            label: "Last 30 Days",
            value: "Last 30 Days",
        },
        {
            label: "Last 90 Days",
            value: "Last 90 Days",
        },
        {
            label: "Today",
            value: "Today",
        },
        {
            label: "Yesterday",
            value: "Yesterday",
        },
        {
            label: "This Week",
            value: "This Week",
        },
        {
            label: "Last Week",
            value: "Last Week",
        },
        {
            label: "Next Week",
            value: "Next Week",
        },
        {
            label: "This Month",
            value: "This Month",
        },
        {
            label: "Last Month",
            value: "Last Month",
        },
        {
            label: "Next Month",
            value: "Next Month",
        },
        {
            label: "This Quarter",
            value: "This Quarter",
        },
        {
            label: "Last Quarter",
            value: "Last Quarter",
        },
        {
            label: "Next Quarter",
            value: "Next Quarter",
        },
        {
            label: "This Year",
            value: "This Year",
        },
        {
            label: "Last Year",
            value: "Last Year",
        },
        {
            label: "Next Year",
            value: "Next Year",
        },
        {
            label: "More than x days ago",
            value: "More than x days ago",
        },
        {
            label: "Less than x days ago",
            value: "Less than x days ago",
        },
        {
            label: "More than x upcoming days",
            value: "More than x upcoming days",
        },
        {
            label: "Less than x upcoming days",
            value: "Less than x upcoming days",
        },
        {
            label: "Custom Range",
            value: "Custom Range",
        },
    ];

    return (
        <>
            <Modal
                title="FILTER BY DATE RANGE"
                open={modateDateRange}
                onCancel={() => {
                    setModateDateRange(false);
                }}
                width={400}
            >
                <Typography.Text>
                    Filter set here will override filters set on individual
                    widgets
                </Typography.Text>

                <Form form={form}>
                    <Form.Item name={"date"}>
                        <Select className="w-100">
                            {/* {dateRange.map} */}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
