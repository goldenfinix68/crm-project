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
    TimePicker,
} from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faList,
    faPhoneVolume,
    faUsers,
    faVideo,
} from "@fortawesome/free-solid-svg-icons";

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

import validateRules from "../../../providers/validateRules";

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
    const [form] = Form.useForm();
    const [calendarOptions, setCalendarOptions] = useState(false);

    const calendar = useRef();
    return (
        <Modal
            className="modal-activity"
            open={true}
            // open={isModalOpenAdd}
            onOk={handleOkAdd}
            onCancel={handleCancelAdd}
            width={980}
            footer={false}
            title={
                <>
                    <Typography.Text> Add New Activity</Typography.Text>
                </>
            }
        >
            <Form
                form={form}
                initialValues={{
                    type: "Call",
                }}
            >
                <Row gutter={12}>
                    <Col span={17} className="p-md p-t-sm">
                        <Form.Item
                            name={"title"}
                            rules={[validateRules.required]}
                        >
                            <Input
                                placeholder="Write activity title"
                                className="input-title-no-bottom-only p-l-none"
                            />
                        </Form.Item>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text>Type</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item name={"type"}>
                                    <Select className="select-type">
                                        <Select.Option value="Call">
                                            <FontAwesomeIcon
                                                icon={faPhoneVolume}
                                                className="font-12px m-r-xs"
                                            />
                                            Call
                                        </Select.Option>
                                        <Select.Option value="Task">
                                            <FontAwesomeIcon
                                                icon={faList}
                                                className="font-12px m-r-xs"
                                            />
                                            Task
                                        </Select.Option>
                                        <Select.Option value="Meeting">
                                            <FontAwesomeIcon
                                                icon={faUsers}
                                                className="font-12px m-r-xs"
                                            />
                                            Meeting
                                        </Select.Option>
                                        <Select.Option value="Demo">
                                            <FontAwesomeIcon
                                                icon={faVideo}
                                                className="font-12px m-r-xs"
                                            />
                                            Demo
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text>Date & Time</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Row gutter={12}>
                                    <Col span={6}>
                                        <Form.Item name="start_date">
                                            <DatePicker placeholder="Start Date" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item name="start_date">
                                            <TimePicker
                                                format="HH:mm"
                                                placeholder="Start Time"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item name="start_date">
                                            <TimePicker
                                                format="HH:mm"
                                                placeholder="End Time"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item name="start_date">
                                            <DatePicker placeholder="End Date" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {!calendarOptions && (
                            <Row gutter={12}>
                                <Col span={5} className="col-label">
                                    <Typography.Text>
                                        Calendar Options
                                    </Typography.Text>
                                </Col>
                                <Col span={19} className="col-label">
                                    <Typography.Link
                                        onClick={() => setCalendarOptions(true)}
                                    >
                                        Invitees, Location, Video Conferencing,
                                        Recurrence
                                    </Typography.Link>
                                </Col>
                            </Row>
                        )}

                        {!calendarOptions && (
                            <Row gutter={12}>
                                <Col span={5} className="col-label">
                                    <Typography.Text>
                                        Calendar Options
                                    </Typography.Text>
                                </Col>
                                <Col span={19}>
                                    <Form.Item name={"invitees"}>
                                        <Select
                                            placeholder="Add invitees"
                                            mode="tags"
                                            showSearch
                                        >
                                            <Select.Option
                                                value="Call"
                                                search="Call"
                                            >
                                                Call
                                            </Select.Option>
                                            <Select.Option
                                                value="Task"
                                                search="Task"
                                            >
                                                Task
                                            </Select.Option>
                                            <Select.Option
                                                value="Meeting"
                                                search="Meeting"
                                            >
                                                Meeting
                                            </Select.Option>
                                            <Select.Option
                                                value="Demo"
                                                search="Demo"
                                            >
                                                Demo
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}
                    </Col>

                    <Col span={7}></Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ModalAddActivity;
