import React, { useEffect } from "react";
import {
    Button,
    Col,
    Modal,
    Row,
    Typography,
    Form,
    Select,
    notification,
} from "antd";

import { CloseOutlined } from "@ant-design/icons";

import { useForm } from "antd/es/form/Form";
import { useMutation } from "react-query";
import { useDealMutation } from "../../../api/mutation/useDealMutation";
import { TDeal } from "../../../entities";
import CustomFieldInput from "../../../components/CustomFieldInput";
import { dealPipelines } from "../../../api/query/dealQuery";
import queryClient from "../../../queryClient";
interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
    handleSubmit: () => void;
    deal?: TDeal;
    selectedRows?: React.Key[];
}

const ModalAddDeal = ({
    isModalOpen,
    closeModal,
    handleSubmit,
    deal,
    selectedRows,
}: Props) => {
    const [form] = useForm();
    const { data: pipelines, isLoading, refetch } = dealPipelines();
    const pipelineId = Form.useWatch("pipelineId", form);
    const stages = pipelineId
        ? pipelines?.find((pipeline) => pipeline.id === pipelineId)?.stages
        : [];

    const onFinish = (values: any) => {
        saveDeal.mutate({
            ...values,
            id: deal?.id ? deal.id : "",
            dealIds: selectedRows,
        });
    };

    const saveDeal = useMutation(useDealMutation, {
        onSuccess: (res) => {
            // navigate("/users"); // Redirect to the users list page after successful submission
            if (res.success) {
                notification.success({
                    message: "Deal",
                    description: "Successfully Added",
                });
                queryClient.invalidateQueries("deals");
                handleSubmit();
                resetFields();
            }
        },
    });

    const resetFields = () => {
        closeModal();
        form.resetFields();
    };

    useEffect(() => {
        if (deal) {
            form.setFieldsValue(deal);
        } else {
            form.resetFields();
        }
    }, [deal]);

    return (
        <Modal
            className="your-modal"
            open={isModalOpen}
            onCancel={resetFields}
            footer={null}
            title={null}
            closable={false}
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
                        {selectedRows?.length
                            ? "Bulk update"
                            : deal
                            ? "Update New Deal"
                            : "Add New Deal"}
                    </Typography.Title>
                    <Button
                        onClick={resetFields}
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            border: "0px",
                        }}
                        icon={<CloseOutlined style={{ color: "white" }} />}
                    />
                </div>
                <Row gutter={12} style={{ marginTop: 10 }}>
                    <Col md={24} className="col-1-modal-act">
                        {!selectedRows?.length && (
                            <CustomFieldInput
                                customField={{
                                    type: "contactLookup",
                                    fieldName: "contactId",
                                    label: "Contact",
                                    isRequired: true,
                                }}
                            />
                        )}

                        <Row gutter={24}>
                            <Col md={12}>
                                <Form.Item
                                    label="Pipeline"
                                    name="pipelineId"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Pipeline"
                                        onChange={() => {
                                            form.setFieldValue("stageId", null);
                                        }}
                                    >
                                        {pipelines?.map((pipeline, index) => (
                                            <Select.Option
                                                value={pipeline.id}
                                                key={index}
                                            >
                                                {pipeline.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Stage"
                                    name="stageId"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Stage">
                                        {stages?.map((stage, index) => (
                                            <Select.Option
                                                value={stage.id}
                                                key={index}
                                            >
                                                {stage.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className="modal-footer">
                    <Button
                        className="m-r-xs"
                        type="primary"
                        htmlType="submit"
                        loading={saveDeal.isLoading}
                    >
                        Save
                    </Button>
                    {!selectedRows?.length && !deal && (
                        <Button
                            className="m-r-xs"
                            type="primary"
                            loading={saveDeal.isLoading}
                        >
                            Save and add other
                        </Button>
                    )}

                    <Button onClick={resetFields}>Cancel</Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ModalAddDeal;
