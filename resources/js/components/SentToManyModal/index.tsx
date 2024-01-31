import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Button,
    Modal,
    Space,
    Typography,
    Form,
    Select,
    Avatar,
    Radio,
    Input,
    DatePicker,
    InputNumber,
    Row,
    Col,
    Checkbox,
    TimePicker,
    Popover,
    Tooltip,
    Dropdown,
    Menu,
    List,
} from "antd";

import {
    CaretDownOutlined,
    CloseOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { DEFAULT_REQUIRED_MESSAGE } from "../../constants";
import moment from "moment-timezone";
import { TContact, TWorkflow } from "../../entities";
import UseTemplatePopover from "../UseTemplatePopover";
import { replacePlaceholders, spinContent } from "../../helpers";
import { useMutation } from "react-query";
import { createWorkflowMutation } from "../../api/mutation/useWorkflowMutation";
import queryClient from "../../queryClient";
import AddAttributePopoverContent from "../../pages/TextTemplates/components/AddAttributePopoverContent";
import { useAppContextProvider } from "../../context/AppContext";

interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
    contacts: {
        [key: string]: any;
    }[];
}
const SendToManyModal = ({ isModalOpen, closeModal, contacts }: Props) => {
    const colors = ["#FF5733", "#00AC7C", "#3498DB", "#E74C3C", "#9B59B6"];
    return (
        <Modal
            className="your-modal"
            open={isModalOpen}
            onCancel={closeModal}
            footer={null}
            title={null}
            closable={false}
            width={600}
        >
            <div className="modal-header">
                <Typography.Title level={5} style={{ color: "white" }}>
                    Add to Campaign / Workflow
                </Typography.Title>

                <Button
                    onClick={closeModal}
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        border: "0px",
                    }}
                    icon={<CloseOutlined style={{ color: "white" }} />}
                />
            </div>
            <Space
                direction="vertical"
                style={{ padding: "20px", width: "100%", paddingTop: "50px" }}
                size={"large"}
            >
                <Space direction="vertical" style={{ width: "100%" }}>
                    <Typography.Title level={4}>
                        Add the following contacts
                    </Typography.Title>
                    <Space
                        style={{
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {contacts.map((contact, index) => (
                            <Avatar
                                key={index}
                                style={{
                                    backgroundColor: colors[index % 5],
                                    verticalAlign: "middle",
                                }}
                            >
                                {contact?.firstName?.charAt(0)}
                            </Avatar>
                        ))}
                    </Space>
                </Space>
                <ModalForm closeModal={closeModal} contacts={contacts} />
            </Space>
        </Modal>
    );
};

