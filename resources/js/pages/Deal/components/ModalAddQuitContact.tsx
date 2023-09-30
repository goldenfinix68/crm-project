import React from "react";
import { Button, Col, Input, Modal, Row, Typography, Form, Select } from "antd";

import { CloseOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { useUsersList } from "../../../api/query/activityQuery";
import { addContactMutation } from "../../../api/mutation/useContactMutation";
interface Props {
    isModalOpenContact: boolean;
    handleOkContact: () => void;
    handleCancelContact: () => void;
    dealId: string;
}

const ModalAddQuitContact = ({
    isModalOpenContact,
    handleOkContact,
    handleCancelContact,
    dealId,
}: Props) => {
    const [form] = Form.useForm();
    const { dataUsers, isLoadingUsers } = useUsersList();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const addContact = useMutation(addContactMutation, {
        onSuccess: () => {
            console.log("success");
            queryClient.invalidateQueries("contacts");
            //queryClient.invalidateQueries("contactTypesAll");
            form.resetFields();

            handleCancelContact();

            // queryClient.invalidateQueries("contacts");
        },
    });

    const onFinish = (values: any) => {
        addContact.mutate(values);
    };

    return (
        <Modal
            className="modal-activity"
            open={isModalOpenContact}
            onCancel={handleCancelContact}
            width={500}
            footer={null}
            title={null}
            closable={false}
            style={{ maxHeight: "700px" }}
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
                        Quick Add Contact
                    </Typography.Title>

                    <Button
                        onClick={handleCancelContact}
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            border: "0px",
                        }}
                        icon={<CloseOutlined style={{ color: "white" }} />}
                    />
                </div>
                <div
                    className="modal-content"
                    style={{ padding: 20, marginBottom: 20 }}
                >
                    <Row gutter={24} className="m-t-md">
                        <Col md={24} xs={24}>
                            <Form.Item
                                name="firstName"
                                label="First Name"
                                rules={[
                                    {
                                        required: true,
                                        message: "required",
                                    },
                                ]}
                            >
                                <Input placeholder="First Name" />
                            </Form.Item>
                        </Col>
                        <Col md={24} xs={24}>
                            <Form.Item
                                name="lastName"
                                label="Last Name"
                                rules={[
                                    {
                                        required: true,
                                        message: "required",
                                    },
                                ]}
                            >
                                <Input placeholder="Last Name" />
                            </Form.Item>
                        </Col>

                        <Col md={24} xs={24}>
                            <Form.Item name="phone" label="Phone">
                                <Input placeholder="Phone" />
                            </Form.Item>
                        </Col>

                        <Col md={24} xs={24}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        type: "email",
                                    },
                                ]}
                            >
                                <Input placeholder="Email 2" />
                            </Form.Item>
                        </Col>

                        <Col md={24} xs={24}>
                            <Form.Item
                                name="ownerId"
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
                                        dataUsers?.data.map(
                                            (item: any, key: any) => {
                                                return (
                                                    <Select.Option
                                                        key={key}
                                                        value={item.id}
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

                        <Col md={24} xs={24}>
                            <Form.Item label="Flood Zone" name={"flood_zone"}>
                                <Select
                                    style={{ width: "100%" }}
                                    options={[
                                        {
                                            value: "yes",
                                            label: "Yes",
                                        },
                                        {
                                            value: "no",
                                            label: "No",
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <div className="modal-footer">
                    <Button className="m-r-xs" type="primary" htmlType="submit">
                        Save
                    </Button>

                    <Button onClick={handleCancelContact}>Cancel</Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ModalAddQuitContact;
