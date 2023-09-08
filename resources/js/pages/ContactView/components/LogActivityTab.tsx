import {
    Button,
    Mentions,
    Form,
    Space,
    Col,
    DatePicker,
    Input,
    Row,
    Select,
    notification,
} from "antd";
import React, { useContext } from "react";
import moment from "moment";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { useContactAddActivityLog } from "../../../api/mutation/useContactMutation";
import { useMutation } from "react-query";
import ContactContext from "../context";
import { useUsersList } from "../../../api/query/activityQuery";
import queryClient from "../../../queryClient";

const LogActivityTab = () => {
    const { dataUsers, isLoadingUsers } = useUsersList();
    const { contact } = useContext(ContactContext);
    const [form] = Form.useForm();

    const mutation = useMutation(useContactAddActivityLog, {
        onSuccess: (res) => {
            // navigate("/users"); // Redirect to the users list page after successful submission

            notification.success({
                message: "Contact",
                description: "Updated Successfully",
            });
            form.resetFields();
            queryClient.invalidateQueries("getContact");
        },
    });

    const handleFinish = (values: any) => {
        mutation.mutate({
            ...values,
            contact_id: contact.id,
            start_date: values.dateTime[0].format("YYYY-MM-DD HH:mm:ss"),
            end_date: values.dateTime[1].format("YYYY-MM-DD HH:mm:ss"),
        });
    };
    return (
        <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign="left"
            labelWrap
            initialValues={{
                type: "call",
                availability: "busy",
                outcome: "No Answer",
            }}
            onFinish={handleFinish}
            autoComplete="off"
            form={form}
        >
            <Form.Item
                label="Title"
                name="title"
                rules={[
                    {
                        required: true,
                        message: DEFAULT_REQUIRED_MESSAGE,
                    },
                ]}
            >
                <Input placeholder="Write Activity Title" />
            </Form.Item>
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
                    <Select.Option value="Call">Call</Select.Option>
                    <Select.Option value="Task">Task</Select.Option>
                    <Select.Option value="Meeting">Meeting</Select.Option>
                    <Select.Option value="Demo">Demo</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="Outcome"
                name="outcome"
                rules={[
                    {
                        required: true,
                        message: "this is required",
                    },
                ]}
            >
                <Select>
                    <Select.Option value="No Answer">No Answer</Select.Option>
                    <Select.Option value="Busy">Busy</Select.Option>
                    <Select.Option value="Wrong Number">
                        Wrong Number
                    </Select.Option>
                    <Select.Option value="Left Voicemail">
                        Left Voicemail
                    </Select.Option>
                    <Select.Option value="Connected">Connected</Select.Option>
                    <Select.Option value="Call Me Again">
                        Call Me Again
                    </Select.Option>
                    <Select.Option value="Missed">Missed</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Date & Time"
                name="dateTime"
                rules={[
                    {
                        required: true,
                        message: "this is required",
                    },
                ]}
            >
                <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
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
            <Col md={24} xs={24}>
                <Form.Item
                    name="owner"
                    label="Owner"
                    rules={[
                        {
                            required: true,
                            message: "this is required",
                        },
                    ]}
                >
                    <Select style={{ width: "100%" }}>
                        {dataUsers &&
                            dataUsers?.data &&
                            dataUsers?.data.map((item: any, key: any) => {
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

            <Row gutter={12}>
                <Col md={12}>
                    <Form.Item
                        label="Link Records"
                        name="link_deal"
                        rules={[
                            {
                                required: true,
                                message: "this is required",
                            },
                        ]}
                    >
                        <Input placeholder="Deal" />
                    </Form.Item>
                </Col>
                <Col md={12}>
                    <Form.Item
                        label={null}
                        name="link_contact"
                        rules={[
                            {
                                required: true,
                                message: "this is required",
                            },
                        ]}
                    >
                        <Input placeholder="Contact" />
                    </Form.Item>
                </Col>
            </Row>

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
            <Form.Item style={{ float: "right" }}>
                <Space>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button type="default" onClick={() => form.resetFields()}>
                        Cancel
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default LogActivityTab;
