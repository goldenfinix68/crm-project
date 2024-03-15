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
        await save.mutate({
            customableId: record.contactId,
            customableType: "contact",
            fields: values,
        });
    };

    const getLabel = () => {
        if (field.type == "contactTypeLookup") {
            return <ContactTypeTag fields={record} />;
        }
        if (field.type == "url") {
            return (
                <a href={record[field.fieldName]} target="_blank">
                    {record[field.fieldName]}
                </a>
            );
        }
        return record[field.fieldName] ?? "_";
    };

    return (
        <div
            className="cell cell-hover w-100"
            style={{
                overflow: "hidden",
            }}
        >
            {!isEditMode && (
                <div
                    className="w-100"
                    onDoubleClick={() => {
                        setIsEditMode(true);
                    }}
                >
                    <Tooltip title={getLabel()}>
                        <TextEllipsis>{getLabel()}</TextEllipsis>
                    </Tooltip>
                </div>
            )}

            {isEditMode && (
                <div
                    onBlur={() => {
                        setIsEditMode(false);
                        form.submit();
                    }}
                    style={{ width: "100%", margin: "0 auto" }}
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
