import React, { useEffect, useState } from "react";
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
    Image,
    Input,
    List,
    Radio,
    Row,
    Select,
    Space,
    Tabs,
    TimePicker,
    Typography,
    notification,
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
import { useMutation, useQueryClient } from "react-query";
import moment from "moment";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
    useActivityType,
    useActivutyCustomField,
    useActivutyCustomFieldValue,
    useContactsList,
    useDealsList,
    usePeopleList,
    useTagList,
    useUsersList,
} from "../../../api/query/activityQuery";
import { addActivityMutation } from "../../../api/mutation/useActivityMutation";
import DynamicFields from "./DyNamicFields";
import ComponentActivityTypeIcon from "../../Setup/Components/ComponentActivityTypeIcon";
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
    const {
        drawerUpdateOpen,
        setDrawerUpdateOpen,
        drawerUpdateData,
        setDrawerUpdateData,
    } = props;

    const { dataUsers, isLoadingUsers } = useUsersList();
    const { dataContacts, isLoadingContacts } = useContactsList();
    const { dataDeals, isLoadingDeals } = useDealsList();
    const { dataPeople, isLoadingPeople } = usePeopleList();
    const { dataTag, isLoadingTag } = useTagList();
    const { dataType, isLoadingType } = useActivityType();

    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [formDynamic] = Form.useForm();
    const [calendarOptions, setCalendarOptions] = useState(false);
    const onChange = (key: string) => {
        // console.log(key);
    };

    useEffect(() => {
        if (drawerUpdateData) {
            const invitees: string[] = [];
            if (drawerUpdateData?.activity_invitees.length > 0) {
                drawerUpdateData?.activity_invitees.map(
                    (item: any, key: number) => {
                        invitees.push(item.full_name);
                    }
                );
            }

            const followers: string[] = [];
            if (drawerUpdateData?.activity_followers.length > 0) {
                drawerUpdateData?.activity_followers.map(
                    (item: any, key: number) => {
                        followers.push(item.full_name);
                    }
                );
            }

            const tags: string[] = [];
            if (drawerUpdateData?.activity_tags.length > 0) {
                drawerUpdateData?.activity_tags.map(
                    (item: any, key: number) => {
                        tags.push(item.tag);
                    }
                );
            }

            // if (drawerUpdateData?.custom_field_values.length > 0) {
            //     setCustomFieldsData(drawerUpdateData?.custom_field_values);
            // }

            form.setFieldsValue({
                title: drawerUpdateData?.title,
                type: drawerUpdateData?.type,
                recurrence: drawerUpdateData?.type
                    ? drawerUpdateData?.type
                    : undefined,
                availability: drawerUpdateData?.availability
                    ? drawerUpdateData?.availability
                    : undefined,
                start_date: drawerUpdateData?.start_date
                    ? dayjs(drawerUpdateData?.start_date, "YYYY/MM/DD")
                    : undefined,
                end_date: drawerUpdateData?.end_date
                    ? dayjs(drawerUpdateData?.end_date, "YYYY/MM/DD")
                    : undefined,
                start_time: drawerUpdateData?.start_time
                    ? dayjs(
                          `${drawerUpdateData?.start_date} ${drawerUpdateData?.start_time}`,
                          "YYYY/MM/DD HH:mm"
                      )
                    : undefined,
                end_time: drawerUpdateData?.end_time
                    ? dayjs(
                          `${drawerUpdateData?.end_date} ${drawerUpdateData?.end_time}`,
                          "YYYY/MM/DD HH:mm"
                      )
                    : undefined,
                invitees: invitees,
                location: drawerUpdateData?.location
                    ? drawerUpdateData?.location
                    : undefined,
                video_conferencing: drawerUpdateData?.video_conferencing
                    ? drawerUpdateData?.video_conferencing
                    : undefined,
                internal_note: drawerUpdateData?.internal_note
                    ? drawerUpdateData?.internal_note
                    : undefined,
                owner_id: drawerUpdateData?.owner_id
                    ? drawerUpdateData?.owner_id
                    : undefined,
                deal_id: drawerUpdateData?.deal_id
                    ? drawerUpdateData?.deal_id
                    : undefined,
                contact_id: drawerUpdateData?.contact_id
                    ? drawerUpdateData?.contact_id
                    : undefined,
                followers: followers,
                tags: tags,
            });

            if (
                drawerUpdateData?.location ||
                invitees.length > 0 ||
                drawerUpdateData?.video_conferencing
            ) {
                setCalendarOptions(true);
            }
        } else {
            setDrawerUpdateData(null);
        }
    }, [drawerUpdateData]);

    const [timelineKey, setTimelineKey] = useState("All");
    const handleChangeTimelineKey = (val) => {
        setTimelineKey(val);
    };

    const { dataCustomField, isLoadingCustomField } =
        useActivutyCustomFieldValue(drawerUpdateData && drawerUpdateData?.id);
    const [customFieldsData, setCustomFieldsData] = useState([]);

    const handleDrawerClose = () => {
        form.resetFields();
        formDynamic.resetFields();
        setCustomFieldsData([]);
        setDrawerUpdateOpen(false);
        setDrawerUpdateData(null);
    };

    const handleGetClassName = (val: string) => {
        return val === timelineKey ? "timeline-btn-active" : "";
    };

    const data = [
        {
            id: 1,
            title: "Activity Created",
            description: "by You",
            user_id: 1,
            user_image:
                "https://files.salesmate.io/clinkup.salesmate.io/profilepic/0de525c9-f8b9-4f6b-a325-9d5264fc38d4.jpg",
        },
    ];

    useEffect(() => {
        if (drawerUpdateData?.custom_field_values.length > 0) {
            let formData: any = [];

            drawerUpdateData?.custom_field_values.map((item: any) => {
                let value = item.value;

                if (item.field_type === "Multi Select") {
                    value = JSON.parse(item.value);
                }
                if (item.field_type === "Date") {
                    value = item.value
                        ? dayjs(item.value, "YYYY/MM/DD")
                        : undefined;
                }
                if (item.field_type === "Date Time") {
                    value = item.value
                        ? dayjs(item.value, "YYYY/MM/DD HH:mm A")
                        : undefined;
                }
                formData = {
                    ...formData,
                    [item["field_name"]]: value,
                };
            });

            formDynamic.setFieldsValue(formData);
        }
    }, [drawerUpdateData?.custom_field_values]);

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
                    loading={isLoadingCustomField}
                >
                    <Form form={form}>
                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text>Title</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item name={"title"}>
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
                                    <Select
                                        className="select-custom-width"
                                        loading={isLoadingType}
                                    >
                                        {dataType?.data &&
                                            dataType?.data.map(
                                                (item: any, key: React.Key) => {
                                                    return (
                                                        <Select.Option
                                                            key={key}
                                                            value={item?.type}
                                                            search={item?.type}
                                                        >
                                                            {ComponentActivityTypeIcon(
                                                                item?.icon
                                                            )}{" "}
                                                            <Typography.Text className="m-l-xs">
                                                                {item?.type}
                                                            </Typography.Text>
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
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
                                            loading={isLoadingPeople}
                                        >
                                            {dataPeople?.data &&
                                                dataPeople?.data.map(
                                                    (
                                                        item: any,
                                                        key: React.Key
                                                    ) => {
                                                        let data = `${item.firstName} ${item.lastName}`;
                                                        return (
                                                            <Select.Option
                                                                key={key}
                                                                value={data}
                                                                search={data}
                                                            >
                                                                {data}
                                                            </Select.Option>
                                                        );
                                                    }
                                                )}
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
                                        loading={isLoadingPeople}
                                    >
                                        {dataPeople?.data &&
                                            dataPeople?.data.map(
                                                (item: any, key: React.Key) => {
                                                    let data = `${item.firstName} ${item.lastName}`;
                                                    return (
                                                        <Select.Option
                                                            key={key}
                                                            value={data}
                                                            search={data}
                                                        >
                                                            {data}
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
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
                                        loading={isLoadingTag}
                                    >
                                        {dataTag?.data &&
                                            dataTag?.data.map(
                                                (item: any, key: React.Key) => {
                                                    let data = item.tag_name;
                                                    return (
                                                        <Select.Option
                                                            key={key}
                                                            value={data}
                                                            search={data}
                                                        >
                                                            {data}
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                    <Form form={formDynamic}>
                        {dataCustomField &&
                            dataCustomField?.data &&
                            dataCustomField?.data.length > 0 &&
                            dataCustomField?.data.map(
                                (item: any, key: React.Key) => {
                                    let col = 19;
                                    let classNote =
                                        item?.type === "Text Area"
                                            ? "col-label-note"
                                            : "";
                                    let findValue: any =
                                        customFieldsData.filter(
                                            (itemField: any) =>
                                                itemField.field_id === item.id
                                        );

                                    return (
                                        <Row gutter={12} key={key}>
                                            <Col
                                                span={5}
                                                className={`col-label ${classNote}`}
                                            >
                                                {item?.required === "1" && (
                                                    <Typography.Text
                                                        style={{ color: "red" }}
                                                    >
                                                        *
                                                    </Typography.Text>
                                                )}
                                                <Typography.Text>
                                                    {item?.label}
                                                </Typography.Text>
                                            </Col>
                                            <Col span={col}>
                                                <DynamicFields
                                                    data={item}
                                                    customFieldsData={
                                                        customFieldsData
                                                    }
                                                    setCustomFieldsData={
                                                        setCustomFieldsData
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    );
                                }
                            )}
                    </Form>
                </Card>
            ),
        },
        {
            key: "2",
            label: `TIMELINE`,
            children: (
                <Card
                    bordered={false}
                    style={{
                        boxShadow: "none",
                    }}
                >
                    <Row gutter={12}>
                        <Col span={24} className="text-center">
                            <Space>
                                <Typography.Text>Showing : </Typography.Text>
                                <Button
                                    onClick={() =>
                                        handleChangeTimelineKey("All")
                                    }
                                    shape="round"
                                    className={`timeline-btn ${handleGetClassName(
                                        "All"
                                    )}`}
                                >
                                    All
                                </Button>
                                <Button
                                    onClick={() =>
                                        handleChangeTimelineKey("Notes")
                                    }
                                    shape="round"
                                    className={`timeline-btn ${handleGetClassName(
                                        "Notes"
                                    )}`}
                                >
                                    Notes
                                </Button>
                                <Button
                                    onClick={() =>
                                        handleChangeTimelineKey("Emails")
                                    }
                                    shape="round"
                                    className={`timeline-btn ${handleGetClassName(
                                        "Emails"
                                    )}`}
                                >
                                    Emails
                                </Button>
                                <Button
                                    onClick={() =>
                                        handleChangeTimelineKey("Files")
                                    }
                                    shape="round"
                                    className={`timeline-btn ${handleGetClassName(
                                        "Files"
                                    )}`}
                                >
                                    Files
                                </Button>
                                <Button
                                    onClick={() =>
                                        handleChangeTimelineKey("Updates")
                                    }
                                    shape="round"
                                    className={`timeline-btn ${handleGetClassName(
                                        "Updates"
                                    )}`}
                                >
                                    Updates
                                </Button>
                            </Space>
                        </Col>

                        <Col span={24} className="m-t-md">
                            <List
                                header={false}
                                footer={false}
                                bordered={false}
                                dataSource={data}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Space size={15}>
                                            <Image
                                                src={item.user_image}
                                                style={{
                                                    width: 25,
                                                    borderRadius: 100,
                                                }}
                                            />
                                            <Space split={"-"}>
                                                <Typography.Text strong>
                                                    {item.title}
                                                </Typography.Text>
                                                <Typography.Text>
                                                    {item.description}
                                                </Typography.Text>
                                            </Space>
                                        </Space>
                                    </List.Item>
                                )}
                            />
                        </Col>
                    </Row>
                </Card>
            ),
        },
    ];

    const handleFinish = (values: any) => {
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
            id: drawerUpdateData?.id,
            custom_fields: customFieldsData,
        };
        addActivity.mutate(values);
        // console.log("handleFinish", values);
        setDrawerUpdateOpen(false);

        notification.success({
            message: "Success",
            description: "Successfully created",
        });
    };

    const addActivity = useMutation(addActivityMutation, {
        onSuccess: (res) => {
            console.log("success");
            queryClient.invalidateQueries("activities");
            //queryClient.invalidateQueries("contactTypesAll");
            form.resetFields();
            formDynamic.resetFields();
        },
    });

    // useEffect(() => {
    //     console.log("useEffect", customFieldsData);
    //     console.log("useEffect", dataCustomField);
    // }, [customFieldsData]);

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
                                let submit = false;
                                formDynamic
                                    .validateFields()
                                    .then((datas) => {
                                        submit = true;
                                    })
                                    .catch(() => {
                                        submit = false;
                                        notification.warning({
                                            message: "Warning",
                                            description:
                                                "Please fill-up required fields!",
                                        });
                                    });
                                form.validateFields()
                                    .then((values) => {
                                        if (submit) {
                                            handleFinish(values);
                                        }
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
                                {drawerUpdateData?.title}
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
