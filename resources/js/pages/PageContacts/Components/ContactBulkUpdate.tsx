import { CaretDownFilled } from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
    Button,
    Col,
    Dropdown,
    Modal,
    Row,
    Space,
    Input,
    Select,
    Typography,
    Checkbox,
    Divider,
    Form,
} from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    CheckCircleOutlined,
    FunnelPlotOutlined,
    PhoneOutlined,
    FileDoneOutlined,
    TeamOutlined,
    PlaySquareOutlined,
    TableOutlined,
    PlusCircleOutlined,
    DownOutlined,
    LockOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { useMutation, useQueryClient } from "react-query";
import {
    addContactMutation,
    bulkUpdateField,
} from "../../../api/mutation/useContactMutation";
import queryClient from "../../../queryClient";
import { TContact, TCustomField } from "../../../entities";
import ContactsComponentsUpdateFields from "./ContactsComponentsUpdateFields";
import { useAppContextProvider } from "../../../context/AppContext";
import CustomFieldInput from "../../../components/CustomFieldInput";

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
    const { contacts, contactFields } = useAppContextProvider();

    const resetFields = () => {
        closeModal();
        form.resetFields();
        setSelectedCustomField(undefined);
    };
    // const [saveAndAdd, setSaveAndAdd] = useState(false);

    const bulkUpdate = useMutation(bulkUpdateField, {
        onSuccess: () => {
            resetFields();
            queryClient.invalidateQueries("contacts");
            queryClient.invalidateQueries("filteredContacts");
        },
    });

    // useEffect(() => {
    //     if (record) {
    //         console.log("record", record);
    //         //
    //         form.setFieldsValue(record);
    //     }
    // }, [record]);

    // useEffect(() => {
    //     console.log("title", title);
    // }, [title]);

    const handleFinish = (values: any) => {
        bulkUpdate.mutate({
            contactIds: selectedRowKeys,
            fieldValue: values[selectedCustomField?.fieldName!],
            customField: selectedCustomField,
        });
        // selectedData.forEach((item) => {
        //     addContact.mutate({ ...item, ...values });
        // });
    };

    const [selectedCustomField, setSelectedCustomField] = useState<
        TCustomField | undefined
    >();
    return (
        <>
            <Modal
                closable={false}
                className="your-modal"
                width={500}
                title={null}
                open={isModalOpen}
                // onCancel={() => {
                //     console.log("asdasd");

                //     setTContact(null);
                //     form.resetFields();
                //     setIsModalOpen(false);
                // }}
                style={{ maxHeight: "700px" }}
                footer={null}
                // footer={[
                //     <Button type="primary">Save</Button>,
                //     <Button type="primary">Save and add other</Button>,
                //     <Button onClick={() => setIsModalOpen(false)}>
                //         Cancel
                //     </Button>,
                // ]}
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
                    <Row gutter={24} className="m-t-md">
                        <Col md={24} xs={24}>
                            <Select
                                defaultValue="Select"
                                style={{ width: "100%" }}
                                onChange={(id) => {
                                    setSelectedCustomField(
                                        contactFields.find(
                                            (customField) =>
                                                customField.id == id
                                        )
                                    );
                                }}
                            >
                                {contactFields
                                    .filter(
                                        (field) => field.fieldName != "mobile"
                                    )
                                    ?.map((field) => (
                                        <Select.Option value={field.id}>
                                            {field.label}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </Col>
                    </Row>

                    <Form
                        form={form}
                        onFinish={handleFinish}
                        layout="vertical"
                        initialValues={{ ownerId: 1 }}
                        className="p-t-xl"
                    >
                        {selectedCustomField ? (
                            <Space direction="vertical" className="w-100">
                                <Typography className="m-b-md">
                                    Enter a new value for the field{" "}
                                    {selectedCustomField?.label}
                                </Typography>
                                <CustomFieldInput
                                    customField={selectedCustomField}
                                    showLabel={false}
                                />
                            </Space>
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
                    >
                        Save
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default ContactBulkUpdate;
