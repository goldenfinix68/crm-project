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
} from "antd";

import { CloseOutlined } from "@ant-design/icons";

import { useMutation } from "react-query";
import { TFilter, TFilters } from "../entities";
import { createFilterMutation } from "../api/mutation/useFilterMutation";
import queryClient from "../queryClient";
import { DEFAULT_REQUIRED_MESSAGE } from "../constants";
interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
    filter?: TFilter;
    type: string;
}
const FilterAddUpdateModal = ({
    isModalOpen,
    closeModal,
    filter,
    type,
}: Props) => {
    const [form] = Form.useForm();
    const createAs = Form.useWatch("createAs", form);

    const save = useMutation(createFilterMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("filters");
            closeModal();
            resetFields();
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const onFinish = async (values: any) => {
        await save.mutate({
            ...filter,
            ...values,
            type,
            id: filter?.id && createAs == "update" ? filter.id : "",
        });
    };
    const resetFields = () => {
        closeModal();
        form.resetFields();
        // setError("");
    };
    useEffect(() => {
        if (filter?.name) {
            form.setFieldsValue({ name: filter.name, createAs: "update" });
        } else {
            form.resetFields();
        }
    }, [filter]);

    return (
        <Modal
            className="modal-activity"
            open={isModalOpen}
            onCancel={closeModal}
            footer={null}
            title={null}
            closable={false}
        >
            <div className="modal-header">
                <Typography.Title level={5} style={{ color: "white" }}>
                    Filter
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
                <Form layout="vertical" onFinish={onFinish} form={form}>
                    {filter?.id && (
                        <Form.Item
                            name="createAs"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select an option",
                                },
                            ]}
                        >
                            <Radio.Group style={{ display: "block" }}>
                                <Radio value="update">
                                    {`Save changes to this view "${filter.name}"`}
                                </Radio>
                                <Radio value="new" className="p-t-lg">
                                    Create new view
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    )}

                    <Form.Item
                        name="name"
                        label="Filter name"
                        rules={[
                            {
                                required: true,
                                message: DEFAULT_REQUIRED_MESSAGE,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Space style={{ paddingTop: "5px" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={save.isLoading}
                        >
                            Save
                        </Button>

                        <Button onClick={resetFields}>
                            {filter?.id ? "No" : "Cancel"}
                        </Button>
                    </Space>
                </Form>
            </Space>
        </Modal>
    );
};

export default FilterAddUpdateModal;
