import React, { useContext, useEffect, useRef, useState } from "react";
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
import { TContact, TCustomFieldValue } from "../../../entities";
import { useAppContextProvider } from "../../../context/AppContext";
import AddAttributePopoverContent from "../../TextTemplates/components/AddAttributePopoverContent";
import { defaultFilter } from "../../../constants";
import { mutateGet } from "../../../api/mutation/useSetupMutation";
import { ENDPOINTS } from "../../../endpoints";
import _ from "lodash";
interface Props {
    handleSubmit: () => void;
    handleCancel?: () => void;
    phoneNumbers?: string[];
    defaultTo?: string;
    defaultFrom?: string;
    contact?: TContact;
}
const TextForm = ({
    handleSubmit,
    handleCancel,
    phoneNumbers,
    contact,
    defaultTo,
    defaultFrom,
}: Props) => {
    const [form] = Form.useForm();
    const [error, setError] = useState("");
    const [isScheduledMessage, setIsScheduledMessage] = useState(false);
    const { user, isLoading } = useLoggedInUser();
    const schedule = Form.useWatch("schedule", form);
    const message = Form.useWatch("message", form);
    const toFormValue = Form.useWatch("to", form);
    const [isTemplatePopoverOpen, setIsTemplatePopoverOpen] = useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const messageTextAreaRef = useRef<HTMLInputElement | null>(null);
    const [isAttributePopoverOpen, setIsAttributePopoverOpen] = useState(false);

    const { isRoleStats } = useAppContextProvider();
    const [selectedContact, setSelectedContact] = useState<
        TContact | undefined
    >(undefined);

    const [contacts, setContacts] = useState<any>();

    const [keyword, setKeyword] = useState<string>("");
    const [isSearchLoading, setIsSearchLoading] = useState(false);

    const { data: filteredContacts, refetch: refetchFilteredContacts } =
        mutateGet(
            { keyword },
            "/api/contacts/global-search",
            "globalSearch",
            () => {
                setIsSearchLoading(false);
            }
        );

    const debouncedSearch = _.debounce((value) => {
        handleSearch(value);
    }, 300);

    const handleSearch = (value) => {
        setKeyword(value);
    };

    useEffect(() => {
        setIsSearchLoading(true);
        refetchFilteredContacts();
    }, [keyword]);

    useEffect(() => {
        if (filteredContacts && filteredContacts.data) {
            setContacts(filteredContacts.data.data);
        }
    }, [filteredContacts]);

    const resetFields = () => {
        setIsFocused(false);
        form.resetFields();
        setError("");
        if (handleCancel) {
            handleCancel();
        }
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

    return (
        <>
            <Form
                name="basic"
                layout="vertical"
                labelWrap
                initialValues={{
                    to: defaultTo
                        ? defaultTo
                        : phoneNumbers
                        ? phoneNumbers[0]
                        : "",
                    from:
                        defaultFrom ??
                        (user?.mobileNumbers
                            ? user?.mobileNumbers[0].mobileNumber
                            : ""),
                }}
                onFinish={onFinish}
                autoComplete="off"
                form={form}
                className="p-t-md"
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
                            {phoneNumbers ? (
                                // <Input disabled />
                                <Select style={{ width: "100%" }}>
                                    {phoneNumbers?.map((number) => (
                                        <Select.Option value={number}>
                                            {number}
                                        </Select.Option>
                                    ))}
                                </Select>
                            ) : (
                                <AutoComplete
                                    options={contacts?.map((option) => ({
                                        value: option.fields?.mobile,
                                        label: (
                                            <Space>
                                                <Typography.Text strong>
                                                    {`${option.fields?.firstName} ${option.fields?.lastName}`}
                                                </Typography.Text>
                                                <Typography.Text>
                                                    {option.fields?.mobile}
                                                </Typography.Text>
                                            </Space>
                                        ),
                                    }))}
                                    style={{ width: "100%" }}
                                    value={toFormValue}
                                    onSearch={(e) => debouncedSearch(e)}
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
                                {user?.mobileNumbers?.map((number) => (
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
                        ref={messageTextAreaRef}
                        autoSize={{ minRows: 2, maxRows: 6 }}
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
                    <Typography.Text>
                        Count: {message?.length ?? 0}
                    </Typography.Text>
                    {contact && (
                        <div>
                            <Popover
                                content={
                                    <AddAttributePopoverContent
                                        handleSelect={(value) => {
                                            let currentMessage =
                                                form.getFieldValue("message");
                                            currentMessage = `${
                                                currentMessage ?? ""
                                            }{{${value.fieldName}}}`;

                                            form.setFieldValue(
                                                "message",
                                                replacePlaceholders(
                                                    currentMessage,
                                                    contact.fields
                                                )
                                            );
                                            setIsAttributePopoverOpen(false);
                                        }}
                                    />
                                }
                                title={
                                    <Button
                                        type="link"
                                        style={{ padding: 0 }}
                                        onClick={() =>
                                            setIsAttributePopoverOpen(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                }
                                trigger={"click"}
                                open={isAttributePopoverOpen}
                            >
                                <Button
                                    type="link"
                                    onClick={() =>
                                        setIsAttributePopoverOpen(true)
                                    }
                                >
                                    Merge Fields <CaretDownOutlined />
                                </Button>
                            </Popover>
                            <Popover
                                content={
                                    <UseTemplatePopover
                                        handleSelect={(value) => {
                                            form.setFieldValue(
                                                "message",
                                                replacePlaceholders(
                                                    value,
                                                    contact.fields
                                                )
                                            );
                                            setIsTemplatePopoverOpen(false);
                                        }}
                                        contact={Object.keys(
                                            contact.fields
                                        ).map((key) => ({
                                            key,
                                            value: contact.fields[key],
                                        }))}
                                    />
                                }
                                title={
                                    <Button
                                        type="link"
                                        style={{ padding: 0 }}
                                        onClick={() =>
                                            setIsTemplatePopoverOpen(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                }
                                trigger={"click"}
                                open={isTemplatePopoverOpen}
                            >
                                <Button
                                    type="link"
                                    onClick={() =>
                                        setIsTemplatePopoverOpen(true)
                                    }
                                >
                                    Use Template <CaretDownOutlined />
                                </Button>
                            </Popover>
                        </div>
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
                        disabled={isRoleStats}
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
                        <Button
                            onClick={() => setIsScheduledMessage(true)}
                            disabled={isRoleStats}
                        >
                            Schedule
                        </Button>
                    </Popover>
                    <Button onClick={resetFields}>Cancel</Button>
                </Space>
            </Form>
        </>
    );
};

export default TextForm;
