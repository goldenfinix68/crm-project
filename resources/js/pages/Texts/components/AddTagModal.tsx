import React from "react";
import { Button, Modal, Space, Typography, Form } from "antd";

import { CloseOutlined } from "@ant-design/icons";

import { useMutation } from "react-query";
import { addTagMutation } from "../../../api/mutation/useTextMutation";
import queryClient from "../../../queryClient";
import { useAppContextProvider } from "../../../context/AppContext";
import CustomFieldInput from "../../../components/CustomFieldInput";
interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
    threadIds: string[];
}
const AddTagModal = ({ isModalOpen, closeModal, threadIds }: Props) => {
    const [form] = Form.useForm();
    const { contactFields } = useAppContextProvider();
    const tagField = contactFields.find((field) => field.type == "tag");

    const save = useMutation(addTagMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("thread");
            resetFields();
        },
    });

    const onFinish = async (values: any) => {
        await save.mutate({
            ...values,
            threadIds: threadIds,
            customField: tagField,
        });
    };
    const resetFields = () => {
        closeModal();
        form.resetFields();
    };

    return (
        <Modal
            className="modal-activity"
            open={isModalOpen}
            onCancel={closeModal}
            footer={null}
            title={null}
            closable={false}
            width={"300px"}
        >
            <div className="modal-header">
                <Typography.Title level={5} style={{ color: "white" }}>
                    Add Tag
                </Typography.Title>

                <Button
                    onClick={closeModal}
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        border: "0px",
                    }}
                    icon={<CloseOutlined style={{ color: "white" }} />}
                />
            </div>
            <Space
                direction="vertical"
                style={{ padding: "20px", width: "100%", paddingTop: "30px" }}
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
                    <CustomFieldInput customField={tagField!} />

                    <Space style={{ paddingTop: "5px" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={save.isLoading}
                        >
                            Save
                        </Button>

                        <Button onClick={resetFields}>Cancel</Button>
                    </Space>
                </Form>
            </Space>
        </Modal>
    );
};

export default AddTagModal;
