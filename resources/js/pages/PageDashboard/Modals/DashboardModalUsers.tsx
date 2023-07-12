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
    modalteUser: boolean;
    setModalteUser: boolean;
}

export default function DashboardModalUsers({ modalteUser, setModalteUser }) {
    const [form] = Form.useForm();

    const users = [
        {
            label: "John Doe",
            value: "John Doe",
        },
    ];

    return (
        <>
            <Modal
                title="FILTER BY USERS"
                open={modalteUser}
                onCancel={() => {
                    setModalteUser(false);
                }}
                width={400}
                footer={[
                    <Space key={"modal-btns"}>
                        <Button type="primary">Apply</Button>
                        <Button onClick={() => setModalteUser(false)}>
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
                    <Form.Item name={"date"} label="User">
                        <Select
                            className="w-100"
                            suffixIcon={<FontAwesomeIcon icon={faCalendar} />}
                            mode="multiple"
                        >
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
