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
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { TDealPipeline } from "../../../entities";
import { createPipeline } from "../../../api/mutation/useDealMutation";
import queryClient from "../../../queryClient";
interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
    handleSubmit: () => void;
    pipeline?: TDealPipeline;
}
const PipelineAddUpdateModal = ({
    isModalOpen,
    closeModal,
    handleSubmit,
    pipeline,
}: Props) => {
    const [form] = Form.useForm();

    const savePipeline = useMutation(createPipeline, {
        onSuccess: () => {
            queryClient.invalidateQueries("dealPipelines");
            closeModal();
            resetFields();
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const onFinish = async (values: TDealPipeline) => {
        await savePipeline.mutate({
            ...values,
            id: pipeline?.id ? pipeline.id : "",
        });
    };
    const resetFields = () => {
        closeModal();
        form.resetFields();
        form.setFieldsValue({ columnLayout: "one" });
    };
    useEffect(() => {
        if (pipeline) {
            form.setFieldsValue(pipeline);
        } else {
            form.resetFields();
        }
    }, [pipeline]);
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
                    {pipeline ? "Update" : "Create New"} Pipeline
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
                        name="name"
                        label="Pipeline Name"
                        rules={[
                            {
                                required: true,
                                message: DEFAULT_REQUIRED_MESSAGE,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Space style={{ paddingTop: "5px" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={savePipeline.isLoading}
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

export default PipelineAddUpdateModal;
