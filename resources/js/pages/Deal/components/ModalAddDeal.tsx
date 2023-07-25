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
    notification,
    InputNumber,
} from "antd";

import {
    AuditOutlined,
    CloseOutlined,
    ContainerOutlined,
    DownOutlined,
    FilterOutlined,
    GroupOutlined,
    InsertRowBelowOutlined,
    MobileOutlined,
    PhoneOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";

import Title from "antd/es/skeleton/Title";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import { useMutation, useQueryClient } from "react-query";
import { useDealMutation } from "../../../api/mutation/useDealMutation";
import { useContactsAll } from "../../../api/query/contactsQuery";

interface Props {
    isModalOpenAdd: boolean;
    handleOkAdd: () => void;
    handleCancelAdd: () => void;
    showModalAddDealValue?: string;
}

const ModalAddDeal = ({
    isModalOpenAdd,
    handleOkAdd,
    handleCancelAdd,
    showModalAddDealValue,
}: Props) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { contacts, isLoading } = useContactsAll();
    const [form] = useForm();
    const onFinish = (values: any) => {
        mutation.mutate({
            ...values,
            estimated_close_date:
                values.estimated_close_date.format("YYYY-MM-DD"),
        });
    };

    const mutation = useMutation(useDealMutation, {
        onSuccess: (res) => {
            // navigate("/users"); // Redirect to the users list page after successful submission
            if (res.success) {
                notification.success({
                    message: "Deal",
                    description: "Successfully Added",
                });
                handleOkAdd();
            }
        },
    });

    const calendar = useRef();

    useEffect(() => {
        if (showModalAddDealValue) {
            form.setFieldsValue({
                stage: showModalAddDealValue,
            });
        }
    }, [showModalAddDealValue]);

    return (
        <Modal
            className="modal-activity"
            open={isModalOpenAdd}
            onCancel={handleCancelAdd}
            width={980}
            footer={null}
            title={null}
            closable={false}
            // footer={[
            //     <Button type="primary">Save</Button>,
            //     <Button type="primary">Save and add other</Button>,
            //     <Button>Cancel</Button>,
            // ]}
        >
            <Form
                form={form}
                layout="vertical"
                name="basic"
                labelAlign="left"
                labelWrap
                onFinish={onFinish}
                autoComplete="off"
            >
                <div className="modal-header">
                    <Typography.Title level={5} style={{ color: "white" }}>
                        Add New Deal
                    </Typography.Title>
                    <Button
                        type="link"
                        style={{ marginRight: "-559px", color: "white" }}
                    >
                        {" "}
                        <u>Manage Fields</u>
                    </Button>
                    <Button
                        onClick={handleCancelAdd}
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            border: "0px",
                        }}
                        icon={<CloseOutlined style={{ color: "white" }} />}
                    />
                </div>
                <Row gutter={12}>
                    <Col md={16} className="col-1-modal-act">
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: "this is required",
                                },
                            ]}
                        >
                            <Input placeholder="Title" />
                        </Form.Item>

                        <Row gutter={24}>
                            <Col md={12}>
                                <Form.Item
                                    label="Contact"
                                    name="contactId"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select style={{ width: "100%" }}>
                                        {contacts?.map((contact) => {
                                            return (
                                                <Select.Option
                                                    value={contact.id}
                                                    key={contact.id}
                                                >
                                                    {contact.firstName +
                                                        " " +
                                                        contact.lastName}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Win Probability"
                                    name="win_probability"
                                >
                                    <Input
                                        placeholder="Win Probability"
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Owner"
                                    name="owner"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Owner">
                                        <Select.Option value="Jesse Admin">
                                            Jesse Admin
                                        </Select.Option>
                                        <Select.Option value="Jesse Ashley">
                                            Jesse Ashley
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Estimated Close Date"
                                    name="estimated_close_date"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        style={{ width: "100%" }}
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item label="Value" name="value">
                                    <InputNumber placeholder="Value" />
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Currency"
                                    name="currency"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Currency">
                                        <Select.Option value="USD">
                                            USD
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Pipeline"
                                    name="pipeline"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Pipeline">
                                        <Select.Option value="ACQ">
                                            ACQ
                                        </Select.Option>
                                        <Select.Option value="Referrals">
                                            Marketing
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Stage"
                                    name="stage"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Stage">
                                        <Select.Option value="Comp & Qualify">
                                            Comp & Qualify
                                        </Select.Option>
                                        <Select.Option value="First Offer Given">
                                            First Offer Given
                                        </Select.Option>
                                        <Select.Option value="In Negotiation">
                                            In Negotiation
                                        </Select.Option>
                                        <Select.Option value="Verbal Offer Accepted">
                                            Verbal Offer Accepted
                                        </Select.Option>
                                        <Select.Option value="Under Contract">
                                            Under Contract
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Source"
                                    name="source"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Source">
                                        <Select.Option value="ADS">
                                            ADS
                                        </Select.Option>
                                        <Select.Option value="Referrals">
                                            Referrals
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Priority"
                                    name="priority"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Priority">
                                        <Select.Option value="High">
                                            High
                                        </Select.Option>
                                        <Select.Option value="Medium">
                                            Medium
                                        </Select.Option>
                                        <Select.Option value="Low">
                                            Low
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col md={12}>
                                <Form.Item
                                    label="Status"
                                    name="status"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Status">
                                        <Select.Option value="Open">
                                            Open
                                        </Select.Option>
                                        <Select.Option value="Won">
                                            Won
                                        </Select.Option>
                                        <Select.Option value="Lost">
                                            Lost
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={24} style={{ marginBottom: 15 }}>
                                <b>Details</b>
                            </Col>

                            <Col md={24}>
                                <Form.Item label="Details" name="details">
                                    <TextArea></TextArea>
                                </Form.Item>
                            </Col>
                            <Col md={24}>
                                <Form.Item label="Tags" name="tags">
                                    <Input placeholder="Tags" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col
                        md={8}
                        style={{ padding: 20 }}
                        className="col-2-modal-act"
                    >
                        <Row>
                            <Col md={24}>
                                <div
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Teamm mates
                                </div>
                                <Input placeholder="Search User" />
                            </Col>
                            <Col md={24}>
                                <div
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Participants
                                </div>
                                <Input placeholder="Search Contact" />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className="modal-footer">
                    <Button className="m-r-xs" type="primary" htmlType="submit">
                        Save
                    </Button>
                    <Button className="m-r-xs" type="primary">
                        Save and add other
                    </Button>
                    <Button onClick={handleCancelAdd}>Cancel</Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ModalAddDeal;
