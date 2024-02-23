import React, { useEffect, useState } from "react";
import {
    Button,
    Typography,
    Card,
    Divider,
    Row,
    message,
    Space,
    Input,
    Modal,
    Select,
    Form,
    Checkbox,
    Col,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useMutation } from "react-query";
import { bulkImportGSheet } from "../../../api/mutation/useContactMutation";
import { useNavigate } from "react-router-dom";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import queryClient from "../../../queryClient";
import validateRules from "../../../providers/validateRules";
import { gSheetCrawl } from "../../../api/query/importDataQuery";
import { useAppContextProvider } from "../../../context/AppContext";

const RoorDataMapping: React.FC = () => {
    const [form] = Form.useForm();
    const { data: crawl, isLoading } = gSheetCrawl();
    const { contactFields } = useAppContextProvider();

    const save = useMutation(bulkImportGSheet, {
        onSuccess: () => {
            queryClient.invalidateQueries("contacts");
            queryClient.invalidateQueries("filteredContacts");
            message.success("Crawl is queued.");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });
    const onFinish = async (values: any) => {
        await save.mutate({
            ...values,
        });
    };

    useEffect(() => {
        if (crawl?.id) {
            form.setFieldValue("gSheedId", crawl.gSheetId);
            form.setFieldValue("interval", crawl.interval);
            form.setFieldValue("isAddToQueue", true);
        }
    }, [crawl]);

    const ContactFieldSelect = () => (
        <Select showSearch className="w-100" allowClear>
            {contactFields?.map((field, index) => (
                <Select.Option value={field.id} key={index}>
                    {field.label}
                </Select.Option>
            ))}
        </Select>
    );
    return (
        <Space direction="vertical">
            <Card>
                <Typography.Title level={3}>Roor data mapping</Typography.Title>
                <Typography className="m-b-sm">
                    Now, you have the capability to effortlessly import contacts
                    directly from a Google Sheet. Additionally, you have the
                    flexibility to set the frequency at which our system crawls
                    the spreadsheet, ensuring seamless updates to your account
                    by identifying and adding any new contacts as needed.
                </Typography>
                <Button
                    type="link"
                    className="p-0"
                    onClick={() => console.log(true)}
                >
                    Learn more about how to import contacts into Roor.
                </Button>
                <Divider />
                <Form
                    name="basic"
                    layout="vertical"
                    labelWrap
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="First Name"
                                name="firstName"
                                rules={[
                                    {
                                        required: true,
                                        message: DEFAULT_REQUIRED_MESSAGE,
                                    },
                                ]}
                            >
                                <ContactFieldSelect />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Last Name"
                                name="lastName"
                                rules={[
                                    {
                                        required: true,
                                        message: DEFAULT_REQUIRED_MESSAGE,
                                    },
                                ]}
                            >
                                <ContactFieldSelect />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: DEFAULT_REQUIRED_MESSAGE,
                                    },
                                ]}
                            >
                                <ContactFieldSelect />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Phone"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: DEFAULT_REQUIRED_MESSAGE,
                                    },
                                ]}
                            >
                                <ContactFieldSelect />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="Phone1"
                                name="phone1"
                                rules={[
                                    {
                                        required: true,
                                        message: DEFAULT_REQUIRED_MESSAGE,
                                    },
                                ]}
                            >
                                <ContactFieldSelect />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Phone2"
                                name="phone2"
                                rules={[
                                    {
                                        required: true,
                                        message: DEFAULT_REQUIRED_MESSAGE,
                                    },
                                ]}
                            >
                                <ContactFieldSelect />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="Phone3"
                                name="phone3"
                                rules={[
                                    {
                                        required: true,
                                        message: DEFAULT_REQUIRED_MESSAGE,
                                    },
                                ]}
                            >
                                <ContactFieldSelect />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Phone4"
                                name="phone4"
                                rules={[
                                    {
                                        required: true,
                                        message: DEFAULT_REQUIRED_MESSAGE,
                                    },
                                ]}
                            >
                                <ContactFieldSelect />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="City"
                                name="city"
                                rules={[
                                    {
                                        required: true,
                                        message: DEFAULT_REQUIRED_MESSAGE,
                                    },
                                ]}
                            >
                                <ContactFieldSelect />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="State"
                                name="state"
                                rules={[
                                    {
                                        required: true,
                                        message: DEFAULT_REQUIRED_MESSAGE,
                                    },
                                ]}
                            >
                                <ContactFieldSelect />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="Zip"
                                name="zip"
                                rules={[
                                    {
                                        required: true,
                                        message: DEFAULT_REQUIRED_MESSAGE,
                                    },
                                ]}
                            >
                                <ContactFieldSelect />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Notes"
                                name="notes"
                                rules={[
                                    {
                                        required: true,
                                        message: DEFAULT_REQUIRED_MESSAGE,
                                    },
                                ]}
                            >
                                <ContactFieldSelect />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Space>
    );
};
export default RoorDataMapping;
