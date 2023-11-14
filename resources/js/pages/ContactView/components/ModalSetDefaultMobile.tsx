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
} from "antd";

import { CloseOutlined } from "@ant-design/icons";

import { useMutation } from "react-query";
import { updateContactMutation } from "../../../api/mutation/useContactMutation";
import { TContact } from "../../../entities";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { useLoggedInUser } from "../../../api/query/userQuery";
import queryClient from "../../../queryClient";
interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
    handleSubmit?: () => void;
    contact: TContact;
}
const ModalSetDefaultMobile = ({
    isModalOpen,
    closeModal,
    handleSubmit,
    contact,
}: Props) => {
    const [form] = Form.useForm();
    const { user, isLoading: isLogginUserLoading } = useLoggedInUser();

    const updateContact = useMutation(updateContactMutation, {
        onSuccess: () => {
            resetFields();
            queryClient.invalidateQueries("getContact");
        },
    });

    const onFinish = async (values: any) => {
        console.log(values);
        await updateContact.mutate({ ...values, id: contact.id });
    };
    const resetFields = () => {
        closeModal();
        form.resetFields();
    };
    useEffect(() => {
        if (contact.defaultMobileNumber) {
            form.setFieldValue(
                "defaultMobileNumber",
                contact.defaultMobileNumber
            );
        } else {
            form.resetFields();
        }
    }, [contact]);
    return (
        <Modal
            className="modal-activity"
            open={isModalOpen}
            onCancel={closeModal}
            footer={null}
            title={null}
            closable={false}
        >
            <div className="modal-header">
                <Typography.Title level={5} style={{ color: "white" }}>
                    Set default mobile number for contacting this contact
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
                style={{ padding: "20px", width: "100%", paddingTop: "30px" }}
                size={0}
            >
                <Form
                    name="basic"
                    layout="vertical"
                    labelWrap
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                    initialValues={{ columnLayout: "one" }}
                >
                    <Form.Item
                        name="defaultMobileNumber"
                        label="Mobile number"
                        rules={[
                            {
                                required: true,
                                message: DEFAULT_REQUIRED_MESSAGE,
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

                    <Space style={{ paddingTop: "5px" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={updateContact.isLoading}
                        >
                            Save
                        </Button>

                        <Button onClick={resetFields}>No</Button>
                    </Space>
                </Form>
            </Space>
        </Modal>
    );
};

export default ModalSetDefaultMobile;
