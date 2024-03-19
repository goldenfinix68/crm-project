import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Avatar,
    Button,
    Form,
    Input,
    Popconfirm,
    Space,
    message,
    Tooltip,
    Row,
    Col,
    Typography,
} from "antd";

import React from "react";
import { EditOutlined } from "@ant-design/icons";
import { TCustomField } from "../entities";
import { useAppContextProvider } from "../context/AppContext";
import { saveCustomFieldValuesMutation } from "../api/mutation/useCustomFieldMutation";
import { useMutation } from "react-query";
import queryClient from "../queryClient";
import ContactTypeTag from "./ContactTypeTag";
import CustomFieldInput from "./CustomFieldInput";
import TextEllipsis from "./TextEllipsis";

interface ContactInfoEditableTextProps {
    record: any;
    field: TCustomField;
    handleSubmit?: () => void;
}

const ContactInfoEditableText = ({
    record,
    field,
    handleSubmit,
}: ContactInfoEditableTextProps) => {
    const [form] = Form.useForm();
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const save = useMutation(saveCustomFieldValuesMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("contacts");
            if (handleSubmit) {
                handleSubmit();
            }
        },
        onError: (e: any) => {
            message.error(e.message || "An error occurred");
        },
    });

    const handleFinish = async (values) => {
        if (form.isFieldsTouched(true)) {
            await save.mutate({
                customableId: record.contactId,
                customableType: "contact",
                fields: values,
            });
        }
    };

    const getLabel = () => {
        if (field.type == "contactTypeLookup") {
            return <ContactTypeTag fields={record} />;
        }
        if (field.type == "url" && record[field.fieldName]) {
            return (
                <a href={record[field.fieldName]} target="_blank">
                    {record[field.fieldName]}
                </a>
            );
        }
        return record[field.fieldName] ? record[field.fieldName] : "_";
    };

    return (
        <div
            style={{
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
            }}
        >
            {!isEditMode &&
                (field.type == "url" && record[field.fieldName] ? (
                    <div
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {isHovered && (
                            <EditOutlined
                                className="p-r-xs"
                                style={{
                                    cursor: "pointer",
                                }}
                                onClick={() => setIsEditMode(true)}
                            />
                        )}
                        {getLabel()}
                    </div>
                ) : (
                    <div
                        onDoubleClick={() => {
                            setIsEditMode(true);
                        }}
                        style={{ width: "100%", cursor: "pointer" }}
                    >
                        <Tooltip title={getLabel()}>
                            <TextEllipsis>{getLabel()}</TextEllipsis>
                        </Tooltip>
                    </div>
                ))}

            {isEditMode && (
                <div
                    onBlur={() => {
                        form.submit();
                        setIsEditMode(false);
                        setIsHovered(false);
                    }}
                    style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%",
                    }}
                >
                    <Form
                        form={form}
                        onFinish={handleFinish}
                        initialValues={{
                            [field.fieldName]: record[
                                field.fieldName + "lookupIds"
                            ]
                                ? JSON.parse(
                                      record[field.fieldName + "lookupIds"]
                                  )
                                : record[field.fieldName],
                        }}
                        layout="vertical"
                    >
                        <CustomFieldInput
                            showLabel={false}
                            customField={field}
                            isSelectOptionsOpen={true}
                        />
                    </Form>
                </div>
            )}
        </div>
    );
};

export default ContactInfoEditableText;
