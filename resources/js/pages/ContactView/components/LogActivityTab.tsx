import {
    Button,
    Mentions,
    Form,
    Space,
    Col,
    DatePicker,
    Input,
    Row,
    Select,
} from "antd";
import React from "react";
import moment from "moment";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";

const LogActivityTab = () => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        console.log(values);
        // Perform form submission logic here
    };
    return (
        <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign="left"
            labelWrap
            initialValues={{
                type: "call",
                availability: "busy",
            }}
            onFinish={handleFinish}
            autoComplete="off"
        >
            <Form.Item
                label="Title"
                name="title"
                rules={[
                    {
                        required: true,
                        message: DEFAULT_REQUIRED_MESSAGE,
                    },
                ]}
            >
                <Input placeholder="Write Activity Title" />
            </Form.Item>
            <Form.Item
                label="Type"
                name="type"
                rules={[
                    {
                        required: true,
                        message: "this is required",
                    },
                ]}
            >
                <Select>
                    <Select.Option value="call">Call</Select.Option>
                    <Select.Option value="task">Task</Select.Option>
                    <Select.Option value="meeting">Meeting</Select.Option>
                    <Select.Option value="demo">Demo</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="Outcome"
                name="outcome"
                rules={[
                    {
                        required: true,
                        message: "this is required",
                    },
                ]}
            >
                <Select>
                    <Select.Option value="call">No Answer</Select.Option>
                    <Select.Option value="task">Busy</Select.Option>
                    <Select.Option value="meeting">Wrong Number</Select.Option>
                    <Select.Option value="demo">Left Voicemail</Select.Option>
                    <Select.Option value="demo">Connected</Select.Option>
                    <Select.Option value="demo">Call Me Again</Select.Option>
                    <Select.Option value="demo">Missed</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Date & Time"
                name="dateTime"
                rules={[
                    {
                        required: true,
                        message: "this is required",
                    },
                ]}
            >
                <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>

            <Form.Item
                label="Location"
                name="location"
                rules={[
                    {
                        required: true,
                        message: "this is required",
                    },
                ]}
            >
                <Input placeholder="Add Location" />
            </Form.Item>

            <Form.Item
                label="Internal Note"
                name="internalNote"
                rules={[
                    {
                        required: true,
                        message: "this is required",
                    },
                ]}
            >
                <Input.TextArea rows={4}></Input.TextArea>
            </Form.Item>
            <Form.Item
                label="Owner"
                name="owner"
                rules={[
                    {
                        required: true,
                        message: "this is required",
                    },
                ]}
            >
                <Select>
                    <Select.Option value="Jesse Admin">
                        Jesse Admin
                    </Select.Option>
                    <Select.Option value="Jesse Ashley">
                        Jesse Ashley
                    </Select.Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="Link Records"
                name="linkRecords"
                rules={[
                    {
                        required: true,
                        message: "this is required",
                    },
                ]}
            >
                <Row gutter={12}>
                    <Col md={12}>
                        <Input placeholder="Deal" />
                    </Col>
                    <Col md={12}>
                        <Input placeholder="Contact" />
                    </Col>
                </Row>
            </Form.Item>
            <Form.Item
                label="Tags"
                name="tags"
                rules={[
                    {
                        required: true,
                        message: "this is required",
                    },
                ]}
            >
                <Input placeholder="Tags" />
            </Form.Item>
            <Form.Item style={{ float: "right" }}>
                <Space>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button type="default" onClick={() => form.resetFields()}>
                        Cancel
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default LogActivityTab;
