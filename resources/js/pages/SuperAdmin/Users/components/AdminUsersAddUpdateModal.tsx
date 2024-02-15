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
import { TUser } from "../../../../entities";
import { addUserMutation } from "../../../../api/mutation/useUserMutation";
import queryClient from "../../../../queryClient";
import {
    useGetAvailableSipTrunkingConnectionTelnyx,
    useUsersAll,
} from "../../../../api/query/userQuery";
import {
    DEFAULT_REQUIRED_MESSAGE,
    userRoleOption,
} from "../../../../constants";
import { useMobileNumbersQuery } from "../../../../api/query/mobileNumberQuery";
interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
    handleSubmit?: () => void;
    user?: TUser;
}
const AdminUsersAddUpdateModal = ({
    isModalOpen,
    closeModal,
    handleSubmit,
    user,
}: Props) => {
    const [form] = Form.useForm();
    const { users, isLoading } = useUsersAll();
    const role = Form.useWatch("role", form);

    const { data: mobileNumbers, isLoading: isMobileNumbersLoading } =
        useMobileNumbersQuery();

    const save = useMutation(addUserMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("users");
            closeModal();
            resetFields();
            if (handleSubmit) {
                handleSubmit();
            }
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const onFinish = (values) => {
        console.log(values);
        save.mutate({
            ...values,
            id: user?.id ? user.id : "",
        });
    };
    const resetFields = () => {
        closeModal();
        form.resetFields();
        // setError("");
    };
    useEffect(() => {
        if (user) {
            console.log(user);
            form.setFieldsValue(user);
            form.setFieldValue(
                "mobileNumbers",
                user.mobileNumbers?.map((data) => data.mobileNumber)
            );
        } else {
            form.resetFields();
        }
    }, [user]);
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
                    {user ? "Update" : "Create new"} User
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
                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[
                            {
                                required: true,
                                message: DEFAULT_REQUIRED_MESSAGE,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[
                            {
                                required: true,
                                message: DEFAULT_REQUIRED_MESSAGE,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: DEFAULT_REQUIRED_MESSAGE,
                            },
                        ]}
                    >
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item label="Mobile Number" name="mobileNumbers">
                        <Select
                            mode="multiple"
                            placeholder="Mobile Number"
                            defaultValue={[]}
                            style={{ width: "100%" }}
                            showSearch
                            options={mobileNumbers?.map((data) => ({
                                label: data.mobileNumber,
                                value: data.mobileNumber,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[
                            {
                                required: true,
                                message: DEFAULT_REQUIRED_MESSAGE,
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select Role"
                            style={{ width: "100%" }}
                            showSearch
                            options={userRoleOption}
                        />
                    </Form.Item>

                    {["user", "stats"].includes(role) && (
                        <Form.Item
                            label="Main User"
                            name="mainUserId"
                            rules={[
                                {
                                    required: true,
                                    message: DEFAULT_REQUIRED_MESSAGE,
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select main user"
                                style={{ width: "100%" }}
                                showSearch
                                options={users?.data
                                    ?.filter((user) => user?.role == "mainUser")
                                    ?.map((user) => {
                                        return {
                                            value: user.id,
                                            label: `${user?.firstName} ${user?.lastName}`,
                                        };
                                    })}
                            />
                        </Form.Item>
                    )}

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: DEFAULT_REQUIRED_MESSAGE,
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={save.isLoading}
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Space>
        </Modal>
    );
};

export default AdminUsersAddUpdateModal;
