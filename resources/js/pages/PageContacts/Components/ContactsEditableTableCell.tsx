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
    Select,
} from "antd";

import React, { useState } from "react";
import CustomFieldInput from "../../../components/CustomFieldInput";
import { saveCustomFieldValuesMutation } from "../../../api/mutation/useCustomFieldMutation";
import { useMutation } from "react-query";
import queryClient from "../../../queryClient";
import { TCustomField } from "../../../entities";
import { Link } from "react-router-dom";
import ContactTypeTag from "../../../components/ContactTypeTag";
import { useAppContextProvider } from "../../../context/AppContext";
import { EditOutlined } from "@ant-design/icons";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";

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

    const [phoneFieldStatus, setPhoneFieldStatus] = useState(
        record[field.fieldName + "Status"] ?? ""
    );

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
            phoneFieldStatus,
        });
    };

    const getLabel = () => {
        if (field.type == "contactTypeLookup") {
            return <ContactTypeTag fields={record} />;
        }
        return Boolean(record[field.fieldName]) ? record[field.fieldName] : "_";
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
                width: "100%", // Set the width to 100%
                overflow: "hidden",
            }}
        >
            <Tooltip title={getLabel()}>{getLabel()}</Tooltip>

            <Popconfirm
                title={null}
                icon={null}
                description={
                    <div className="w-100">
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

                            {(field?.type == "phone" ||
                                field?.type == "mobile") && (
                                <Space direction="vertical" className="w-100">
                                    <label>Phone Field Status</label>
                                    <Select
                                        className="w-100"
                                        onChange={(e) => setPhoneFieldStatus(e)}
                                        value={phoneFieldStatus}
                                    >
                                        <Select.Option value="badNumber">
                                            Bad Number
                                        </Select.Option>
                                        <Select.Option value="smsSent">
                                            SMS Sent
                                        </Select.Option>
                                    </Select>
                                </Space>
                            )}
                        </Form>
                    </div>
                }
                onConfirm={() => {
                    form.submit();
                }}
                okText="Save"
                cancelText="Cancel"
                overlayInnerStyle={{ zIndex: 999 }}
                style={{ zIndex: 999 }}
                overlayStyle={{ zIndex: 999 }}
            >
                {/* <Button
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
                </Button> */}
                <EditOutlined className="cell-hover-btn" />
            </Popconfirm>
        </div>
    );
};

export default ContactsEditableTableCell;
