import React, { useEffect, useState } from "react";
import {
    Button,
    Col,
    Input,
    Modal,
    Row,
    Space,
    Typography,
    Form,
    List,
    Popconfirm,
    message,
} from "antd";

import { useMutation } from "react-query";
import { saveCustomFieldValuesMutation } from "../api/mutation/useCustomFieldMutation";
import { defaultFilter } from "../constants";
import { useCustomFields } from "../api/query/customFieldQuery";
import { TContact, TCustomField } from "../entities";
import { mutateGet } from "../api/mutation/useSetupMutation";
import { ENDPOINTS } from "../endpoints";
import _ from "lodash";
interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
    handleSubmit: () => void;
    contactNumber: string;
}
const ModalAddExistingNumberContact = ({
    isModalOpen,
    closeModal,
    handleSubmit,
    contactNumber,
}: Props) => {
    const [form] = Form.useForm();
    const [step, setStep] = useState(1);
    const [selectedContact, setSelectedContact] = useState<
        TContact | undefined
    >(undefined);

    const [pagination, setPagination] = useState({
        page_size: 10,
        page: 1,
        total: 0,
    });
    const [contacts, setContacts] = useState<any>();

    const [filter, setFilter] = useState<any>(defaultFilter);

    const { data: filteredContacts, refetch: refetchFilteredContacts } =
        mutateGet(
            { ...filter, ...pagination },
            ENDPOINTS.contacts.url,
            "globalSearch"
        );

    const debouncedSearch = _.debounce((value) => {
        handleSearch(value);
    }, 300);

    const handleSearch = (value) => {
        setFilter({
            ...filter,
            filters: {
                conditions: [
                    { key: "firstName", condition: "contains", value: value },
                    { key: "lastName", condition: "contains", value: value },
                ],
                conditionalOperator: "or",
            },
        });
    };

    useEffect(() => {
        refetchFilteredContacts();
    }, [filter]);

    useEffect(() => {
        if (filteredContacts && filteredContacts.data) {
            setContacts(filteredContacts.data.data);
        }
    }, [filteredContacts]);

    const {
        data: contactFields,
        isLoading: isContactFieldsLoading,
        refetch: refetchContactFields,
    } = useCustomFields("contact");

    const save = useMutation(saveCustomFieldValuesMutation, {
        onSuccess: () => {
            resetFields();
            if (handleSubmit) {
                handleSubmit();
            }
        },
        onError: (e: any) => {
            message.error(e.message || "An error occurred");
        },
    });

    const resetFields = () => {
        closeModal();
        form.resetFields();
        // setError("");
    };

    console.log({ contactFields });
    return (
        <Modal
            title={<Typography.Text>Select Contact</Typography.Text>}
            open={isModalOpen}
            onCancel={resetFields}
            className="manage-column-field"
            footer={false}
        >
            {step === 1 ? (
                <>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Input
                                placeholder="Search Contact"
                                className="w-100"
                                onChange={(event: any) => {
                                    debouncedSearch(event.target.value);
                                }}
                            />
                        </Col>

                        <Col span={24} className="m-t-md">
                            <List
                                className="field-list"
                                size="large"
                                header={false}
                                footer={false}
                                bordered
                                dataSource={contacts}
                                renderItem={(contact: TContact) => {
                                    return (
                                        <div
                                            className="w-100"
                                            onClick={() => {
                                                setStep(2);
                                                setSelectedContact(contact);
                                            }}
                                        >
                                            <ListItemComponent
                                                text={`${contact.fields.firstName} ${contact.fields.lastName}`}
                                            />
                                        </div>
                                    );
                                }}
                            />
                        </Col>
                    </Row>
                </>
            ) : (
                <>
                    <Space className="m-b-sm">
                        <Typography.Text strong>
                            {`Phone type fields of ${selectedContact?.fields.firstName} ${selectedContact?.fields.lastName}`}
                        </Typography.Text>
                        <Button
                            type="link"
                            className="p-l-none"
                            onClick={() => setStep(1)}
                        >
                            Change
                        </Button>
                    </Space>

                    <List
                        className="field-list"
                        size="large"
                        header={false}
                        footer={false}
                        bordered
                        dataSource={contactFields?.filter(
                            (customField: TCustomField) =>
                                ["phone", "mobile"].includes(customField.type)
                        )}
                        renderItem={(customField: TCustomField) => {
                            return (
                                <Popconfirm
                                    title="Update Contact"
                                    description={`Are you sure you want to replace this field with ${contactNumber}?`}
                                    onConfirm={async () => {
                                        await save.mutate({
                                            customableId: selectedContact?.id,
                                            customableType: "contact",
                                            fields: {
                                                [customField.fieldName]:
                                                    contactNumber,
                                            },
                                        });
                                    }}
                                >
                                    <div className="w-100">
                                        <ListItemComponent
                                            text={customField.label}
                                            subText={
                                                selectedContact?.fields[
                                                    customField.fieldName
                                                ] ?? "Not set"
                                            }
                                        />
                                    </div>
                                </Popconfirm>
                            );
                        }}
                    />
                </>
            )}
        </Modal>
    );
};

const ListItemComponent = ({
    text,
    subText,
}: {
    text: string;
    subText?: string;
}) => {
    return (
        <>
            <List.Item
                style={{
                    cursor: "pointer",
                }}
            >
                <Space direction="vertical" size={0}>
                    <Typography.Text strong>{text}</Typography.Text>
                    <Typography.Text>{subText ?? ""}</Typography.Text>
                </Space>
            </List.Item>
        </>
    );
};

export default ModalAddExistingNumberContact;
