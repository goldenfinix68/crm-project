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
    AutoComplete,
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
import UseTemplatePopover from "../../../components/UseTemplatePopover";
import { TContact } from "../../../entities";
import { useAppContextProvider } from "../../../context/AppContext";
interface Props {
    handleSubmit: () => void;
    handleCancel: () => void;
    to?: string;
    contact?: TContact;
}
const TextForm = ({ handleSubmit, handleCancel, to, contact }: Props) => {
    const [form] = Form.useForm();
    const [error, setError] = useState("");
    const [isScheduledMessage, setIsScheduledMessage] = useState(false);
    const { user, isLoading } = useLoggedInUser();
    const schedule = Form.useWatch("schedule", form);
    const message = Form.useWatch("message", form);
    const toFormValue = Form.useWatch("to", form);
    const [isTemplatePopoverOpen, setIsTemplatePopoverOpen] = useState(false);

    const { contacts } = useAppContextProvider();

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
        await sendText.mutate(values);
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

    const filteredOptions = contacts?.filter((contact) =>
        contact?.mobile?.includes(
            toFormValue ? toFormValue.replace(/[-\s+_]/g, "") : ""
        )
    );
    return (
        <Form
            name="basic"
            layout="vertical"
            labelWrap
            initialValues={{
                to: to,
                from: contact?.defaultMobileNumber
                    ? contact?.defaultMobileNumber.mobileNumber
                    : null,
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
                        {to ? (
                            <Input disabled />
                        ) : (
                            <AutoComplete
                                options={filteredOptions?.map((option) => ({
                                    value: option.mobile,
                                    label: (
                                        <Space>
                                            <Typography.Text strong>
                                                {`${option.firstName} ${option.lastName}`}
                                            </Typography.Text>
                                            <Typography.Text>
                                                {option.mobile}
                                            </Typography.Text>
                                        </Space>
                                    ),
                                }))}
                                style={{ width: "100%" }}
                                value={toFormValue}
                            >
                                <Input
                                    // mask="+1 000-000-0000"
                                    value={toFormValue}
                                />
                            </AutoComplete>
                        )}
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
                            {user?.numbers?.map((number) => (
                                <Select.Option
                                    value={number.mobileNumber}
                                    key={number.id}
                                >
                                    {number.mobileNumber}
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
                {contact && (
                    <Popover
                        content={
                            <UseTemplatePopover
                                handleSelect={(value) => {
                                    form.setFieldValue(
                                        "message",
                                        replacePlaceholders(value, contact)
                                    );
                                    setIsTemplatePopoverOpen(false);
                                }}
                                contact={contact}
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
                )}
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

export default TextForm;
