import React, { useEffect, useRef, useState } from "react";
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
    notification,
} from "antd";

import type { SelectProps } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faList,
    faPhoneVolume,
    faUsers,
    faVideo,
} from "@fortawesome/free-solid-svg-icons";

import { DollarOutlined, UserOutlined } from "@ant-design/icons";

import moment from "moment";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import validateRules from "../../../providers/validateRules";

import { useMutation, useQueryClient } from "react-query";
import { addActivityMutation } from "../../../api/mutation/useActivityMutation";
import {
    useContactsList,
    useDealsList,
    useUsersList,
} from "../../../api/query/activityQuery";
import { an } from "@fullcalendar/core/internal-common";

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
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [calendarOptions, setCalendarOptions] = useState(false);

    const calendar = useRef();

    const onFinish = (values: any, type: string) => {
        values = {
            ...values,
            start_date: values.start_date
                ? dayjs(values.start_date).format("YYYY/MM/DD")
                : undefined,
            end_date: values.end_date
                ? dayjs(values.end_date).format("YYYY/MM/DD")
                : undefined,
            start_time: values.start_time
                ? dayjs(values.start_time).format("HH:mm")
                : undefined,
            end_time: values.end_time
                ? dayjs(values.end_time).format("HH:mm")
                : undefined,
        };

        console.log("onFinish", values);

        if (type === "Save-Close") {
            addActivity.mutate(values);
            handleCancelAdd();
            handleReset();
        } else if (type === "Save-New") {
            addActivity.mutate(values);
            handleReset();
        } else if (type === "Cancel") {
            handleCancelAdd();
            handleReset();
        }
    };

    const handleReset = () => {
        form.resetFields();
        setEventCalendarData([
            {
                title: "",
                start: dayjs(moment().format("YYYY/MM/DD")).format(
                    "YYYY-MM-DD"
                ),
                end: dayjs(moment().format("YYYY/MM/DD")).format("YYYY-MM-DD"),
            },
        ]);
    };

    const addActivity = useMutation(addActivityMutation, {
        onSuccess: (res) => {
            console.log("success");
            queryClient.invalidateQueries("activities");
            //queryClient.invalidateQueries("contactTypesAll");
            // form.resetFields();
        },
    });

    const { dataUsers, isLoadingUsers } = useUsersList();
    const { dataContacts, isLoadingContacts } = useContactsList();
    const { dataDeals, isLoadingDeals } = useDealsList();

    useEffect(() => {
        console.log("dataDeals", dataDeals);
    }, [dataDeals]);

    const halderAfterClose = () => {
        setCalendarOptions(false);
    };

    const [eventCalendarData, setEventCalendarData] = useState([
        {
            title: "",
            start: dayjs(moment().format("YYYY/MM/DD")).format("YYYY-MM-DD"),
            end: dayjs(moment().format("YYYY/MM/DD")).format("YYYY-MM-DD"),
        },
    ]);

    const handleFieldsChange = (changedFields: any, allFields: any) => {
        console.log("Fields", changedFields);
        let titleString: string = "";

        let data: any = [...eventCalendarData];

        if (changedFields[0]?.name[0] === "title") {
            titleString = changedFields[0]?.value;

            data[0] = {
                ...data[0],
                title: titleString,
            };
        }

        if (
            changedFields[0]?.name[0] === "start_date" ||
            changedFields[0]?.name[0] === "start_time"
        ) {
            let formTime: any = form.getFieldsValue().start_time
                ? ` ${dayjs(form.getFieldsValue().start_time).format("HH:mm")}`
                : "";
            let dataTime: any =
                changedFields[0]?.value &&
                changedFields[0]?.name[0] === "start_time"
                    ? ` ${dayjs(changedFields[0]?.value).format("HH:mm")}`
                    : formTime;

            let formDate: any = form.getFieldsValue().start_date
                ? dayjs(form.getFieldsValue().start_date).format("YYYY-MM-DD")
                : "";

            let dataDate: any =
                changedFields[0]?.value &&
                changedFields[0]?.name[0] === "start_date"
                    ? dayjs(changedFields[0]?.value).format("YYYY-MM-DD")
                    : formDate;

            data[0] = {
                ...data[0],
                start: `${formDate}${dataTime}`,
            };
        }

        if (
            changedFields[0]?.name[0] === "end_date" ||
            changedFields[0]?.name[0] === "end_time"
        ) {
            let formTime: any = form.getFieldsValue().end_time
                ? ` ${dayjs(form.getFieldsValue().end_time).format("HH:mm")}`
                : "";
            let dataTime: any =
                changedFields[0]?.value &&
                changedFields[0]?.name[0] === "end_time"
                    ? ` ${dayjs(changedFields[0]?.value).format("HH:mm")}`
                    : formTime;

            let formDate: any = form.getFieldsValue().end_date
                ? dayjs(form.getFieldsValue().end_date).format("YYYY-MM-DD")
                : "";

            let dataDate: any =
                changedFields[0]?.value &&
                changedFields[0]?.name[0] === "end_date"
                    ? dayjs(changedFields[0]?.value).format("YYYY-MM-DD")
                    : formDate;

            data[0] = {
                ...data[0],
                end: formDate ? `${formDate}${dataTime}` : dataTime,
            };
        }

        setEventCalendarData(data);
    };

    useEffect(() => {
        console.log("eventCalendarData", eventCalendarData);
    }, [eventCalendarData]);

    return (
        <Modal
            className="modal-activity"
            open={isModalOpenAdd}
            onOk={handleOkAdd}
            onCancel={handleCancelAdd}
            width={980}
            afterClose={halderAfterClose}
            title={
                <>
                    <Typography.Text> Add New Activity</Typography.Text>
                </>
            }
            footer={
                <>
                    <Row gutter={12}>
                        <Col span={12} className="text-left">
                            <Checkbox> Mark as Complete </Checkbox>
                        </Col>
                        <Col span={12}>
                            <Space wrap>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        form.validateFields()
                                            .then((values) => {
                                                onFinish(values, "Save-Close");
                                            })
                                            .catch((info) => {
                                                notification.warning({
                                                    message: "Warning",
                                                    description:
                                                        "Please fill-up required fields!",
                                                });
                                            });
                                    }}
                                >
                                    Save
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        form.validateFields()
                                            .then((values) => {
                                                onFinish(values, "Save-New");
                                            })
                                            .catch((info) => {
                                                notification.warning({
                                                    message: "Warning",
                                                    description:
                                                        "Please fill-up required fields!",
                                                });
                                            });
                                    }}
                                >
                                    Save and add other
                                </Button>
                                <Button
                                    onClick={() => {
                                        handleCancelAdd();
                                        handleReset();
                                    }}
                                >
                                    Cancel
                                </Button>
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
                    start_date: dayjs(
                        moment().format("YYYY/MM/DD"),
                        "YYYY/MM/DD"
                    ),
                    end_date: dayjs(
                        moment().format("YYYY/MM/DD"),
                        "YYYY/MM/DD"
                    ),
                    owner_id: dataUsers?.user_data?.id
                        ? dataUsers?.user_data?.id
                        : null,
                }}
                onFieldsChange={handleFieldsChange}
            >
                <Row gutter={12} className="">
                    <Col span={17} className="p-md p-t-lg form-left">
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
                                    <Col span={7}>
                                        <Form.Item name="start_date">
                                            <DatePicker
                                                placeholder="Start Date"
                                                format={"MMM, DD YYYY"}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item name="start_time">
                                            <TimePicker
                                                minuteStep={30}
                                                format="HH:mm"
                                                placeholder="Start Time"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item name="end_time">
                                            <TimePicker
                                                minuteStep={30}
                                                format="HH:mm"
                                                placeholder="End Time"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={7}>
                                        <Form.Item name="end_date">
                                            <DatePicker
                                                placeholder="End Date"
                                                format={"MMM, DD YYYY"}
                                            />
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
                                    <Typography.Text>Invitees</Typography.Text>
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
                                            showSearch
                                        >
                                            <Select.Option
                                                value="Zoom Meeting"
                                                search="Zoom Meeting"
                                            >
                                                Zoom Meeting
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
                                <Form.Item name={"internal_note"}>
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
                                        loading={isLoadingUsers}
                                    >
                                        {dataUsers &&
                                            dataUsers?.data &&
                                            dataUsers?.data.map((item, key) => {
                                                return (
                                                    <Select.Option
                                                        key={key}
                                                        value={item.id}
                                                        search={`${item.firstName} ${item.lastName}`}
                                                    >
                                                        {`${item.firstName} ${item.lastName}`}
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
                                        <Form.Item name={"deal_id"}>
                                            <Select
                                                placeholder="Deal"
                                                showSearch
                                                suffixIcon={<DollarOutlined />}
                                                loading={isLoadingDeals}
                                            >
                                                {dataDeals &&
                                                    dataDeals?.data.map(
                                                        (
                                                            item: any,
                                                            key: React.Key
                                                        ) => {
                                                            return (
                                                                <Select.Option
                                                                    key={key}
                                                                    value={
                                                                        item.id
                                                                    }
                                                                    search={
                                                                        item.title
                                                                    }
                                                                >
                                                                    {item.title}
                                                                </Select.Option>
                                                            );
                                                        }
                                                    )}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name={"contact_id"}>
                                            <Select
                                                placeholder="Contact"
                                                showSearch
                                                suffixIcon={<UserOutlined />}
                                                loading={isLoadingContacts}
                                            >
                                                {dataContacts &&
                                                    dataContacts?.data &&
                                                    dataContacts?.data.map(
                                                        (
                                                            item: any,
                                                            key: React.Key
                                                        ) => {
                                                            return (
                                                                <Select.Option
                                                                    key={key}
                                                                    value={
                                                                        item.id
                                                                    }
                                                                    search={`${item.firstName} ${item.lastName}`}
                                                                >
                                                                    {`${item.firstName} ${item.lastName}`}
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
                                <Form.Item name={"followers"}>
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
                                <Form.Item name={"tags"}>
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

                    <Col
                        span={7}
                        className="p-l-none p-r-none p-t-lg form-right"
                    >
                        <div className={"FullCalendarActivity"}>
                            <FullCalendar
                                plugins={[
                                    dayGridPlugin,
                                    timeGridPlugin,
                                    interactionPlugin,
                                ]}
                                initialView="timeGridDay"
                                headerToolbar={{
                                    left: "prev",
                                    center: "title",
                                    right: "next",
                                }}
                                weekends={false}
                                events={
                                    eventCalendarData[0].title
                                        ? eventCalendarData
                                        : []
                                }
                                eventDrop={(info) => {
                                    // Called when an event is dropped to a new date/time
                                    console.log(
                                        "Event dropped to:",
                                        info.event.start
                                    );
                                }}
                                eventResize={(info) => {
                                    // Called when an event's end time is changed by resizing
                                    console.log(
                                        "Event resized to:",
                                        info.event.start,
                                        info.event.end
                                    );
                                }}

                                // eventContent={<></>}
                                // slotDuration={"00:30:00"}
                            />
                        </div>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ModalAddActivity;
