import React, { useRef, useState } from "react";
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

import {
    AuditOutlined,
    CloseOutlined,
    ContainerOutlined,
    DownOutlined,
    FilterOutlined,
    GroupOutlined,
    InsertRowBelowOutlined,
    MobileOutlined,
    PhoneOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";

import Title from "antd/es/skeleton/Title";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
}
const TextModal = ({ isModalOpen, closeModal }: Props) => {
    const [form] = Form.useForm();
    const onFinish = (values: any) => {
        console.log("Success:", values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
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
                    initialValues={{ to: "+14405633236", from: "outreach" }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
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
                                    <Select.Option value="outreach">
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
                    <Button type="primary">Send</Button>
                    <Button onClick={closeModal}>Schedule</Button>
                    <Button onClick={closeModal}>Cancel</Button>
                </Space>
            </div>
        </Modal>
    );
};

export default TextModal;
