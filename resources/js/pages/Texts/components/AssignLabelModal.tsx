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
    Checkbox,
} from "antd";

import { CloseOutlined } from "@ant-design/icons";

import { useMutation } from "react-query";
import {
    assignLabelMutation,
    createTextLabelMutation,
    sendTextMutation,
} from "../../../api/mutation/useTextMutation";
import queryClient from "../../../queryClient";
import TextForm from "../../Texts/components/TextForm";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { TTextLabel, TTextTemplateFolder } from "../../../entities";
import { createTextTemplateFolderMutation } from "../../../api/mutation/useTextTemplateMutation";
import { useTextLabels } from "../../../api/query/textQuery";
interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
    threadIds: string[];
    defaultChecked?: string[];
}
const AssignLabelModal = ({
    isModalOpen,
    closeModal,
    threadIds,
    defaultChecked,
}: Props) => {
    const [form] = Form.useForm();
    const { labels, isLoading: isLabelsLoading } = useTextLabels();

    const assignLabel = useMutation(assignLabelMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("textThreads");
            resetFields();
        },
    });

    const onFinish = async (values: any) => {
        console.log(values);
        await assignLabel.mutate({
            ...values,
            threadIds: threadIds,
        });
    };
    const resetFields = () => {
        closeModal();
        form.resetFields();
    };
    useEffect(() => {
        if (defaultChecked) {
            form.setFieldValue("labels", defaultChecked);
        }
    }, [defaultChecked]);

    return (
        <Modal
            className="modal-activity"
            open={isModalOpen}
            onCancel={closeModal}
            footer={null}
            title={null}
            closable={false}
            width={"300px"}
        >
            <div className="modal-header">
                <Typography.Title level={5} style={{ color: "white" }}>
                    Assign Label
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
                        name="labels"
                        labelCol={{ span: 24 }} // Ensures the label takes the full width
                        wrapperCol={{ span: 24 }}
                    >
                        <Checkbox.Group
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "8px",
                            }}
                        >
                            {labels?.map((label) => (
                                <Checkbox
                                    key={label.id}
                                    value={label.id}
                                    style={{ marginBottom: "8px" }}
                                >
                                    {label.name}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </Form.Item>

                    <Space style={{ paddingTop: "5px" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            // loading={createTemplate.isLoading}
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

export default AssignLabelModal;
