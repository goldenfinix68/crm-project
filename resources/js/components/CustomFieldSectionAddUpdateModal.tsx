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
import {
    createCustomFieldMutation,
    createCustomFieldSectionMutation,
} from "../api/mutation/useCustomFieldMutation";
import queryClient from "../queryClient";
import { DEFAULT_REQUIRED_MESSAGE } from "../constants";
import { TCustomFieldSection } from "../entities";
interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
    handleSubmit: () => void;
    cutomFieldSection?: TCustomFieldSection;
    type: string;
}
const CustomFieldSectionAddUpdateModal = ({
    isModalOpen,
    closeModal,
    handleSubmit,
    cutomFieldSection,
    type,
}: Props) => {
    const [form] = Form.useForm();

    const createTemplate = useMutation(createCustomFieldSectionMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("customFieldSections");
            closeModal();
            resetFields();
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const onFinish = async (values: TCustomFieldSection) => {
        await createTemplate.mutate({
            ...values,
            id: cutomFieldSection?.id ? cutomFieldSection.id : "",
            type,
        });
    };
    const resetFields = () => {
        closeModal();
        form.resetFields();
        form.setFieldsValue({ columnLayout: "one" });
    };
    useEffect(() => {
        if (cutomFieldSection) {
            form.setFieldsValue(cutomFieldSection);
        } else {
            form.resetFields();
        }
    }, [cutomFieldSection]);
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
                    {cutomFieldSection ? "Update" : "Create New"} Section
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
                    <Form.Item name="sort" style={{ display: "none" }}>
                        <Input hidden />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Section Name"
                        rules={[
                            {
                                required: true,
                                message: DEFAULT_REQUIRED_MESSAGE,
                            },
                        ]}
                    >
                        <Input placeholder="Folder name" />
                    </Form.Item>
                    <Form.Item
                        name="columnLayout"
                        label="Column Layout"
                        rules={[
                            {
                                required: true,
                                message: DEFAULT_REQUIRED_MESSAGE,
                            },
                        ]}
                    >
                        <Select>
                            <Select.Option value="one">
                                One Column
                            </Select.Option>
                            <Select.Option value="two">
                                Two Column
                            </Select.Option>
                        </Select>
                    </Form.Item>

                    <Space style={{ paddingTop: "5px" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={createTemplate.isLoading}
                        >
                            Save
                        </Button>

                        <Button onClick={resetFields}>Cancel</Button>
                    </Space>
                </Form>
            </Space>
        </Modal>
    );
};

export default CustomFieldSectionAddUpdateModal;
