import React, { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
    Col,
    Empty,
    Form,
    Input,
    List,
    Modal,
    Row,
    Select,
    Space,
    Typography,
} from "antd";
import { FIELD_TYPE_LIST } from "../../../constants";
import validateRules from "../../../providers/validateRules";
import { addActivityCustomeFieldMutation } from "../../../api/mutation/useActivityMutation";
import { useMutation, useQueryClient } from "react-query";
interface ModalManageColumnFIeldProps {
    modalManageColumnField: any;
    setModalManageColumnField: any;
    handleOpenManageColumnFieldClose: any;
}

const ModalManageColumnFIeld: React.FC<ModalManageColumnFIeldProps> = (
    props
) => {
    const {
        modalManageColumnField,
        setModalManageColumnField,
        handleOpenManageColumnFieldClose,
    } = props;

    const queryClient = useQueryClient();
    const [fieldTypeList, setFieldTypeList]: any = useState(FIELD_TYPE_LIST);
    const [form] = Form.useForm();
    const onSeachFields = (value: string) => {
        if (value) {
            let filteredColumns = FIELD_TYPE_LIST.filter((str: any) =>
                str.label.toLowerCase().includes(value.toLowerCase())
            );

            setFieldTypeList(filteredColumns);
        } else {
            setFieldTypeList(FIELD_TYPE_LIST);
        }
    };

    const [dataCustomField, setDataCustomField] = useState({
        type: "",
        name: "",
        // label: "",
        // values: "",
        // section: "",
        // association_type: "",
        // related_record_label: "",
        // required: false,
    });
    const [selectedType, setSelectedType] = useState(null);

    const handleSelectField = (values: any) => {
        setSelectedType(values);
        let data = {
            ...modalManageColumnField,
            title: "Add Custom Field",
            step: 2,
        };
        setModalManageColumnField(data);

        let customField = {
            ...dataCustomField,
            type: values.type,
        };
        setDataCustomField(customField);
    };

    const changeSelectField = () => {
        setSelectedType(null);
        let data = {
            ...modalManageColumnField,
            title: "Select Field Type",
            step: 1,
        };
        setModalManageColumnField(data);
    };

    const onFinish = (values: any) => {
        console.log("onFinish", values);

        addCustomField.mutate(values);
    };

    const addCustomField = useMutation(addActivityCustomeFieldMutation, {
        onSuccess: (res) => {
            console.log("addCustomField", res);
            queryClient.invalidateQueries("get_activity_custom_field");
        },
    });

    return (
        <Modal
            title={
                <Typography.Text>
                    {modalManageColumnField.title}
                </Typography.Text>
            }
            open={modalManageColumnField.show}
            onCancel={() => handleOpenManageColumnFieldClose()}
            className="manage-column-field"
            footer={
                modalManageColumnField.step === 1 ? (
                    false
                ) : (
                    <Space key={"btn"}>
                        <Button
                            type="primary"
                            onClick={() => {
                                form.validateFields()
                                    .then((values) => {
                                        values = {
                                            ...values,
                                            ...dataCustomField,
                                            name: values.label
                                                .replace(/ /g, "_")
                                                .toLowerCase(),
                                        };
                                        onFinish(values);
                                    })
                                    .catch((info) => {});
                            }}
                        >
                            Save
                        </Button>

                        <Button>Cancel</Button>
                    </Space>
                )
            }
        >
            {modalManageColumnField.step === 1 ? (
                <>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Input
                                placeholder="Search Field"
                                className="w-100"
                                onChange={(event: any) => {
                                    onSeachFields(
                                        event.target.value
                                            ? event.target.value
                                            : ""
                                    );
                                }}
                            />
                        </Col>

                        <Col span={24} className="m-t-md">
                            <FieldTypeListComponent
                                fieldTypeList={fieldTypeList}
                                handleSelectField={handleSelectField}
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
                            required: false,
                        }}
                    >
                        <AddCustomFieldForm
                            selectedType={selectedType}
                            modalManageColumnField={modalManageColumnField}
                            changeSelectField={changeSelectField}
                        />
                    </Form>
                </>
            )}
        </Modal>
    );
};

export default ModalManageColumnFIeld;

interface FieldTypeListComponentProps {
    fieldTypeList: [];
    handleSelectField: any;
}

const FieldTypeListComponent: React.FC<FieldTypeListComponentProps> = (
    props
) => {
    const { fieldTypeList, handleSelectField } = props;
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
                        {/* <Row gutter={12} className="w-100">
                            <Col span={2}>
                                <span className={item.icon} />
                            </Col> */}
                        {/* <Col span={22}> */}
                        <Space direction="vertical" size={0}>
                            <Typography.Text strong>
                                {item.label}
                            </Typography.Text>
                            <Typography.Text>
                                {item.description}
                            </Typography.Text>
                        </Space>
                        {/* </Col>
                        </Row> */}
                    </List.Item>
                )}
            />
        </>
    );
};

interface AddCustomFieldFormProps {
    selectedType: any;
    modalManageColumnField: any;
    changeSelectField: any;
}
const AddCustomFieldForm: React.FC<AddCustomFieldFormProps> = (props) => {
    const { selectedType, modalManageColumnField, changeSelectField } = props;
    return (
        <>
            <Space className="m-b-sm">
                <Typography.Text strong>
                    {`${selectedType.type} `}field for Activities
                </Typography.Text>
                <Button
                    type="link"
                    className="p-l-none"
                    onClick={() => changeSelectField()}
                >
                    Change
                </Button>
            </Space>

            <Form.Item
                name={"label"}
                label="Label"
                rules={[validateRules.required]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name={"section_name"}
                label="Section Name"
                rules={[validateRules.required]}
                initialValue={"Default"}
            >
                <Select>
                    <Select.Option value="Default">Default</Select.Option>
                </Select>
            </Form.Item>

            {selectedType.type === "Select" && (
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item name="values" label="Pick list values">
                            <Input.TextArea rows={5} />
                        </Form.Item>
                    </Col>

                    <Col span={12} className="p-t-md">
                        <Typography.Text style={{ fontSize: 12 }}>
                            ter one per line, for example (about Customer
                            Industry): Accounting Health Care Information
                            Technology
                        </Typography.Text>
                    </Col>
                </Row>
            )}

            <Form.Item name={"required"} valuePropName="checked">
                <Checkbox checked={false}>Required</Checkbox>
            </Form.Item>
        </>
    );
};
