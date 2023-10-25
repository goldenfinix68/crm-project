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
import { TDealPipeline, TDealPipelineStage } from "../../../entities";
import {
    createPipeline,
    createPipelineStage,
} from "../../../api/mutation/useDealMutation";
import queryClient from "../../../queryClient";
interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
    handleSubmit: () => void;
    stage?: TDealPipelineStage;
    pipelineId: string;
}
const DealPipelineStageAddUpdateModal = ({
    isModalOpen,
    closeModal,
    handleSubmit,
    stage,
    pipelineId,
}: Props) => {
    const [form] = Form.useForm();

    const saveStage = useMutation(createPipelineStage, {
        onSuccess: () => {
            queryClient.invalidateQueries("dealPipelines");
            closeModal();
            resetFields();
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const onFinish = async (values: TDealPipelineStage) => {
        await saveStage.mutate({
            ...values,
            id: stage?.id ? stage.id : "",
            dealPipelineId: pipelineId,
        });
    };
    const resetFields = () => {
        closeModal();
        form.resetFields();
        form.setFieldsValue({ columnLayout: "one" });
    };
    useEffect(() => {
        if (stage) {
            form.setFieldsValue(stage);
        } else {
            form.resetFields();
        }
    }, [stage]);
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
                    {stage ? "Update" : "Create New"} Pipeline Stage
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
                        label="Stage Name"
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
                            loading={saveStage.isLoading}
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

export default DealPipelineStageAddUpdateModal;
