import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Button, Form, Input, Popconfirm, Space } from "antd";

import React from "react";
import CustomFieldInput from "../../../components/CustomFieldInput";
import { updateCustomFieldValueMutation } from "../../../api/mutation/useCustomFieldMutation";
import { useMutation } from "react-query";
import queryClient from "../../../queryClient";
import { TCustomField } from "../../../entities";
import { Link } from "react-router-dom";
import ContactTypeTag from "../../../components/ContactTypeTag";

interface ContactsEditableTableCellProps {
    record: any;
    field: TCustomField;
    lastNameField?: TCustomField;
    isNameField?: boolean;
    handleUpdateContactClick?: (contactId) => void;
}

const ContactsEditableTableCell = ({
    record,
    field,
    lastNameField,
    isNameField = false,
    handleUpdateContactClick,
}: ContactsEditableTableCellProps) => {
    const [form] = Form.useForm();
    const [isHovered, setIsHovered] = React.useState(false);
    const [isPopconfirmOpen, setIsPopconfirmOpen] = React.useState(false);

    const quickUpdate = useMutation(updateCustomFieldValueMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("contacts");
            setIsPopconfirmOpen(false);
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const handleFinish = async (values) => {
        if (isNameField) {
            await quickUpdate.mutate({
                fields: [
                    {
                        firstName: values.firstName,
                        customFieldValueId: record["firstNameId"],
                    },
                    {
                        lastName: values.lastName,
                        customFieldValueId: record["lastNameId"],
                    },
                ],
            });
        } else {
            await quickUpdate.mutate({
                fields: [
                    {
                        ...values,
                        customFieldValueId: record[field.fieldName + "Id"],
                    },
                ],
            });
        }
    };

    const getLabel = () => {
        if (field.type == "contactTypeLookup") {
            return <ContactTypeTag fields={record} />;
        }
        return record[field.fieldName];
    };

    return (
        <div
            style={{
                backgroundColor: isHovered || isPopconfirmOpen ? "#ADD8E6" : "",
                borderRadius: "5px",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-100"
        >
            <Space
                className="w-100"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                {isNameField ? (
                    <Space>
                        <Button
                            type="text"
                            size="small"
                            icon={<FontAwesomeIcon icon={faPen} />}
                            onClick={() => {
                                if (handleUpdateContactClick) {
                                    handleUpdateContactClick(
                                        record["contactId"]
                                    );
                                }
                            }}
                        />
                        <Avatar
                            className="avatarText m-r-sm"
                            // src={record.avatar}
                            size={32}
                            style={{
                                backgroundColor: "#1677FF",
                                verticalAlign: "middle",
                            }}
                        >
                            {record[field.fieldName]?.charAt(0)}
                        </Avatar>
                        <Link to={`/contacts/${record.contactId}`}>{`${
                            record[field.fieldName]
                        } ${record["lastName"]}`}</Link>
                    </Space>
                ) : (
                    getLabel()
                )}

                {(isHovered || isPopconfirmOpen) && (
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
                                              record[
                                                  field.fieldName + "lookupIds"
                                              ]
                                          )
                                        : record[field.fieldName],
                                    lastName: isNameField
                                        ? record["lastName"]
                                        : "",
                                }}
                                layout="vertical"
                            >
                                {isNameField ? (
                                    <>
                                        <CustomFieldInput customField={field} />
                                        <CustomFieldInput
                                            customField={lastNameField!}
                                        />
                                    </>
                                ) : (
                                    <CustomFieldInput customField={field} />
                                )}
                            </Form>
                        }
                        onConfirm={() => {
                            form.submit();
                        }}
                        onCancel={() => {
                            setIsPopconfirmOpen(false);
                            form.resetFields();
                        }}
                        okText="Save"
                        cancelText="No"
                        open={isPopconfirmOpen}
                    >
                        <Button
                            type="text"
                            size="small"
                            icon={<FontAwesomeIcon icon={faPen} />}
                            onClick={() => {
                                setIsPopconfirmOpen(true);
                            }}
                        />
                    </Popconfirm>
                )}
            </Space>
        </div>
    );
};

export default ContactsEditableTableCell;
