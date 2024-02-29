import { Radio } from "antd";
import { Button, Modal, Select, Typography, Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import React from "react";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { useMutation, useQueryClient } from "react-query";
import { bulkUpdateField } from "../../../api/mutation/useContactMutation";
import { TContact } from "../../../entities";
import { useAppContextProvider } from "../../../context/AppContext";
import CustomFieldInput from "../../../components/CustomFieldInput";
import { useCustomFields } from "../../../api/query/customFieldQuery";

interface ContactsComponentsUpdateProps {
    isModalOpen: boolean;
    closeModal: () => void;
    handleSubmit: () => void;
    selectedRowKeys: string[];
}
const ContactBulkUpdate = ({
    isModalOpen,
    closeModal,
    handleSubmit,
    selectedRowKeys,
}: ContactsComponentsUpdateProps) => {
    const queryClient = useQueryClient();
    const [form] = Form.useForm<TContact>();

    const {
        data: contactFields,
        isLoading: isContactFieldsLoading,
        refetch: refetchContactFields,
    } = useCustomFields("contact");

    const customFieldId = Form.useWatch("customFieldId", form);

    const customField = contactFields?.find(
        (customField) => customField.id == customFieldId
    );

    const resetFields = () => {
        closeModal();
        form.resetFields();
    };

    const bulkUpdate = useMutation(bulkUpdateField, {
        onSuccess: () => {
            resetFields();
            queryClient.invalidateQueries("contacts");
            queryClient.invalidateQueries("filteredContacts");
        },
    });

    const handleFinish = (values: any) => {
        bulkUpdate.mutate({
            contactIds: selectedRowKeys,
            fieldValue: values[customField?.fieldName!],
            customField,
            action: values?.action ?? "",
        });
    };

    return (
        <>
            <Modal
                closable={false}
                className="your-modal"
                width={500}
                title={null}
                open={isModalOpen}
                style={{ maxHeight: "700px" }}
                footer={null}
            >
                <div className="modal-header">
                    <Typography.Title level={5} style={{ color: "white" }}>
                        Select Field to Update
                    </Typography.Title>

                    <Button
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            border: "0px",
                        }}
                        onClick={() => {
                            resetFields();
                        }}
                        icon={<CloseOutlined style={{ color: "white" }} />}
                    />
                </div>
                <div className="modal-content">
                    <Form
                        form={form}
                        onFinish={handleFinish}
                        layout="vertical"
                        initialValues={{ ownerId: 1 }}
                        className="p-t-xl"
                    >
                        <Form.Item
                            name="customFieldId"
                            rules={[
                                {
                                    required: true,
                                    message: DEFAULT_REQUIRED_MESSAGE,
                                },
                            ]}
                        >
                            <Select
                                defaultValue="Select"
                                style={{ width: "100%" }}
                            >
                                {contactFields
                                    ?.filter(
                                        (field) => field.fieldName != "mobile"
                                    )
                                    ?.map((field) => (
                                        <Select.Option value={field.id}>
                                            {field.label}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </Form.Item>

                        {customField ? (
                            <>
                                <Typography className="m-b-md">
                                    Enter a new value for the field{" "}
                                    {customField?.label}
                                </Typography>

                                {customField?.type == "tag" && (
                                    <center>
                                        <Form.Item
                                            name="action"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        DEFAULT_REQUIRED_MESSAGE,
                                                },
                                            ]}
                                            initialValue="add"
                                        >
                                            <Radio.Group>
                                                <Radio.Button value="add">
                                                    Add
                                                </Radio.Button>
                                                <Radio.Button value="remove">
                                                    Remove
                                                </Radio.Button>
                                            </Radio.Group>
                                        </Form.Item>
                                    </center>
                                )}

                                <CustomFieldInput
                                    customField={customField}
                                    showLabel={false}
                                />
                            </>
                        ) : null}
                    </Form>
                </div>
                <div className="modal-footer">
                    <Button
                        className="m-r-xs"
                        type="primary"
                        onClick={() => {
                            form.validateFields().then((values) => {
                                form.submit();
                            });
                        }}
                        loading={bulkUpdate.isLoading}
                    >
                        Save
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default ContactBulkUpdate;
