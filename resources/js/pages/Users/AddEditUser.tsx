import { Card, Button, Form, Input, InputNumber } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, UserAddOutlined } from "@ant-design/icons";
import { DEFAULT_REQUIRED_MESSAGE } from "../../constants";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const AddEditUser = () => {
    const navigate = useNavigate();
    const onFinish = (values: any) => {
        console.log(values);
    };
    return (
        <Card
            title="Add user"
            extra={
                <Link to="/users">
                    <Button type="link">
                        <ArrowLeftOutlined /> &nbsp;Back
                    </Button>
                </Link>
            }
        >
            <Form
                name="basic"
                {...layout}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[
                        {
                            required: true,
                            message: DEFAULT_REQUIRED_MESSAGE,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[
                        {
                            required: true,
                            message: DEFAULT_REQUIRED_MESSAGE,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: DEFAULT_REQUIRED_MESSAGE,
                        },
                    ]}
                >
                    <Input type="email" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: DEFAULT_REQUIRED_MESSAGE,
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddEditUser;
