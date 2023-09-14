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
    Popover,
    List,
} from "antd";

import { CaretDownOutlined, CloseOutlined } from "@ant-design/icons";
import moment from "moment";

import { useMutation } from "react-query";
import { sendTextMutation } from "../../../api/mutation/useTextMutation";
import queryClient from "../../../queryClient";
import ContactContext from "../../ContactView/context";
import { useLoggedInUser } from "../../../api/query/userQuery";
import Search from "antd/es/input/Search";
import { useTextTemplates } from "../../../api/query/textTemplateQuery";
import { replacePlaceholders } from "../../../helpers";
interface Props {
    handleSubmit: () => void;
    handleCancel: () => void;
}
const TextForm = ({ handleSubmit, handleCancel }: Props) => {
    const [form] = Form.useForm();
    const { contact } = useContext(ContactContext);
    const [error, setError] = useState("");
    const [isScheduledMessage, setIsScheduledMessage] = useState(false);
    const { user, isLoading } = useLoggedInUser();
    const schedule = Form.useWatch("schedule", form);
    const message = Form.useWatch("message", form);
    const [isTemplatePopoverOpen, setIsTemplatePopoverOpen] = useState(false);
    console.log(schedule);
    const resetFields = () => {
        handleCancel();
        form.resetFields();
        setError("");
    };

    const sendText = useMutation(sendTextMutation, {
        onSuccess: () => {
            handleSubmit();
            resetFields();
        },
        onError: (e: any) => {
            setError(e.message || "An error occurred");
        },
    });

    const onFinish = async (values: any) => {
        setError("");
        await sendText.mutate({ ...values, contactId: contact.id });
    };
    const disabledDateAndTime = (current) => {
        const now = moment();
        return (
            current &&
            (current < now.startOf("day") || // Disable past dates
                (current.isSame(now, "day") && current < now)) // Disable past times on the current day
        );
    };

    const scheduleLabel = schedule
        ? moment(schedule.$d).format("MMM D, YYYY h:mm a")
        : "";
    return (
        <Form
            name="basic"
            layout="vertical"
            labelWrap
            initialValues={{
                to: contact.mobile,
                from: user.numbers.length ? user.numbers[0] : null,
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
                            {user.numbers?.map((number, index) => (
                                <Select.Option value={number} key={index}>
                                    {number}
                                </Select.Option>
                            ))}
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

            <Space
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    marginTop: "-20px",
                    marginBottom: "20px",
                }}
            >
                <Typography.Text>Count: {message?.length}</Typography.Text>
                <Popover
                    content={
                        <AddAttributeContent
                            handleSelect={(value) => {
                                form.setFieldValue(
                                    "message",
                                    replacePlaceholders(value, contact)
                                );
                                setIsTemplatePopoverOpen(false);
                            }}
                        />
                    }
                    title={
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={() => setIsTemplatePopoverOpen(false)}
                        >
                            Cancel
                        </Button>
                    }
                    trigger={"click"}
                    open={isTemplatePopoverOpen}
                >
                    <Button
                        type="link"
                        onClick={() => setIsTemplatePopoverOpen(true)}
                    >
                        Use Template <CaretDownOutlined />
                    </Button>
                </Popover>
            </Space>

            {error ? (
                <center>
                    <Typography.Text style={{ color: "red" }}>
                        {error}
                    </Typography.Text>
                </center>
            ) : null}

            {schedule ? (
                <center>
                    <Typography.Text>
                        {`This text will be sent on ${scheduleLabel}`}
                    </Typography.Text>
                </center>
            ) : null}

            <Space style={{ paddingTop: "5px" }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={sendText.isLoading}
                >
                    Send
                </Button>
                <Popover
                    content={
                        <Form.Item name="schedule" label="Time & Date">
                            <DatePicker
                                showTime
                                showNow={false}
                                onOk={() => setIsScheduledMessage(false)}
                                disabledDate={disabledDateAndTime}
                                format="MMMM D, YYYY h:mm A"
                            />
                        </Form.Item>
                    }
                    title={
                        <Button
                            type="link"
                            onClick={() => {
                                form.setFieldValue("schedule", null);
                                setIsScheduledMessage(false);
                            }}
                            style={{ padding: 0 }}
                        >
                            Cancel
                        </Button>
                    }
                    placement="topRight"
                    visible={isScheduledMessage}
                >
                    <Button onClick={() => setIsScheduledMessage(true)}>
                        Schedule
                    </Button>
                </Popover>
                <Button onClick={resetFields}>Cancel</Button>
            </Space>
        </Form>
    );
};

const AddAttributeContent = ({ handleSelect }) => {
    const { templates, isLoading } = useTextTemplates();
    const { contact } = useContext(ContactContext);
    return (
        <Space direction="vertical" size={"large"}>
            <Search placeholder="Search" />

            <List
                dataSource={templates?.filter(
                    (template) => !template.deleted_at
                )}
                style={{ maxHeight: "200px", overflowY: "auto" }}
                renderItem={(item) => (
                    <div
                        style={{
                            cursor: "pointer", // Add pointer cursor
                            backgroundColor: "white", // Set the default background color
                            padding: "8px",

                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "blue";
                            e.currentTarget.style.color = "white"; // Change background color on hover
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "white";
                            e.currentTarget.style.color = "black"; // Restore default background color on hover out
                        }}
                        onClick={() => {
                            handleSelect(item.textMessage);
                        }}
                    >
                        <Typography.Text strong style={{ color: "inherit" }}>
                            {item.name}
                        </Typography.Text>

                        <Popover
                            content={
                                <Typography.Text>
                                    {replacePlaceholders(
                                        item.textMessage,
                                        contact
                                    )}
                                </Typography.Text>
                            }
                            trigger={"hover"}
                        >
                            <Button
                                type="link"
                                style={{ padding: 0, color: "inherit" }}
                                onClick={() => {
                                    // setTemplateFolder(undefined);
                                    // setIsCreateFolderModalOpen(true);
                                }}
                            >
                                Preview
                            </Button>
                        </Popover>
                    </div>
                )}
            />
        </Space>
    );
};

export default TextForm;
