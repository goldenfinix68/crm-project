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
                <a
                    href={record[field.fieldName]}
                    target="_blank"
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {record[field.fieldName]}
                </a>
            );
        }
        return record[field.fieldName] ? record[field.fieldName] : "_";
    };

    return (
        <div
            className="cell cell-hover w-100"
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
            }}
        >
            {!isEditMode &&
                (field.type == "url" ? (
                    <>
                        <div
                            style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                width: "70%",
                            }}
                        >
                            {getLabel()}
                        </div>
                        <EditOutlined
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                message.error("Cannot edit default section");
                            }}
                        />
                    </>
                ) : (
                    <div
                        onDoubleClick={() => {
                            setIsEditMode(true);
                        }}
                        style={{ width: "50%" }}
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
                    }}
                    style={{
                        width: "50%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
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
