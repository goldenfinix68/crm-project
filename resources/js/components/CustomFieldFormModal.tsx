import {
    Button,
    Col,
    Modal,
    Row,
    Typography,
    Form,
    message,
    Space,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { useCustomFieldSections } from "../api/query/customFieldQuery";
import { DEFAULT_REQUIRED_MESSAGE } from "../constants";
import CustomFieldInput from "./CustomFieldInput";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import { saveCustomFieldValuesMutation } from "../api/mutation/useCustomFieldMutation";
import CustomFieldInputWrapper from "./CustomFieldInput";
import LoadingComponent from "./LoadingComponent";
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
            message.error(e.message || "An error occurred");
        },
    });

    const handleFinish = (values: any) => {
        save.mutate({
            fields: { ...values },
            customableId: record?.contactId,
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

    useEffect(() => {
        if (record) {
            let obj = {};
            const entries = Object.entries(record);
            for (const [key, value] of entries) {
                obj = {
                    ...obj,
                    [key]: record[key + "lookupIds"]
                        ? JSON.parse(record[key + "lookupIds"])
                        : value,
                };
            }
            form.setFieldsValue(obj);
        } else {
            form.resetFields();
        }
    }, [record]);

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
                <div className="modal-header m-b-md">
                    <Typography.Title level={5} style={{ color: "white" }}>
                        {preview
                            ? "Form Preview"
                            : `${record ? "Update" : "Add new"} ${type}`}
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
                    <Form form={form} onFinish={handleFinish} layout="vertical">
                        {sections?.map((section) => {
                            // if (section.columnLayout == "two") {
                            const columnSpan =
                                section.columnLayout == "two" ? 12 : 24;
                            return (
                                // <Space direction="vertical" className="w-100">
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
                                    <Row gutter={24} className="m-b-lg">
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
                                // </Space>
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
                            loading={save.isLoading}
                        >
                            Save
                        </Button>
                        <Button onClick={resetFields}>
                            {record ? "Cancel" : "No"}
                        </Button>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default CustomFieldFormModal;
