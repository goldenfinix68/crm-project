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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

interface MyComponentProps {
    modalteDeal: boolean;
    setModalteDeal: boolean;
}

export default function DashboardModalDeal({ modalteDeal, setModalteDeal }) {
    const [form] = Form.useForm();

    const users = [
        {
            label: "Sales",
            value: "Sales",
        },
    ];

    return (
        <>
            <Modal
                title="FILTER BY DEAL PIPELINE"
                open={modalteDeal}
                onCancel={() => {
                    setModalteDeal(false);
                }}
                width={400}
                footer={[
                    <Space key={"modal-btns"}>
                        <Button type="primary">Apply</Button>
                        <Button onClick={() => setModalteDeal(false)}>
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
                    <Form.Item name={"date"} label="Deal Pipeline">
                        <Select className="w-100">
                            {users.map((item, key) => {
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
}
