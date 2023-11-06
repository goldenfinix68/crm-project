import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Button,
    Col,
    Dropdown,
    Input,
    Modal,
    Radio,
    Row,
    Space,
    Table,
    Tooltip,
    Typography,
    Form,
    Select,
    DatePicker,
    Popover,
    List,
} from "antd";

import {
    CaretDownOutlined,
    CloseOutlined,
    PlusOutlined,
} from "@ant-design/icons";

import { useMutation } from "react-query";
import { sendTextMutation } from "../../../api/mutation/useTextMutation";
import queryClient from "../../../queryClient";
import TextForm from "../../Texts/components/TextForm";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { createTextTemplateMutation } from "../../../api/mutation/useTextTemplateMutation";
import { useTextTemplateFolders } from "../../../api/query/textTemplateQuery";
import LoadingComponent from "../../../components/LoadingComponent";
import Search from "antd/es/input/Search";
import { TTextTemplate } from "../../../entities";
import AddAttributePopoverContent from "./AddAttributePopoverContent";
interface Props {
    template?: TTextTemplate;
    isModalOpen: boolean;
    handleClose: () => void;
}
const AddUpdateTemplateModal = ({
    template,
    isModalOpen,
    handleClose,
}: Props) => {
    const [isAttributePopoverOpen, setIsAttributePopoverOpen] = useState(false);
    const [form] = Form.useForm();
    const { folders, isLoading } = useTextTemplateFolders();
    const textMessage = Form.useWatch("textMessage", form);

    const createTemplate = useMutation(createTextTemplateMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("textTemplates");
            resetFields();
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const onFinish = async (values: any) => {
        await createTemplate.mutate({
            ...values,
            id: template?.id ? template.id : "",
        });
    };
    const resetFields = () => {
        handleClose();
        form.resetFields();
    };
    useEffect(() => {
        if (template?.name) {
            form.setFieldsValue(template);
        } else {
            form.resetFields();
        }
    }, [template]);

    if (isLoading) {
        return <LoadingComponent />;
    }
    return (
        <>
            <Modal
                className="modal-activity"
                open={isModalOpen}
                onCancel={resetFields}
                footer={null}
                title={null}
                closable={false}
            >
                <div className="modal-header">
                    <Typography.Title level={5} style={{ color: "white" }}>
                        {template ? "Update" : "Create new"} Template
                    </Typography.Title>

                    <Button
                        onClick={resetFields}
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            border: "0px",
                        }}
                        icon={<CloseOutlined style={{ color: "white" }} />}
                    />
                </div>
                <Space
                    direction="vertical"
                    style={{
                        padding: "20px",
                        width: "100%",
                        paddingTop: "30px",
                    }}
                    size={0}
                >
                    <Form
                        name="basic"
                        layout="vertical"
                        labelWrap
                        onFinish={onFinish}
                        autoComplete="off"
                        form={form}
                    >
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label="Template name"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Folder"
                                    name="folderId"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select style={{ width: "100%" }}>
                                        {folders?.map((folder, index) => (
                                            <Select.Option
                                                value={folder.id}
                                                key={folder.id}
                                            >
                                                {folder.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            label="Text message"
                            name="textMessage"
                            rules={[
                                {
                                    required: true,
                                    message: "this is required",
                                },
                            ]}
                        >
                            <Input.TextArea
                                rows={4}
                                placeholder="Type here ..."
                            />
                        </Form.Item>

                        <Space
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                                marginTop: "-20px",
                                marginBottom: "20px",
                            }}
                        >
                            <Typography.Text>
                                Count: {textMessage?.length ?? 0}
                            </Typography.Text>
                            <Popover
                                content={
                                    <AddAttributePopoverContent
                                        handleSelect={(value) => {
                                            const currentMessage =
                                                form.getFieldValue(
                                                    "textMessage"
                                                );
                                            form.setFieldValue(
                                                "textMessage",
                                                `${currentMessage ?? ""}{{${
                                                    value.fieldName
                                                }}}`
                                            );
                                            setIsAttributePopoverOpen(false);
                                        }}
                                    />
                                }
                                title={
                                    <Button
                                        type="link"
                                        style={{ padding: 0 }}
                                        onClick={() =>
                                            setIsAttributePopoverOpen(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                }
                                trigger={"click"}
                                open={isAttributePopoverOpen}
                            >
                                <Button
                                    type="link"
                                    onClick={() =>
                                        setIsAttributePopoverOpen(true)
                                    }
                                >
                                    Insert Attribute <CaretDownOutlined />
                                </Button>
                            </Popover>
                        </Space>

                        <Space style={{ paddingTop: "5px" }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={createTemplate.isLoading}
                            >
                                Save
                            </Button>

                            <Button onClick={resetFields}>Cancel</Button>
                        </Space>
                    </Form>
                </Space>
            </Modal>
        </>
    );
};

export default AddUpdateTemplateModal;
