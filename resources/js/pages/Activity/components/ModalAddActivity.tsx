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
const ModalAddActivity = ({
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
            title="Add New Activity"
            open={isModalOpenAdd}
            onOk={handleOkAdd}
            onCancel={handleCancelAdd}
            width={980}
        >
            <Row gutter={12}>
                <Col md={16}>
                    <div>
                        <Input
                            placeholder="Write activity title"
                            className="input-title-no-bottom-only"
                        ></Input>
                    </div>
                    <br></br>
                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        labelAlign="left"
                        labelWrap
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
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
                                <Select.Option value="meeting">
                                    Meeting
                                </Select.Option>
                                <Select.Option value="demo">Demo</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Date & Time"
                            name="date_time"
                            rules={[
                                {
                                    required: true,
                                    message: "this is required",
                                },
                            ]}
                        >
                            <DatePicker.RangePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Invitees"
                            name="invitees"
                            rules={[
                                {
                                    required: true,
                                    message: "this is required",
                                },
                            ]}
                        >
                            <Input placeholder="Add Invitees" />
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
                            label="Video Conferencing"
                            name="video_conferencing"
                            rules={[
                                {
                                    required: true,
                                    message: "this is required",
                                },
                            ]}
                        >
                            <Select>
                                <Select.Option value="call">Zoom</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Availability"
                            name="availability"
                            rules={[
                                {
                                    required: true,
                                    message: "this is required",
                                },
                            ]}
                        >
                            <Select>
                                <Select.Option value="busy">Busy</Select.Option>
                                <Select.Option value="busy">Free</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Internal Note"
                            name="internal_note"
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
                            name="link_records"
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
                            label="Followers"
                            name="followers"
                            rules={[
                                {
                                    required: true,
                                    message: "this is required",
                                },
                            ]}
                        >
                            <Input placeholder="Followers" />
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

export default ModalAddActivity;
