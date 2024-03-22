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
    Card,
} from "antd";

import {
    CloseOutlined,
    EditOutlined,
    PhoneOutlined,
    UserOutlined,
} from "@ant-design/icons";

import { useMutation } from "react-query";
import {
    createCustomFieldMutation,
    createCustomFieldSectionMutation,
} from "../api/mutation/useCustomFieldMutation";
import queryClient from "../queryClient";
import { DEFAULT_REQUIRED_MESSAGE } from "../constants";
import { TCustomFieldSection, TUserSettings } from "../entities";
import { useCustomFields } from "../api/query/customFieldQuery";
import { userSettings } from "../api/mutation/useUserMutation";
import { useAppContextProvider } from "../context/AppContext";
interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
    handleSubmit: () => void;
}
const DealCardConfigureModal = ({
    isModalOpen,
    closeModal,
    handleSubmit,
}: Props) => {
    const [form] = Form.useForm();

    const { loggedInUser } = useAppContextProvider();

    const {
        data: contactFields,
        isLoading: isContactFieldsLoading,
        refetch: refetchContactFields,
    } = useCustomFields("contact");

    const fields = contactFields
        ?.filter(
            (field) =>
                !["contactLookup", "userLookup", "contactTypeLookup"].includes(
                    field.type
                ) && !["firstName", "lastName"].includes(field.fieldName)
        )
        ?.map((field, index) => ({
            label: field.label,
            value: field.fieldName,
        }));

    const settings = useMutation(userSettings, {
        onSuccess: () => {
            queryClient.invalidateQueries("user");
            closeModal();
            resetFields();
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const onFinish = async (values: TUserSettings) => {
        const data = {
            ...loggedInUser?.settings,
            dealCardpos2FieldId: values?.dealCardpos2FieldId ?? null,
            dealCardpos3FieldId: values?.dealCardpos3FieldId ?? null,
            dealCardpos4FieldId: values?.dealCardpos4FieldId ?? null,
        };
        await settings.mutate({
            ...data,
        });
    };
    const resetFields = () => {
        closeModal();
        form.resetFields();
        form.setFieldsValue({ columnLayout: "one" });
    };

    useEffect(() => {
        if (loggedInUser) {
            form.setFieldsValue(loggedInUser.settings);
        } else {
            form.resetFields();
        }
    }, [loggedInUser]);
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
                    Configure Deal Card
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
                >
                    <Card loading={isContactFieldsLoading} className="w-100">
                        <Space
                            className="w-100"
                            direction="vertical"
                            size={"large"}
                        >
                            <Space
                                className="w-100"
                                size={"large"}
                                style={{
                                    justifyContent: "end",
                                    alignItems: "center",
                                    marginTop: "auto",
                                }}
                            >
                                <Typography.Text
                                    style={{ color: "gray", fontSize: "12px" }}
                                >
                                    Aging: #
                                </Typography.Text>
                            </Space>

                            <div
                                className="w-100"
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Select
                                    className="w-100 m-r-sm"
                                    value="Full name"
                                    disabled
                                />

                                <Form.Item
                                    name="dealCardpos2FieldId"
                                    className="w-100"
                                >
                                    <Select
                                        showSearch
                                        className="w-100"
                                        allowClear
                                        optionFilterProp="children"
                                    >
                                        {fields?.map((field, index) => (
                                            <Select.Option
                                                value={field.value}
                                                key={index}
                                            >
                                                {field.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>

                            <div
                                className="w-100"
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Form.Item
                                    name="dealCardpos3FieldId"
                                    className="w-100 m-r-sm"
                                >
                                    <Select
                                        showSearch
                                        className="w-100"
                                        allowClear
                                        optionFilterProp="children"
                                    >
                                        {fields?.map((field, index) => (
                                            <Select.Option
                                                value={field.value}
                                                key={index}
                                            >
                                                {field.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="dealCardpos4FieldId"
                                    className="w-100"
                                >
                                    <Select
                                        showSearch
                                        className="w-100"
                                        allowClear
                                        optionFilterProp="children"
                                    >
                                        {fields?.map((field, index) => (
                                            <Select.Option
                                                value={field.value}
                                                key={index}
                                            >
                                                {field.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                            <Space
                                className="w-100"
                                size={"large"}
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: "auto",
                                }}
                            >
                                <Tooltip title="Call contact">
                                    <Button
                                        type="text"
                                        icon={<PhoneOutlined />}
                                        disabled
                                    />
                                </Tooltip>
                                <Tooltip title="Contact profile">
                                    <Button
                                        type="text"
                                        icon={<UserOutlined />}
                                        disabled
                                    />
                                </Tooltip>
                                <Tooltip title="Edit deal">
                                    <Button
                                        type="text"
                                        icon={<EditOutlined />}
                                        disabled
                                    />
                                </Tooltip>
                            </Space>
                        </Space>
                    </Card>

                    <Space
                        style={{ paddingTop: "16px", justifyContent: "end" }}
                        className="w-100"
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={settings.isLoading}
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

export default DealCardConfigureModal;
