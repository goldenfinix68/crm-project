import React, { useContext, useRef, useState } from "react";
import {
    Button,
    Col,
    Dropdown,
    Input,
    Modal,
    Radio,
    Row,
    Space,
    Table,
    Tooltip,
    Typography,
    Form,
    Select,
    DatePicker,
} from "antd";

import { CloseOutlined } from "@ant-design/icons";

import { useMutation } from "react-query";
import { sendTextMutation } from "../../../api/mutation/useTextMutation";
import queryClient from "../../../queryClient";
import ContactContext from "../../ContactView/context";
interface Props {
    handleSubmit: () => void;
    handleCancel: () => void;
}
const TextForm = ({ handleSubmit, handleCancel }: Props) => {
    const [form] = Form.useForm();
    const { contact } = useContext(ContactContext);
    const [error, setError] = useState("");

    const resetFields = () => {
        handleCancel();
        form.resetFields();
        setError("");
    };

    const sendText = useMutation(sendTextMutation, {
        onSuccess: () => {
            handleSubmit();
            resetFields();
        },
        onError: (e: any) => {
            setError(e.message || "An error occurred");
        },
    });

    const onFinish = async (values: any) => {
        setError("");
        await sendText.mutate({ ...values, contactId: contact.id });
    };

    return (
        <Form
            name="basic"
            layout="vertical"
            labelWrap
            initialValues={{
                to: contact.mobile,
                from: "Outreach (+1 303-952-1461)",
            }}
            onFinish={onFinish}
            autoComplete="off"
            form={form}
        >
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        label="To"
                        name="to"
                        rules={[
                            {
                                required: true,
                                message: "this is required",
                            },
                        ]}
                    >
                        <Input disabled />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="From"
                        name="from"
                        rules={[
                            {
                                required: true,
                                message: "this is required",
                            },
                        ]}
                    >
                        <Select style={{ width: "100%" }}>
                            <Select.Option value="Outreach (+1 303-952-1461)">
                                Outreach (+1 303-952-1461)
                            </Select.Option>
                            <Select.Option value="task">Default</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="message"
                rules={[
                    {
                        required: true,
                        message: "this is required",
                    },
                ]}
            >
                <Input.TextArea
                    rows={4}
                    placeholder="Type here ..."
                ></Input.TextArea>
            </Form.Item>
            {error ? (
                <center>
                    <Typography.Text style={{ color: "red" }}>
                        {error}
                    </Typography.Text>
                </center>
            ) : null}

            <Form.Item
                style={{
                    marginBottom: 0,
                }}
            >
                <Space>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={sendText.isLoading}
                    >
                        Send
                    </Button>
                    <Button onClick={resetFields}>Schedule</Button>
                    <Button onClick={resetFields}>Cancel</Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default TextForm;
