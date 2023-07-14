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
            title="Add New Deal"
            open={isModalOpenAdd}
            onOk={handleOkAdd}
            onCancel={handleCancelAdd}
            width={850}
        >
            <Row gutter={12}>
                <Col md={16}>
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

                        <Row gutter={12}>
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
                                <Form.Item label="Currency" name="currency">
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
                                <Form.Item label="Source" name="source">
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
                                <Form.Item label="Priority" name="priority">
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
                                <Form.Item label="Status" name="status">
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
                        </Row>
                    </Form>
                </Col>
                <Col md={8}>
                    <div className={"FullCalendarActivity"}>
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin]}
                            initialView="timeGridDay"
                            headerToolbar={{
                                left: "prev",
                                center: "title",
                                right: "next",
                            }}
                            weekends={false}
                            events={[]}
                            eventContent={<></>}
                        />
                    </div>
                </Col>
            </Row>
        </Modal>
    );
};

export default ModalAddDeal;
