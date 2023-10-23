import { Button, Col, Modal, Row, Typography, Form, Input } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { useCustomFieldSections } from "../api/query/customFieldQuery";
import { DEFAULT_REQUIRED_MESSAGE } from "../constants";
import CustomFieldInput from "./CustomFieldInput";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import { saveCustomFieldValuesMutation } from "../api/mutation/useCustomFieldMutation";
import CustomFieldInputWrapper from "./CustomFieldInput";
interface CustomFieldFormModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    handleSubmit: () => void;
    type: string;
    preview?: boolean;
    record?: any;
}

const CustomFieldFormModal = ({
    isModalOpen,
    closeModal,
    handleSubmit,
    type,
    preview,
    record,
}: CustomFieldFormModalProps) => {
    const [form] = Form.useForm();

    const {
        data: sections,
        isLoading,
        refetch: refetchSections,
    } = useCustomFieldSections(type);

    const save = useMutation(saveCustomFieldValuesMutation, {
        onSuccess: () => {
            resetFields();
            if (handleSubmit) {
                handleSubmit();
            }
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const handleFinish = (values: any) => {
        save.mutate({
            fields: { ...values },
            customableId: record?.customableId,
            customableType: type,
        });
    };

    const resetFields = () => {
        form.resetFields();
        closeModal();
    };

    useEffect(() => {
        refetchSections();
    }, []);

    return (
        <>
            <Modal
                closable={false}
                className="your-modal"
                width={650}
                title={null}
                open={isModalOpen}
                style={{ maxHeight: "700px" }}
                footer={null}
            >
                <div className="modal-header">
                    <Typography.Title level={5} style={{ color: "white" }}>
                        {preview ? "Form Preview" : `Add new ${type}`}
                    </Typography.Title>
                    {!preview && (
                        <Button
                            type="link"
                            style={{ marginRight: "-270px", color: "white" }}
                        >
                            <Link to={`/setup/customizations/${type}`}>
                                Manage Fields
                            </Link>
                        </Button>
                    )}

                    <Button
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            border: "0px",
                        }}
                        onClick={resetFields}
                        icon={<CloseOutlined style={{ color: "white" }} />}
                    />
                </div>
                <div className="modal-content">
                    <Form
                        form={form}
                        onFinish={handleFinish}
                        layout="vertical"
                        initialValues={{ ownerId: 1 }}
                    >
                        {sections?.map((section) => {
                            // if (section.columnLayout == "two") {
                            const columnSpan =
                                section.columnLayout == "two" ? 12 : 24;
                            return (
                                <>
                                    {!section.isDefault ? (
                                        <Row gutter={24} className="m-b-sm">
                                            <Col>
                                                <Typography.Title level={5}>
                                                    {section.name}
                                                </Typography.Title>
                                            </Col>
                                        </Row>
                                    ) : null}
                                    <Row gutter={24} className="m-t-md">
                                        {section.fields?.map((field) => {
                                            return (
                                                <Col
                                                    md={columnSpan}
                                                    xs={columnSpan}
                                                >
                                                    <CustomFieldInput
                                                        customField={field}
                                                    />
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                </>
                            );
                            <></>;
                        })}
                    </Form>
                </div>
                {!preview && (
                    <div className="modal-footer">
                        <Button
                            className="m-r-xs"
                            type="primary"
                            onClick={() => {
                                // setSaveAndAdd(false);
                                form.submit();
                            }}
                        >
                            Save and Close
                        </Button>
                        <Button
                            className="m-r-xs"
                            type="primary"
                            onClick={() => {
                                // setSaveAndAdd(true);
                                form.submit();
                            }}
                        >
                            Save and add other
                        </Button>
                        <Button onClick={resetFields}>Cancel</Button>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default CustomFieldFormModal;
