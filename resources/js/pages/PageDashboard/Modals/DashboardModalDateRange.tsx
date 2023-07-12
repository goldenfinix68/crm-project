import React from "react";
import {
    Button,
    DatePicker,
    Form,
    Modal,
    Select,
    Space,
    Typography,
} from "antd";
import type { MenuItemProps, MenuProps, SelectProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

interface MyComponentProps {
    modalteDateRange: boolean;
    setModalteDateRange: any;
}

const dateRange: SelectProps["options"] = [
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

const frequency: SelectProps["options"] = [
    {
        label: "Daily",
        value: "Daily",
    },
    {
        label: "Weekly",
        value: "Weekly",
    },
    {
        label: "Monthly",
        value: "Monthly",
    },
    {
        label: "Quarterly",
        value: "Quarterly",
    },
    {
        label: "Yearly",
        value: "Yearly",
    },
];

const DashboardModalDateRange: React.FC<MyComponentProps> = (props) => {
    const { modalteDateRange, setModalteDateRange } = props;
    const [form] = Form.useForm();

    return (
        <>
            <Modal
                title="FILTER BY DATE RANGE"
                open={modalteDateRange}
                onCancel={() => {
                    setModalteDateRange(false);
                }}
                width={400}
                footer={[
                    <Space key={"modal-btns"}>
                        <Button type="primary">Apply</Button>
                        <Button onClick={() => setModalteDateRange(false)}>
                            Cancel
                        </Button>
                    </Space>,
                ]}
            >
                <Typography.Text>
                    Filter set here will override filters set on individual
                    widgets
                </Typography.Text>

                <Form form={form} layout="vertical" className="m-t-md">
                    <Form.Item name={"date"} label="Date Range">
                        <Select
                            className="w-100"
                            suffixIcon={<FontAwesomeIcon icon={faCalendar} />}
                        >
                            {dateRange.map((item, key) => {
                                return (
                                    <Select.Option key={key} label={item.value}>
                                        {item.value}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item name={"frequency"} label="Frequency">
                        <Select className="w-100">
                            {frequency.map((item, key) => {
                                return (
                                    <Select.Option key={key} label={item.value}>
                                        {item.value}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default DashboardModalDateRange;
