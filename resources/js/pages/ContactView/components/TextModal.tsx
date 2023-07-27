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
import ContactContext from "../context";
import queryClient from "../../../queryClient";
interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
}
const TextModal = ({ isModalOpen, closeModal }: Props) => {
    const [form] = Form.useForm();
    const { contact } = useContext(ContactContext);

    const resetFields = () => {
        closeModal();
        form.resetFields();
    };

    const sendText = useMutation(sendTextMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("getContact");
            resetFields();
        },
    });

    const onFinish = async (values: any) => {
        await sendText.mutate({ ...values, contactId: contact.id });
    };

    return (
        <Modal
            className="modal-activity"
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={closeModal}
            footer={null}
            title={null}
            closable={false}
        >
            <div className="modal-header">
                <Typography.Title level={5} style={{ color: "white" }}>
                    Send Text Message
                </Typography.Title>

                <Button
                    onClick={closeModal}
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        border: "0px",
                    }}
                    icon={<CloseOutlined style={{ color: "white" }} />}
                />
            </div>
            <Space
                direction="vertical"
                style={{ padding: "20px", width: "100%" }}
            >
                <Form
                    name="basic"
                    layout="vertical"
                    labelWrap
                    initialValues={{
                        to: "+14405633236",
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
                                    <Select.Option value="task">
                                        Default
                                    </Select.Option>
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
                </Form>
            </Space>
            <div className="modal-footer">
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            form.validateFields().then((values) => {
                                form.submit();
                            })
                        }
                        loading={sendText.isLoading}
                    >
                        Send
                    </Button>
                    <Button onClick={closeModal}>Schedule</Button>
                    <Button onClick={closeModal}>Cancel</Button>
                </Space>
            </div>
        </Modal>
    );
};

export default TextModal;
