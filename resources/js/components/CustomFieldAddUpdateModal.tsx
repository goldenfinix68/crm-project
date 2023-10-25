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
import { TCustomField } from "../entities";
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

    const data = [
        {
            title: "Text",
            description: "The text field can store up to 255 characters",
            icon: <FontAwesomeIcon icon={faFont} />,
        },
        {
            title: "Text Area",
            description:
                "This field lets you store much bigger texts than text fields. Such fields are not visible on reports or grids.",
            icon: <FontAwesomeIcon icon={faSquare} />,
        },
        {
            title: "Integer",
            description:
                "The integer field can have numeric values without any demical points",
            icon: <FontAwesomeIcon icon={fa1} />,
        },
        {
            title: "Decimal",
            description:
                "The decimal field can have numeric values with two decimal points",
            icon: <FontAwesomeIcon icon={faCircleDot} />,
        },
        {
            title: "Date",
            description:
                "The field lets you select date input using the calendar component.",
            icon: <FontAwesomeIcon icon={faCalendarDay} />,
        },
        {
            title: "Date Time",
            description:
                "The field lets you select a date and time information using calendar + time picker.",
            icon: <FontAwesomeIcon icon={faClock} />,
        },
        {
            title: "Email",
            description: "The field lets you enter a valid email address.",
            icon: <FontAwesomeIcon icon={faEnvelope} />,
        },
        {
            title: "Phone",
            description: "The field lets you enter a phone or mobile number.",
            icon: <FontAwesomeIcon icon={faPhone} />,
        },
        {
            title: "Select",
            description:
                "The field lets you define a list of options that will appear in the dropdown. You can select a single option from the list.",
            icon: <FontAwesomeIcon icon={faCircleArrowDown} />,
        },
        {
            title: "Multi Select",
            description:
                "The field lets define a list of options that will appear in the dropdown. You can select multiple options from the list.",
            icon: <FontAwesomeIcon icon={faSquareCheck} />,
        },
        {
            title: "Contact Lookup",
            description:
                "The field lets you associate the contact record with your module.",
            icon: <FontAwesomeIcon icon={faUser} />,
        },
        {
            title: "User Lookup",
            description:
                "The field lets you associate the user record with your module.",
            icon: <FontAwesomeIcon icon={faCircleUser} />,
        },
        {
            title: "URL",
            description:
                "The field lets you enter a website or page URL, which appears as a clickable link.",
            icon: <FontAwesomeIcon icon={faLink} />,
        },
        {
            title: "Big Integer",
            description:
                "The big integer field can have numeric values without any decimal points. Big Integer can go up to 9223372036854775807",
            icon: <FontAwesomeIcon icon={fa1} />,
        },
        {
            title: "Percentage",
            description:
                "The field can have numeric values that appear with a % sign during display.",
            icon: <FontAwesomeIcon icon={faPercentage} />,
        },
        {
            title: "Boolean",
            description:
                "The field lets you create a single value (true/false) option with a toggle operation.",
            icon: <FontAwesomeIcon icon={faCircleDot} />,
        },
        {
            title: "Currency",
            description:
                "The field lets you create a numeric value with decimals that appears with the organization's currency symbol during display.",
            icon: <FontAwesomeIcon icon={faDollarSign} />,
        },
        {
            title: "Formula",
            description:
                "The field presents calculated information on basis of the other fields.",
            icon: <FontAwesomeIcon icon={faCalculator} />,
        },
    ];

    const createCustomField = useMutation(createCustomFieldMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("customFieldSections");
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
            console.log(customField);
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

                        <Button onClick={resetFields}>Cancel</Button>
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
}: {
    fieldTypeList: any;
    handleSelectField: any;
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
                renderItem={(item: any) => (
                    <List.Item
                        onClick={() => {
                            handleSelectField(item);
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
                )}
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
