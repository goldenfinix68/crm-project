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
    Checkbox,
} from "antd";

import type { SelectProps } from "antd";

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
    DollarOutlined,
    DownOutlined,
    FilterOutlined,
    GroupOutlined,
    InsertRowBelowOutlined,
    MobileOutlined,
    PhoneOutlined,
    PlusCircleOutlined,
    UserOutlined,
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

const optionRecurrence: SelectProps["options"] = [
    {
        label: "Doesn’t repeat",
        value: "Doesn’t repeat",
    },
    {
        label: "Daily",
        value: "Daily",
    },
    {
        label: "Weekly",
        value: "Weekly",
    },
    {
        label: "Monthly",
        value: "Monthly",
    },
    {
        label: "Yearly",
        value: "Yearly",
    },
    {
        label: "Custom",
        value: "Custom",
    },
];

const optionAvailability: SelectProps["options"] = [
    {
        label: "Busy",
        value: "Busy",
    },
    {
        label: "Free",
        value: "Free",
    },
];

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
            title={
                <>
                    <Typography.Text> Add New Activity</Typography.Text>
                </>
            }
            footer={
                <>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Checkbox> Mark as Complete </Checkbox>
                        </Col>
                        <Col span={12}>
                            <Space wrap>
                                <Button type="primary">Save</Button>
                                <Button type="primary">
                                    Save and add other
                                </Button>
                                <Button>Cancel</Button>
                            </Space>
                        </Col>
                    </Row>
                </>
            }
        >
            <Form
                form={form}
                initialValues={{
                    type: "Call",
                    recurrence: "Doesn’t repeat",
                    availability: "Busy",
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
                                    <Select className="select-custom-width">
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
                            <Row gutter={12} style={{ marginBottom: 25 }}>
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

                        {calendarOptions && (
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
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}

                        {calendarOptions && (
                            <Row gutter={12}>
                                <Col span={5} className="col-label">
                                    <Typography.Text>Location</Typography.Text>
                                </Col>
                                <Col span={19}>
                                    <Form.Item name={"location"}>
                                        <Input placeholder="Add Location" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}

                        {calendarOptions && (
                            <Row gutter={12}>
                                <Col span={5} className="col-label">
                                    <Typography.Text>
                                        Video Conferencing
                                    </Typography.Text>
                                </Col>
                                <Col span={19}>
                                    <Form.Item name={"video_conferencing"}>
                                        <Select
                                            placeholder="Available video call integrations"
                                            mode="tags"
                                            showSearch
                                        >
                                            <Select.Option
                                                value="Call"
                                                search="Call"
                                            >
                                                Call
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}

                        {calendarOptions && (
                            <Row gutter={12}>
                                <Col span={5} className="col-label">
                                    <Typography.Text>
                                        Recurrence
                                    </Typography.Text>
                                </Col>
                                <Col span={19}>
                                    <Form.Item name={"recurrence"}>
                                        <Select
                                            placeholder="Select Recurrence"
                                            showSearch
                                            className="select-custom-width"
                                        >
                                            {optionRecurrence.map(
                                                (item, key) => {
                                                    return (
                                                        <Select.Option
                                                            key={key}
                                                            value={item.value}
                                                            search={item.label}
                                                        >
                                                            {item.label}
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text style={{ color: "red" }}>
                                    *
                                </Typography.Text>
                                <Typography.Text>Availability</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item
                                    name={"availability"}
                                    rules={[validateRules.required]}
                                >
                                    <Select
                                        placeholder="Availability"
                                        showSearch
                                        className="select-custom-width"
                                    >
                                        {optionAvailability.map((item, key) => {
                                            return (
                                                <Select.Option
                                                    key={key}
                                                    value={item.value}
                                                    search={item.label}
                                                >
                                                    {item.label}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label col-label-note">
                                <Typography.Text>Internal Note</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item
                                    name={"internal_note"}
                                    rules={[validateRules.required]}
                                >
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="Add internal note"
                                        className="no-resize"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text>Owner</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item
                                    name={"owner_id"}
                                    rules={[validateRules.required]}
                                >
                                    <Select
                                        placeholder="Owner"
                                        showSearch
                                        className="select-custom-width"
                                    >
                                        {optionAvailability.map((item, key) => {
                                            return (
                                                <Select.Option
                                                    key={key}
                                                    value={item.value}
                                                    search={item.label}
                                                >
                                                    {item.label}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text>Link Records</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Row gutter={12}>
                                    <Col span={12}>
                                        <Form.Item
                                            name={"deal_id"}
                                            rules={[validateRules.required]}
                                        >
                                            <Select
                                                placeholder="Deal"
                                                showSearch
                                                suffixIcon={<DollarOutlined />}
                                            >
                                                {optionAvailability.map(
                                                    (item, key) => {
                                                        return (
                                                            <Select.Option
                                                                key={key}
                                                                value={
                                                                    item.value
                                                                }
                                                                search={
                                                                    item.label
                                                                }
                                                            >
                                                                {item.label}
                                                            </Select.Option>
                                                        );
                                                    }
                                                )}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name={"contact_id"}
                                            rules={[validateRules.required]}
                                        >
                                            <Select
                                                placeholder="Contact"
                                                showSearch
                                                suffixIcon={<UserOutlined />}
                                            >
                                                {optionAvailability.map(
                                                    (item, key) => {
                                                        return (
                                                            <Select.Option
                                                                key={key}
                                                                value={
                                                                    item.value
                                                                }
                                                                search={
                                                                    item.label
                                                                }
                                                            >
                                                                {item.label}
                                                            </Select.Option>
                                                        );
                                                    }
                                                )}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text>Followers</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item
                                    name={"follower_id"}
                                    rules={[validateRules.required]}
                                >
                                    <Select
                                        placeholder="Add Followers"
                                        showSearch
                                        mode="multiple"
                                    >
                                        {optionAvailability.map((item, key) => {
                                            return (
                                                <Select.Option
                                                    key={key}
                                                    value={item.value}
                                                    search={item.label}
                                                >
                                                    {item.label}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text>Tags</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item
                                    name={"tags"}
                                    rules={[validateRules.required]}
                                >
                                    <Select
                                        placeholder="Tags"
                                        showSearch
                                        mode="tags"
                                    >
                                        {optionAvailability.map((item, key) => {
                                            return (
                                                <Select.Option
                                                    key={key}
                                                    value={item.value}
                                                    search={item.label}
                                                >
                                                    {item.label}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={7}></Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ModalAddActivity;
