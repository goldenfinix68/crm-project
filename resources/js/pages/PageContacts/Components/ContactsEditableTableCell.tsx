import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Button, Form, Input, Popconfirm, Space, message } from "antd";

import React from "react";
import CustomFieldInput from "../../../components/CustomFieldInput";
import { saveCustomFieldValuesMutation } from "../../../api/mutation/useCustomFieldMutation";
import { useMutation } from "react-query";
import queryClient from "../../../queryClient";
import { TCustomField } from "../../../entities";
import { Link } from "react-router-dom";
import ContactTypeTag from "../../../components/ContactTypeTag";
import { useAppContextProvider } from "../../../context/AppContext";

interface ContactsEditableTableCellProps {
    record: any;
    field: TCustomField;
    handleSubmit?: () => void;
}

const ContactsEditableTableCell = ({
    record,
    field,
    handleSubmit,
}: ContactsEditableTableCellProps) => {
    const [form] = Form.useForm();
    const { isRoleStats } = useAppContextProvider();

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
        return record[field.fieldName] ?? "_";
    };

    return (
        <div
            className="cell cell-hover"
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "10px",
                paddingRight: "1px",
                borderRadius: "5px",
                paddingTop: "0px",
                paddingBottom: "0px",
                height: "40px", // Set a fixed height for the cell
                width: "100%", // Set the width to 100%
                overflow: "hidden",
            }}
        >
            {getLabel()}

            <Popconfirm
                title={null}
                icon={null}
                description={
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
                        <CustomFieldInput customField={field} />
                    </Form>
                }
                onConfirm={() => {
                    form.submit();
                }}
                okText="Save"
                cancelText="No"
            >
                <Button
                    style={{
                        margin: "2px",
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "white",
                    }}
                    className="cell-hover-btn"
                    type="text"
                    disabled={isRoleStats}
                >
                    {<FontAwesomeIcon icon={faPen} />}
                </Button>
            </Popconfirm>
            {/* // )} */}
        </div>
    );
};

export default ContactsEditableTableCell;
