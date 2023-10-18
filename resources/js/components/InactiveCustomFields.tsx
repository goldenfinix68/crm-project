import React, { useState } from "react";
import {
    Card,
    Space,
    Button,
    Typography,
    List,
    Tag,
    message,
    Form,
    Modal,
    Select,
} from "antd";
import { useDrag, useDrop } from "react-dnd";
import {
    DownOutlined,
    RightOutlined,
    EditOutlined,
    DeleteOutlined,
    HolderOutlined,
    UndoOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import { TCustomField, TCustomFieldSection } from "../entities";
import { useMutation } from "react-query";
import {
    deleteCustomFieldMutation,
    deleteCustomFieldSectionMutation,
    restoreCustomFieldMutation,
    sortCustomFieldsMutation,
} from "../api/mutation/useCustomFieldMutation";
import queryClient from "../queryClient";
import ConfirmModal from "./ConfirmModal";
import { FIELD_TYPE_LIST } from "../constants";
import CustomFieldAddUpdateModal from "./CustomFieldAddUpdateModal";
import validateRules from "../providers/validateRules";

const InactiveCustomFields = ({
    inactiveFields,
    sections,
}: {
    inactiveFields: TCustomField[];
    sections: TCustomFieldSection[];
}) => {
    const [form] = Form.useForm();
    const [selectedCustomField, setSelectedCustomField] = useState<
        TCustomField | undefined
    >();
    const [
        isRestoreCustomFieldAddUpdateOpen,
        setIsRestoreCustomFieldAddUpdateOpen,
    ] = React.useState(false);

    const restoreCustomField = useMutation(restoreCustomFieldMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("customFieldSections");
            queryClient.invalidateQueries("inactiveCustomFields");
            resetFields();
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const resetFields = () => {
        setIsRestoreCustomFieldAddUpdateOpen(false);
        form.resetFields();
        // setError("");
    };

    const onFinish = async (values: any) => {
        if (selectedCustomField) {
            await restoreCustomField.mutate({
                ...selectedCustomField,
                customFieldSectionId: values.customFieldSectionId,
            });
        }
    };

    return (
        <>
            <Card title="Inactive fields">
                <List
                    size="small"
                    header={false}
                    footer={false}
                    dataSource={inactiveFields}
                    renderItem={(customField, index) => (
                        <List.Item key={customField.id}>
                            <List.Item.Meta
                                // avatar={<Avatar src={item.picture.large} />}
                                title={customField.label}
                                // description={item.email}
                            />
                            <UndoOutlined
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    setSelectedCustomField(customField);
                                    setIsRestoreCustomFieldAddUpdateOpen(true);
                                }}
                            />
                        </List.Item>
                    )}
                />
            </Card>

            <Modal
                className="modal-activity"
                open={isRestoreCustomFieldAddUpdateOpen}
                onCancel={resetFields}
                footer={null}
                title={null}
                closable={false}
            >
                <div className="modal-header">
                    <Typography.Title level={5} style={{ color: "white" }}>
                        Restore Custom Field
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
                <Space
                    direction="vertical"
                    style={{
                        padding: "20px",
                        width: "100%",
                        paddingTop: "30px",
                    }}
                    size={0}
                >
                    <Form
                        name="basic"
                        layout="vertical"
                        labelWrap
                        onFinish={onFinish}
                        autoComplete="off"
                        form={form}
                        initialValues={{
                            customFieldSectionId: sections?.length
                                ? sections[0].id
                                : "",
                        }}
                    >
                        <Form.Item
                            name={"customFieldSectionId"}
                            label="Section Name"
                            rules={[validateRules.required]}
                        >
                            <Select>
                                {sections?.map((section) => (
                                    <Select.Option value={section.id}>
                                        {section.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Space style={{ paddingTop: "5px" }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={restoreCustomField.isLoading}
                            >
                                Save
                            </Button>

                            <Button onClick={resetFields}>Cancel</Button>
                        </Space>
                    </Form>
                </Space>
            </Modal>
        </>
    );
};

export default InactiveCustomFields;
