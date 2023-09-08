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
import { sendTextMutation } from "../../../api/mutation/useTextMutation";
import queryClient from "../../../queryClient";
import TextForm from "../../Texts/components/TextForm";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { TTextTemplateFolder } from "../../../entities";
import { createTextTemplateFolderMutation } from "../../../api/mutation/useTextTemplateMutation";
interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
    templateFolder?: TTextTemplateFolder;
}
const AddUpdateTemplateFolderModal = ({
    isModalOpen,
    closeModal,
    templateFolder,
}: Props) => {
    const [form] = Form.useForm();

    const createTemplate = useMutation(createTextTemplateFolderMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("textTemplates");
            closeModal();
            resetFields();
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const onFinish = async (values: any) => {
        await createTemplate.mutate({
            ...values,
            id: templateFolder?.id ? templateFolder.id : "",
        });
    };
    const resetFields = () => {
        closeModal();
        form.resetFields();
        // setError("");
    };
    useEffect(() => {
        if (templateFolder?.name) {
            form.setFieldValue("name", templateFolder.name);
        } else {
            form.resetFields();
        }
    }, [templateFolder]);
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
                    {templateFolder ? "Update" : "Create new"} folder
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
                >
                    <Form.Item
                        name="name"
                        label="Folder name"
                        rules={[
                            {
                                required: true,
                                message: DEFAULT_REQUIRED_MESSAGE,
                            },
                        ]}
                    >
                        <Input placeholder="Folder name" />
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

export default AddUpdateTemplateFolderModal;
