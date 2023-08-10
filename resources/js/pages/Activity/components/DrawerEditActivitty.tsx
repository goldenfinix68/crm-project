import React, { useState } from "react";
import {
    CheckCircleOutlined,
    CheckOutlined,
    DollarOutlined,
    EllipsisOutlined,
    MailOutlined,
    PhoneOutlined,
    RedEnvelopeOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    DatePicker,
    Drawer,
    Form,
    Input,
    Row,
    Select,
    Space,
    Tabs,
    TimePicker,
    Typography,
} from "antd";
import type { TabsProps, SelectProps } from "antd";
import validateRules from "../../../providers/validateRules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faList,
    faPhoneVolume,
    faUsers,
    faVideo,
} from "@fortawesome/free-solid-svg-icons";

import moment from "moment";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
    useContactsList,
    useDealsList,
    useUsersList,
} from "../../../api/query/activityQuery";
dayjs.extend(customParseFormat);

interface UpdateProps {
    drawerUpdateOpen: boolean;
    setDrawerUpdateOpen: any;
    drawerUpdateData: any;
    setDrawerUpdateData: any;
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

const DrawerUpdateActivity: React.FC<UpdateProps> = (props) => {
    const { drawerUpdateOpen, setDrawerUpdateOpen } = props;

    const { dataUsers, isLoadingUsers } = useUsersList();
    const { dataContacts, isLoadingContacts } = useContactsList();
    const { dataDeals, isLoadingDeals } = useDealsList();

    const [form] = Form.useForm();
    const [calendarOptions, setCalendarOptions] = useState(false);
    const onChange = (key: string) => {
        console.log(key);
    };

    const items: TabsProps["items"] = [
        {
            key: "1",
            label: `DETAILS`,
            children: (
                <Card
                    bordered={false}
                    style={{
                        boxShadow: "none",
                    }}
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
                            // owner_id: dataUsers?.user_data?.id
                            //     ? dataUsers?.user_data?.id
                            //     : null,
                        }}
                    >
                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text>Title</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item name={"type"}>
                                    <Input placeholder="Write activity title" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text>Type</Typography.Text>
                            </Col>
                            <Col span={8}>
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
                    </Form>
                </Card>
            ),
        },
        {
            key: "2",
            label: `TIMELINE`,
            children: `Content of Tab Pane 2`,
        },
    ];

    const handleDrawerClose = () => {
        setDrawerUpdateOpen(false);
    };

    const handleFinish = (values: any) => {
        setDrawerUpdateOpen(false);
    };

    return (
        <>
            <Drawer
                width={720}
                open={drawerUpdateOpen}
                closeIcon={false}
                bodyStyle={{ padding: 0 }}
                footer={
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => {
                                form.validateFields()
                                    .then((values: any) => {
                                        handleFinish(values);
                                    })
                                    .catch((info) => {
                                        //   notification.warning({
                                        //     message: "Warning",
                                        //     description: "Please fill-up required fields!",
                                        //   });
                                    });
                            }}
                        >
                            Update
                        </Button>
                        <Button onClick={() => handleDrawerClose()}>
                            Cancel
                        </Button>
                    </Space>
                }
            >
                <Card
                    bordered={false}
                    style={{
                        boxShadow: "none",
                    }}
                >
                    <Row gutter={12}>
                        <Col
                            span={2}
                            className="text-right"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button shape="circle" size="large">
                                <CheckOutlined />
                            </Button>
                        </Col>
                        <Col
                            span={20}
                            style={{
                                display: "flex",
                            }}
                        >
                            <Typography.Text style={{ fontSize: 25 }}>
                                Title
                            </Typography.Text>
                        </Col>
                    </Row>
                    <Row gutter={12} className="m-t-sm">
                        <Col
                            span={2}
                            className="text-right"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                            }}
                        ></Col>
                        <Col span={20}>
                            <Space>
                                <Button
                                    shape="circle"
                                    size="large"
                                    type="primary"
                                >
                                    <PhoneOutlined />
                                </Button>
                                <Button
                                    shape="circle"
                                    size="large"
                                    type="primary"
                                >
                                    <MailOutlined />
                                </Button>
                                <Button
                                    shape="circle"
                                    size="large"
                                    type="primary"
                                >
                                    <RedEnvelopeOutlined />
                                </Button>
                                <Button shape="circle" size="large">
                                    <EllipsisOutlined />
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    onChange={onChange}
                    className="update-activity-tab"
                />
            </Drawer>
        </>
    );
};

export default DrawerUpdateActivity;
