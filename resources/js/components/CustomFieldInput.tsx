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
} from "antd";

import { CloseOutlined } from "@ant-design/icons";
import { TCustomField } from "../entities";
import TextArea from "antd/es/input/TextArea";
import { useAppContextProvider } from "../context/AppContext";
import { useUsersAll } from "../api/query/userQuery";

const CustomFieldInput = ({ customField }: { customField: TCustomField }) => {
    const { contacts } = useAppContextProvider();
    const { users, isLoading } = useUsersAll();

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
    if (customField.type == "select" || customField.type == "multiSelect") {
        const stringArray = customField.options?.split("\n");
        return (
            <Select
                showSearch
                mode={
                    customField.type == "multiSelect" ? "multiple" : undefined
                }
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
        return <Checkbox className={"m-t-lg"}>{customField.label}</Checkbox>;
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
            >
                {contacts?.map((contact, index) => (
                    <Select.Option value={contact.id} key={index}>
                        <Space
                            style={{
                                verticalAlign: "middle",
                            }}
                        >
                            <Avatar
                                size={24}
                                style={{
                                    backgroundColor: "#1677FF",
                                    verticalAlign: "middle",
                                }}
                            >
                                <p style={{ fontSize: "9px" }}>
                                    {contact.firstName.charAt(0)}
                                </p>
                            </Avatar>
                            {contact.firstName + " " + contact.lastName}
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
            >
                {users?.map((user, index) => (
                    <Select.Option value={user.id} key={index}>
                        {user.firstName + " " + user.lastName}
                    </Select.Option>
                ))}
            </Select>
        );
    }

    return <></>;
};

export default CustomFieldInput;