const ModalForm = ({
    closeModal,
    contacts,
}: {
    closeModal: () => void;
    contacts: {
        [key: string]: any;
    }[];
}) => {
    const [form] = Form.useForm();
    const message = Form.useWatch("message", form);
    const allSpunVariations = spinContent(message);

    const { contactFields } = useAppContextProvider();
    // const timezoneOptions = moment.tz.names().map((tz) => (
    //     <Select.Option key={tz} value={tz}>
    //         {tz}
    //     </Select.Option>
    // ));

    const createWorkflow = useMutation(createWorkflowMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("textTemplates");
            closeModal();
            form.resetFields();
            form.setFieldsValue({
                type: "drip",
                repeatAfterType: "days",
                sendOn: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                ],
            });
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const onFinish = async (values: any) => {
        // setError("");
        const contactIds = contacts?.map((contact) => contact.contactId);
        const now = new Date();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const startOn = values.startOn.format("YYYY-MM-DD");
        const startFrom = values.startFrom.format("HH:mm:ss");
        const endsAt = values.endsAt.format("HH:mm:ss");
        await createWorkflow.mutate({
            ...values,
            ...{ contactIds, startOn, startFrom, endsAt, timezone },
        });
    };

    const disabledDate = (current) => {
        // Disable dates that are before today
        return current && current < moment().startOf("day");
    };
    return (
        <Form
            name="basic"
            layout="vertical"
            labelWrap
            initialValues={{
                type: "drip",
                repeatAfterType: "days",
                sendOn: [1, 2, 3, 4, 5],
            }}
            onFinish={onFinish}
            autoComplete="off"
            form={form}
        >
            <Form.Item
                name="type"
                rules={[
                    {
                        required: true,
                        message: DEFAULT_REQUIRED_MESSAGE,
                    },
                ]}
            >
                <Radio.Group>
                    <Radio disabled value="allAtOnce">
                        Add all at once
                    </Radio>
                    <Radio disabled value="scheduled">
                        Add all at scheduled time
                    </Radio>
                    <Radio value="drip">Add in drip mode</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                name="phoneTypeCustomFieldId"
                label="Destination Phone Number"
                rules={[
                    {
                        required: true,
                        message: DEFAULT_REQUIRED_MESSAGE,
                    },
                ]}
            >
                <Select className="w-100">
                    {contactFields
                        .filter(
                            (field) =>
                                field.type == "phone" || field.type == "mobile"
                        )
                        .map((field) => (
                            <Select.Option value={field.id}>
                                {field.label}
                            </Select.Option>
                        ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="action"
                label="Action"
                rules={[
                    {
                        required: true,
                        message: DEFAULT_REQUIRED_MESSAGE,
                    },
                ]}
            >
                <Input placeholder="Enter a description for the action (to be shown in tracking report)" />
            </Form.Item>

            {/* <Form.Item
                name="timezone"
                label="Timezone"
                rules={[
                    {
                        required: true,
                        message: DEFAULT_REQUIRED_MESSAGE,
                    },
                ]}
            >
                <Select showSearch className="w-100">
                    {timezoneOptions}
                </Select>
            </Form.Item> */}

            <Form.Item
                name="startOn"
                label="Start on"
                rules={[
                    {
                        required: true,
                        message: DEFAULT_REQUIRED_MESSAGE,
                    },
                ]}
            >
                <DatePicker
                    className="w-100"
                    format="YYYY-MM-DD"
                    disabledDate={disabledDate}
                />
            </Form.Item>

            <Form.Item
                name="batchQuantity"
                label="Batch Quantity"
                rules={[
                    {
                        required: true,
                        message: DEFAULT_REQUIRED_MESSAGE,
                    },
                ]}
            >
                <InputNumber className="w-100" />
            </Form.Item>

            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        label="Repeat After"
                        name="repeatAfter"
                        rules={[
                            {
                                required: true,
                                message: DEFAULT_REQUIRED_MESSAGE,
                            },
                        ]}
                    >
                        <InputNumber className="w-100" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="repeatAfterType"
                        label=" "
                        rules={[
                            {
                                required: true,
                                message: DEFAULT_REQUIRED_MESSAGE,
                            },
                        ]}
                    >
                        <Select className="w-100">
                            <Select.Option value="days">Days</Select.Option>
                            <Select.Option value="hours">Hours</Select.Option>
                            <Select.Option value="minutes">
                                Minutes
                            </Select.Option>
                            <Select.Option value="seconds">
                                Seconds
                            </Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="sendOn"
                label="Send On"
                rules={[
                    {
                        required: true,
                        message: DEFAULT_REQUIRED_MESSAGE,
                    },
                ]}
            >
                <Checkbox.Group
                    options={[
                        { label: "Monday", value: 1 },
                        { label: "Tuesday", value: 2 },
                        { label: "Wednesday", value: 3 },
                        { label: "Thursday", value: 4 },
                        { label: "Friday", value: 5 },
                        { label: "Saturday", value: 6 },
                        { label: "Sunday", value: 0 },
                    ]}
                />
            </Form.Item>

            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        label="Start From"
                        name="startFrom"
                        rules={[
                            {
                                required: true,
                                message: DEFAULT_REQUIRED_MESSAGE,
                            },
                        ]}
                    >
                        <TimePicker className="w-100" format="HH:mm:ss" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Ends At"
                        name="endsAt"
                        rules={[
                            {
                                required: true,
                                message: DEFAULT_REQUIRED_MESSAGE,
                            },
                        ]}
                    >
                        <TimePicker className="w-100" format="HH:mm:ss" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="message"
                label={
                    <>
                        Message
                        <Tooltip
                            title='You can use content spinner using "[" and "]". E.g. My [green|blue|yellow] bird is sitting [there|overthere|on the ground].
'
                        >
                            <InfoCircleOutlined
                                className="m-l-sm"
                                type="default"
                            />
                        </Tooltip>
                    </>
                }
                rules={[
                    {
                        required: true,
                        message: DEFAULT_REQUIRED_MESSAGE,
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

                <Dropdown.Button
                    overlay={
                        <Menu>
                            <Menu.Item key="1">
                                <Popover
                                    content={
                                        <AddAttributePopoverContent
                                            handleSelect={(value) => {
                                                const currentMessage =
                                                    form.getFieldValue(
                                                        "message"
                                                    );
                                                form.setFieldValue(
                                                    "message",
                                                    `${currentMessage ?? ""}{{${
                                                        value.fieldName
                                                    }}}`
                                                );
                                            }}
                                        />
                                    }
                                    trigger={"click"}
                                >
                                    Merge Fields
                                </Popover>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Popover
                                    content={
                                        <UseTemplatePopover
                                            handleSelect={(value) => {
                                                form.setFieldValue(
                                                    "message",
                                                    value
                                                );
                                            }}
                                            contact={contacts}
                                        />
                                    }
                                    trigger={"click"}
                                >
                                    Text Template
                                </Popover>
                            </Menu.Item>
                            {allSpunVariations?.length ? (
                                <Menu.Item key="3">
                                    <Popover
                                        content={
                                            <div>
                                                <p>Original: {message}</p>
                                                <p>
                                                    All Possible Spun
                                                    Variations:
                                                </p>
                                                <List
                                                    dataSource={
                                                        allSpunVariations
                                                    }
                                                    renderItem={(
                                                        item: any,
                                                        index
                                                    ) => (
                                                        <List.Item key={index}>
                                                            {item}
                                                        </List.Item>
                                                    )}
                                                />
                                            </div>
                                        }
                                        trigger={"click"}
                                    >
                                        Content Spinner Preview
                                    </Popover>
                                </Menu.Item>
                            ) : null}
                        </Menu>
                    }
                >
                    Tools
                </Dropdown.Button>
            </Space>

            <Form.Item
                name="phoneFieldStatus"
                label="Phone Field Status"
                rules={[
                    {
                        required: true,
                        message: DEFAULT_REQUIRED_MESSAGE,
                    },
                ]}
            >
                <Select className="w-100">
                    <Select.Option value="badNumber">Bad Number</Select.Option>
                    <Select.Option value="smsSent">SMS Sent</Select.Option>
                </Select>
            </Form.Item>

            <Space style={{ paddingTop: "5px" }}>
                <Button onClick={closeModal}>Cancel</Button>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={createWorkflow.isLoading}
                >
                    Add to Campaign / Workflow
                </Button>
            </Space>
        </Form>
    );
};

export default SendToManyModal;
