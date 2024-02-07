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
    Select,
    List,
    Checkbox,
    Radio,
    Tooltip,
} from "antd";

import { useMutation } from "react-query";
import { createCustomFieldMutation } from "../api/mutation/useCustomFieldMutation";
import queryClient from "../queryClient";
import { FIELD_TYPE_LIST } from "../constants";
import {
    faFont,
    faSquare,
    fa1,
    faCircleDot,
    faCalendarDay,
    faClock,
    faEnvelope,
    faPhone,
    faCircleArrowDown,
    faSquareCheck,
    faUser,
    faCircleUser,
    faLink,
    faPercentage,
    faDollarSign,
    faCalculator,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import validateRules from "../providers/validateRules";
import { useCustomFieldSections } from "../api/query/customFieldQuery";
import { TCustomField, TCustomFieldSection } from "../entities";
interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
    handleSubmit: () => void;
    customField?: TCustomField;
    type: string;
}
const CustomFieldAddUpdateModal = ({
    isModalOpen,
    closeModal,
    handleSubmit,
    customField,
    type,
}: Props) => {
    const [form] = Form.useForm();
    const [step, setStep] = useState(1);
    const [selectedFieldType, setSelectedFieldType] = useState<
        | {
              label: string;
              type: string;
              description: string;
              icon: string;
          }
        | undefined
    >();
    const [searchKey, setSearchKey] = useState("");

    const {
        data: sections,
        isLoading,
        refetch: refetchSections,
    } = useCustomFieldSections(type);

    const createCustomField = useMutation(createCustomFieldMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("customFieldSections");
            handleSubmit();
            closeModal();
            resetFields();
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const onFinish = async (values: any) => {
        await createCustomField.mutate({
            ...values,
            id: customField?.id ? customField.id : "",
            type: selectedFieldType?.type,
            tableSort: customField?.tableSort,
        });
    };
    const resetFields = () => {
        closeModal();
        form.resetFields();
        // setError("");
    };
    useEffect(() => {
        if (customField) {
            setSelectedFieldType(
                FIELD_TYPE_LIST.find((field) => field.type == customField.type)
            );
            setStep(2);
            form.setFieldsValue(customField);
        } else {
            setSelectedFieldType(undefined);
            setStep(1);
            form.resetFields();
        }
    }, [customField]);

    useEffect(() => {
        refetchSections();
    }, []);

    const fieldTypeList = () => {
        if (searchKey) {
            return FIELD_TYPE_LIST.filter((str: any) =>
                str.label.toLowerCase().includes(searchKey.toLowerCase())
            );
        } else {
            return FIELD_TYPE_LIST;
        }
    };

    return (
        <Modal
            title={<Typography.Text>Select Field Type</Typography.Text>}
            open={isModalOpen}
            onCancel={resetFields}
            className="manage-column-field"
            footer={
                step === 1 ? null : (
                    <Space key={"btn"}>
                        <Button
                            type="primary"
                            onClick={() => {
                                form.validateFields()
                                    .then((values) => {
                                        form.submit();
                                    })
                                    .catch((info) => {});
                            }}
                            loading={createCustomField.isLoading}
                        >
                            Save
                        </Button>

                        <Button onClick={resetFields}>
                            {customField ? "Cancel" : "No"}
                        </Button>
                    </Space>
                )
            }
        >
            {step === 1 ? (
                <>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Input
                                placeholder="Search Field"
                                className="w-100"
                                onChange={(event: any) => {
                                    setSearchKey(event.target.value);
                                }}
                            />
                        </Col>

                        <Col span={24} className="m-t-md">
                            <FieldTypeListComponent
                                fieldTypeList={fieldTypeList()}
                                handleSelectField={(fieldType) => {
                                    setStep(2);
                                    setSelectedFieldType(fieldType);
                                }}
                                sections={sections}
                            />
                        </Col>
                    </Row>
                </>
            ) : (
                <>
                    <Form
                        layout="vertical"
                        form={form}
                        initialValues={{
                            isRequired: false,
                            customFieldSectionId: sections?.length
                                ? sections[0].id
                                : "",
                            associationType: "single",
                        }}
                        onFinish={onFinish}
                    >
                        <AddCustomFieldForm
                            selectedType={selectedFieldType}
                            changeSelectField={() => {
                                setStep(1);
                                setSelectedFieldType(undefined);
                            }}
                            type={type}
                            sections={sections}
                        />
                    </Form>
                </>
            )}
        </Modal>
    );
};

const FieldTypeListComponent = ({
    fieldTypeList,
    handleSelectField,
    sections,
}: {
    fieldTypeList: any;
    handleSelectField: any;
    sections?: TCustomFieldSection[];
}) => {
    return (
        <>
            <List
                className="field-list"
                size="large"
                header={false}
                footer={false}
                bordered
                dataSource={fieldTypeList}
                renderItem={(item: any) => {
                    let isItemDisabled = false;
                    if (item.creationLimit) {
                        let count = 0;
                        sections?.forEach((section) => {
                            // Check if the section has fields
                            if (section.fields && section.fields.length > 0) {
                                // Loop through the fields in the section
                                section.fields.forEach((field) => {
                                    if (field.type === item.type) {
                                        // If the field type matches the target type, increment the count
                                        count++;
                                    }
                                });
                            }
                        });
                        isItemDisabled = count >= item.creationLimit;
                    }
                    return (
                        <Tooltip
                            title={
                                isItemDisabled
                                    ? `Creation limit reached. You can only create ${item.creationLimit} of this field`
                                    : ""
                            }
                        >
                            <List.Item
                                style={{
                                    cursor: isItemDisabled
                                        ? "not-allowed"
                                        : "pointer",
                                    opacity: isItemDisabled ? 0.5 : 1,
                                }}
                                onClick={() => {
                                    if (!isItemDisabled) {
                                        handleSelectField(item);
                                    }
                                }}
                            >
                                <Space direction="vertical" size={0}>
                                    <Typography.Text strong>
                                        {item.label}
                                    </Typography.Text>
                                    <Typography.Text>
                                        {item.description}
                                    </Typography.Text>
                                </Space>
                            </List.Item>
                        </Tooltip>
                    );
                }}
            />
        </>
    );
};

const AddCustomFieldForm = ({
    selectedType,
    changeSelectField,
    type,
    sections,
}): any => {
    return (
        <>
            <Space className="m-b-sm">
                <Typography.Text strong>
                    {`${selectedType.label} field for ${
                        type.charAt(0).toUpperCase() + type.slice(1)
                    }`}
                </Typography.Text>
                <Button
                    type="link"
                    className="p-l-none"
                    onClick={changeSelectField}
                >
                    Change
                </Button>
            </Space>

            <Form.Item name="sort" style={{ display: "none" }}>
                <Input hidden />
            </Form.Item>

            {(selectedType.type == "contactLookup" ||
                selectedType.type == "userLookup" ||
                selectedType.type == "contactTypeLookup") && (
                <Form.Item
                    name="associationType"
                    rules={[
                        {
                            required: true,
                            message: "Please select an option",
                        },
                    ]}
                >
                    <Radio.Group>
                        <Radio value="single">
                            <Space direction="vertical" size={0}>
                                <Typography.Title level={5}>
                                    Single
                                </Typography.Title>
                                Let you associate single contact with a record.
                                Associated contact will appear inside the
                                listing screen too.
                            </Space>
                        </Radio>
                        <Radio value="multiple" className="p-t-lg">
                            <Space direction="vertical" size={0}>
                                <Typography.Title level={5}>
                                    Multiple
                                </Typography.Title>
                                Let you associate multiple contacts with a
                                record. Associated contacts will not appear in
                                the list view. They will only appear inside a
                                detailed view.
                            </Space>
                        </Radio>
                    </Radio.Group>
                </Form.Item>
            )}

            <Form.Item
                name={"label"}
                label="Label"
                rules={[validateRules.required]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name={"customFieldSectionId"}
                label="Section Name"
                rules={[validateRules.required]}
                initialValue={"Default"}
            >
                <Select showSearch>
                    {sections?.map((section) => (
                        <Select.Option value={section.id}>
                            {section.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            {selectedType.type === "select" ||
            selectedType.type === "multiSelect" ? (
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item name="options" label="Pick list values">
                            <Input.TextArea rows={5} />
                        </Form.Item>
                    </Col>

                    <Col span={12} className="p-t-md">
                        <Typography.Text style={{ fontSize: 12 }}>
                            Enter one per line, for example (about Customer
                            Industry): <br />
                            Accounting <br />
                            Health Care <br />
                            Information Technology
                        </Typography.Text>
                    </Col>
                </Row>
            ) : (
                ""
            )}

            <Form.Item name="isRequired" valuePropName="checked">
                <Checkbox>Required</Checkbox>
            </Form.Item>
        </>
    );
};

export default CustomFieldAddUpdateModal;
