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
import TextArea from "antd/es/input/TextArea";
interface Props {
    isModalOpenAdd: boolean;
    handleOkAdd: () => void;
    handleCancelAdd: () => void;
}
const ModalAddDeal = ({
    isModalOpenAdd,
    handleOkAdd,
    handleCancelAdd,
}: Props) => {
    const onFinish = (values: any) => {
        console.log("Success:", values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };

    const calendar = useRef();
    return (
        <Modal
            className="modal-activity"
            open={isModalOpenAdd}
            onOk={handleOkAdd}
            onCancel={handleCancelAdd}
            width={980}
            footer={null}
            title={null}
            closable={false}
            // footer={[
            //     <Button type="primary">Save</Button>,
            //     <Button type="primary">Save and add other</Button>,
            //     <Button>Cancel</Button>,
            // ]}
        >
            <div className="modal-header">
                <Typography.Title level={5} style={{ color: "white" }}>
                    Add New Deal
                </Typography.Title>
                <Button
                    type="link"
                    style={{ marginRight: "-559px", color: "white" }}
                >
                    {" "}
                    <u>Manage Fields</u>
                </Button>
                <Button
                    onClick={handleCancelAdd}
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        border: "0px",
                    }}
                    icon={<CloseOutlined style={{ color: "white" }} />}
                />
            </div>
            <Row gutter={12}>
                <Col md={16} className="col-1-modal-act">
                    <Form
                        layout="vertical"
                        name="basic"
                        labelAlign="left"
                        labelWrap
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: "this is required",
                                },
                            ]}
                        >
                            <Input placeholder="Title" />
                        </Form.Item>

                        <Row gutter={24}>
                            <Col md={12}>
                                <Form.Item
                                    label="Contact"
                                    name="contact"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Contact" />
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Win Probability"
                                    name="contact"
                                >
                                    <Input
                                        placeholder="Win Probability"
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={12}>
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
                                    <Select defaultValue={"Jesse Ashley"}>
                                        <Select.Option value="Jesse Admin">
                                            Jesse Admin
                                        </Select.Option>
                                        <Select.Option value="Jesse Ashley">
                                            Jesse Ashley
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Estimated"
                                    name="Estimated Close Date"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item label="Value" name="value">
                                    <Input placeholder="Value" />
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Currency"
                                    name="currency"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select defaultValue={"USD"}>
                                        <Select.Option value="USD">
                                            USD
                                        </Select.Option>
                                        <Select.Option value="Comp & Qualify">
                                            Comp & Qualify
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Source"
                                    name="source"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select defaultValue={"ACQ"}>
                                        <Select.Option value="ACQ">
                                            ACQ
                                        </Select.Option>
                                        <Select.Option value="Referrals">
                                            Marketing
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Stage"
                                    name="stage"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select defaultValue={"Comp & Qualify"}>
                                        <Select.Option value="ACQ">
                                            Comp & Qualify
                                        </Select.Option>
                                        <Select.Option value="Referrals">
                                            First Offer Given
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Source"
                                    name="source"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select defaultValue={"ADS"}>
                                        <Select.Option value="ADS">
                                            ADS
                                        </Select.Option>
                                        <Select.Option value="Referrals">
                                            Referrals
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Priority"
                                    name="priority"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select defaultValue={"High"}>
                                        <Select.Option value="High">
                                            High
                                        </Select.Option>
                                        <Select.Option value="Medium">
                                            Medium
                                        </Select.Option>
                                        <Select.Option value="Low">
                                            Low
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col md={12}>
                                <Form.Item
                                    label="Status"
                                    name="status"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select defaultValue={"High"}>
                                        <Select.Option value="Open">
                                            Open
                                        </Select.Option>
                                        <Select.Option value="Won">
                                            Won
                                        </Select.Option>
                                        <Select.Option value="Lost">
                                            Lost
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={24} style={{ marginBottom: 15 }}>
                                <b>Details</b>
                            </Col>

                            <Col md={24}>
                                <Form.Item label="Details" name="details">
                                    <TextArea></TextArea>
                                </Form.Item>
                            </Col>
                            <Col md={24}>
                                <Form.Item label="Tags" name="tags">
                                    <Input placeholder="Tags" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col md={8} style={{ padding: 20 }} className="col-2-modal-act">
                    <Row>
                        <Col md={24}>
                            <div
                                style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                }}
                            >
                                Teamm mates
                            </div>
                            <Input placeholder="Search User" />
                        </Col>
                        <Col md={24}>
                            <div
                                style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                }}
                            >
                                Participants
                            </div>
                            <Input placeholder="Search Contact" />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div className="modal-footer">
                <Button className="m-r-xs" type="primary">
                    Save
                </Button>
                <Button className="m-r-xs" type="primary">
                    Save and add other
                </Button>
                <Button onClick={handleCancelAdd}>Cancel</Button>
            </div>
        </Modal>
    );
};

export default ModalAddDeal;
