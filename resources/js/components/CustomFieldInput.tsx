import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Avatar,
    Button,
    Checkbox,
    DatePicker,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    Typography,
    Form,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { TCustomField } from "../entities";
import TextArea from "antd/es/input/TextArea";
import { useAppContextProvider } from "../context/AppContext";
import { useUsedTags, useUsersAll } from "../api/query/userQuery";
import { DEFAULT_REQUIRED_MESSAGE } from "../constants";
import { useContactTypesAll } from "../api/query/contactsQuery";

const CustomFieldInput = ({
    customField,
    showLabel = true,
}: {
    customField: TCustomField;
    showLabel?: boolean;
}) => {
    const { contacts } = useAppContextProvider();
    const { users, isLoading } = useUsersAll();
    const { contactTypes, isLoading: isContactTypeLoading } =
        useContactTypesAll();

    const { data: usedTags } = useUsedTags();

    const validateEmail = (rule, value) => {
        if (
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value) ||
            !value
        ) {
            return Promise.resolve();
        }
        return Promise.reject("Please enter a valid email address.");
    };

    const getCustomFieldInput = () => {
        if (customField.type == "text") {
            return <Input />;
        }
        if (customField.type == "textArea") {
            return <Input.TextArea rows={4} />;
        }
        if (customField.type == "int") {
            return <InputNumber step={1} precision={0} className="w-100" />;
        }
        if (customField.type == "decimal") {
            return <InputNumber className="w-100" />;
        }
        if (customField.type == "date") {
            return <DatePicker className="w-100" />;
        }
        if (customField.type == "dateTime") {
            return <DatePicker showTime className="w-100" />;
        }
        if (customField.type == "email") {
            return <Input />;
        }
        if (customField.type == "phone") {
            return <Input />;
        }
        if (customField.type == "mobile") {
            return <Input />;
        }
        if (customField.type == "select" || customField.type == "multiSelect") {
            const stringArray = customField.options?.split("\n");
            return (
                <Select
                    showSearch
                    mode={
                        customField.type == "multiSelect"
                            ? "multiple"
                            : undefined
                    }
                    dropdownStyle={{ zIndex: 999999 }}
                    className="w-100"
                >
                    {stringArray?.map((option, index) => (
                        <Select.Option value={option} key={index}>
                            {option}
                        </Select.Option>
                    ))}
                </Select>
            );
        }
        if (customField.type == "url") {
            return <Input addonBefore="https://" />;
        }
        if (customField.type == "bigInt") {
            return <InputNumber step={1} precision={0} className="w-100" />;
        }
        if (customField.type == "percentage") {
            return <InputNumber max={100} min={0} className="w-100" />;
        }
        if (customField.type == "boolean") {
            return (
                <Checkbox className={"m-t-lg"}>{customField.label}</Checkbox>
            );
        }
        if (customField.type == "currency") {
            return <InputNumber min={0} className="w-100" />;
        }
        if (customField.type == "contactLookup") {
            return (
                <Select
                    showSearch
                    mode={
                        customField.associationType == "multiple"
                            ? "multiple"
                            : undefined
                    }
                    dropdownStyle={{ zIndex: 999999 }}
                    className="w-100"
                >
                    {contacts?.map((contact, index) => (
                        <Select.Option value={contact.id} key={index}>
                            <Space style={{ verticalAlign: "middle" }}>
                                <Avatar
                                    size={24}
                                    style={{
                                        backgroundColor: "#1677FF",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    <p style={{ fontSize: "9px" }}>
                                        {contact.fields?.firstName?.charAt(0) ??
                                            ""}
                                    </p>
                                </Avatar>
                                {contact.fields?.firstName +
                                    " " +
                                    contact.fields?.lastName}
                            </Space>
                        </Select.Option>
                    ))}
                </Select>
            );
        }
        if (customField.type == "userLookup") {
            return (
                <Select
                    showSearch
                    mode={
                        customField.associationType == "multiple"
                            ? "multiple"
                            : undefined
                    }
                    dropdownStyle={{ zIndex: 999999 }}
                    className="w-100"
                >
                    {users?.map((user, index) => (
                        <Select.Option value={user.id} key={index}>
                            {user.firstName + " " + user.lastName}
                        </Select.Option>
                    ))}
                </Select>
            );
        }
        if (customField.type == "contactTypeLookup") {
            return (
                <Select
                    className="w-100"
                    showSearch
                    mode={
                        customField.associationType == "multiple"
                            ? "multiple"
                            : undefined
                    }
                    dropdownStyle={{ zIndex: 999999 }}
                >
                    {contactTypes?.map((contactType, index) => (
                        <Select.Option value={contactType.id} key={index}>
                            {contactType.name}
                        </Select.Option>
                    ))}
                </Select>
            );
        }
        if (customField.type == "tag") {
            return (
                <Select
                    className="w-100"
                    showSearch
                    mode="tags"
                    dropdownStyle={{ zIndex: 999999 }}
                >
                    {usedTags?.map((tag, index) => (
                        <Select.Option value={tag} key={index}>
                            {tag}
                        </Select.Option>
                    ))}
                </Select>
            );
        }

        return <></>;
    };

    if (customField.type == "boolean") {
        return (
            <Form.Item
                className="w-100"
                name={customField.fieldName}
                valuePropName="checked"
            >
                {getCustomFieldInput()}
            </Form.Item>
        );
    }
    if (customField.type == "email") {
        return (
            <Form.Item
                className="w-100"
                name={customField.fieldName}
                label={showLabel ? customField.label : null}
                rules={[
                    {
                        required: customField.isRequired,
                        message: DEFAULT_REQUIRED_MESSAGE,
                    },
                    {
                        validator:
                            customField.type == "email"
                                ? validateEmail
                                : undefined,
                    },
                ]}
            >
                {getCustomFieldInput()}
            </Form.Item>
        );
    }

    return (
        <Form.Item
            className="w-100"
            name={customField.fieldName}
            label={showLabel ? customField.label : null}
            rules={[
                {
                    required: customField.isRequired,
                    message: DEFAULT_REQUIRED_MESSAGE,
                },
            ]}
        >
            {getCustomFieldInput()}
        </Form.Item>
    );
};

export default CustomFieldInput;
