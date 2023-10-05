import { Card, Button, Form, Input, InputNumber, Select } from "antd";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined, UserAddOutlined } from "@ant-design/icons";

import { DEFAULT_REQUIRED_MESSAGE } from "../../constants";
import { addUserMutation } from "../../api/mutation/useUserMutation";
import { TUser } from "../../entities";
import { useForm } from "antd/es/form/Form";
import {
    useGetAvailableNumbersTelnyx,
    usefindUser,
} from "../../api/query/userQuery";
import LoadingComponent from "../../components/LoadingComponent";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const AddEditUser = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [form] = useForm();

    const { user, isLoading } = usefindUser(userId ?? "");

    const { data: mobileNumbers, isLoading: isAvailableNumbersLoading } =
        useGetAvailableNumbersTelnyx();

    const mutation = useMutation(addUserMutation, {
        onSuccess: () => {
            navigate("/setup/users"); // Redirect to the users list page after successful submission
        },
    });

    const onFinish = (values: TUser) => {
        mutation.mutate(values);
    };

    React.useEffect(() => {
        if (user) {
            form.setFieldsValue(user);
            form.setFieldValue(
                "numbers",
                user.numbers?.map((number) => number.mobileNumber)
            );
        } else {
            form.resetFields();
        }
    }, [user]);

    if (isLoading || isAvailableNumbersLoading) {
        return <LoadingComponent />;
    }

    return (
        <Card
            title={`${user ? "Edit" : "Add"} user`}
            extra={
                <Link to="/users">
                    <Button type="link">
                        <ArrowLeftOutlined /> &nbsp;Back
                    </Button>
                </Link>
            }
        >
            <Form
                name="basic"
                form={form}
                {...layout}
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                autoComplete="off"
                // initialValues={userId ? user : []}
            >
                <Form.Item name="id" style={{ display: "none" }}>
                    <Input />
                </Form.Item>
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
                <Form.Item
                    label="Mobile Numbers"
                    name="numbers"
                    rules={[
                        {
                            required: true,
                            message: DEFAULT_REQUIRED_MESSAGE,
                        },
                    ]}
                >
                    <Select
                        placeholder="Enter mobile numbers"
                        defaultValue={[]}
                        style={{ width: "100%" }}
                        mode="multiple"
                        showSearch
                        options={mobileNumbers?.map((number) => ({
                            label: number.mobileNumber,
                            value: number.mobileNumber,
                        }))}
                    />
                </Form.Item>

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
                        loading={mutation.isLoading}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddEditUser;
