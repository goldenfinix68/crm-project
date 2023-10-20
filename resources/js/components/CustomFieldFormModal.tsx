import { Button, Col, Modal, Row, Typography, Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { useCustomFieldSections } from "../api/query/customFieldQuery";
import { DEFAULT_REQUIRED_MESSAGE } from "../constants";
import CustomFieldInput from "./CustomFieldInput";
interface CustomFieldFormModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    handleSubmit: () => void;
    type: string;
    preview?: boolean;
}

const CustomFieldFormModal = ({
    isModalOpen,
    closeModal,
    handleSubmit,
    type,
    preview,
}: CustomFieldFormModalProps) => {
    const [form] = Form.useForm();

    const {
        data: sections,
        isLoading,
        refetch: refetchSections,
    } = useCustomFieldSections(type);

    const handleFinish = (values: any) => {
        // if (record) {
        //     addContact.mutate({ ...values, id: record.id });
        // } else {
        //     addContact.mutate(values);
        // }
    };

    const resetFields = () => {
        form.resetFields();
        closeModal();
    };
    const validateEmail = (rule, value) => {
        if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject("Please enter a valid email address.");
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
                            {" "}
                            <u>Manage Fields</u>
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
                                                    {field.type == "boolean" ? (
                                                        <Form.Item
                                                            name={
                                                                field.fieldName
                                                            }
                                                            valuePropName="checked"
                                                        >
                                                            <CustomFieldInput
                                                                customField={
                                                                    field
                                                                }
                                                            />
                                                        </Form.Item>
                                                    ) : (
                                                        <Form.Item
                                                            name={
                                                                field.fieldName
                                                            }
                                                            label={field.label}
                                                            rules={[
                                                                {
                                                                    required:
                                                                        field.isRequired,
                                                                    message:
                                                                        DEFAULT_REQUIRED_MESSAGE,
                                                                },
                                                                {
                                                                    type: "email",
                                                                    message:
                                                                        "The input is not a valid email address",
                                                                },
                                                                {
                                                                    validator:
                                                                        field.type ==
                                                                        "email"
                                                                            ? validateEmail
                                                                            : undefined,
                                                                },
                                                            ]}
                                                        >
                                                            <CustomFieldInput
                                                                customField={
                                                                    field
                                                                }
                                                            />
                                                        </Form.Item>
                                                    )}
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
                                form.validateFields().then((values) => {
                                    form.submit();
                                });
                            }}
                        >
                            Save and Close
                        </Button>
                        <Button
                            className="m-r-xs"
                            type="primary"
                            onClick={() => {
                                // setSaveAndAdd(true);
                                form.validateFields().then((values) => {
                                    form.submit();
                                });
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
