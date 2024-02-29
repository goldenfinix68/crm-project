import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Button,
    message,
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
    saveCustomFieldValuesMutation,
} from "../api/mutation/useCustomFieldMutation";
import queryClient from "../queryClient";
import { DEFAULT_REQUIRED_MESSAGE } from "../constants";
import { TContact, TCustomField, TCustomFieldSection } from "../entities";
import CustomFieldInput from "./CustomFieldInput";
import { ENDPOINTS } from "../endpoints";
interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
    handleSubmit: () => void;
    fields: any;
    field: TCustomField;
}
const UpdateContactFieldModal = ({
    isModalOpen,
    closeModal,
    handleSubmit,
    fields,
    field,
}: Props) => {
    const [form] = Form.useForm();

    const [phoneFieldStatus, setPhoneFieldStatus] = useState(
        fields[field.fieldName + "Status"] ?? ""
    );

    const save = useMutation(saveCustomFieldValuesMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries(ENDPOINTS.contacts.cache);
            if (handleSubmit) {
                handleSubmit();
            }
            closeModal();
        },
        onError: (e: any) => {
            message.error(e.message || "An error occurred");
        },
    });

    const handleFinish = async (values) => {
        await save.mutate({
            customableId: fields.contactId,
            customableType: "contact",
            fields: values,
            phoneFieldStatus,
        });
    };

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
                    Update Contact
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
                    form={form}
                    onFinish={handleFinish}
                    initialValues={{
                        [field.fieldName]: fields[field.fieldName + "lookupIds"]
                            ? JSON.parse(
                                  fields[field.fieldName + "lookupIds"] ??
                                      undefined
                              )
                            : fields[field.fieldName] ?? undefined,
                    }}
                    layout="vertical"
                >
                    <CustomFieldInput
                        customField={field}
                        isSelectOptionsOpen={true}
                    />

                    {(field?.type == "phone" || field?.type == "mobile") && (
                        <Space direction="vertical" className="w-100">
                            <label>Phone Field Status</label>
                            <Select
                                className="w-100"
                                onChange={(e) => setPhoneFieldStatus(e)}
                                value={phoneFieldStatus}
                            >
                                <Select.Option value="badNumber">
                                    Bad Number
                                </Select.Option>
                                <Select.Option value="smsSent">
                                    SMS Sent
                                </Select.Option>
                            </Select>
                        </Space>
                    )}

                    <Space className="p-t-xl">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={save.isLoading}
                        >
                            Save
                        </Button>

                        <Button onClick={closeModal}>Cancel</Button>
                    </Space>
                </Form>
            </Space>
        </Modal>
    );
};

export default UpdateContactFieldModal;
