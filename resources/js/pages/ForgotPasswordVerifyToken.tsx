import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    Checkbox,
    Col,
    Divider,
    Form,
    Input,
    Row,
    Space,
    Typography,
    notification,
    Alert,
} from "antd";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDealDeleteFavorite } from "../api/mutation/useDealMutation";
import { addSetPassword, addTokenVerify } from "../api/mutation/useTokenVerify";

const ForgotPasswordVerifyToken = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [showSuscces, setShowSuccess] = useState(false);

    const addVerify = useMutation(addTokenVerify, {
        onSuccess: (data) => {},
        onError: (err) => {
            window.location.href = "/";
        },
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            addVerify.mutate({ token: token });
        }
    }, []);

    const setPassword = useMutation(addSetPassword, {
        onSuccess: (data) => {},
        onError: (err) => {
            window.location.href = "/";
        },
    });
    const onFinishVerify = async (values: any) => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        setPassword.mutate({ token: token });
    };

    return (
        <Space
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#D3D3D3",
            }}
            direction="vertical"
            size={"large"}
        >
            <Card style={{ width: "450px", padding: "24px" }}>
                <div
                    style={{
                        fontSize: 22,
                        textAlign: "center",
                        fontWeight: "bold",
                    }}
                >
                    Forgot Password?
                </div>
                <div style={{ textAlign: "center" }}>
                    We'll email you instructions on how to reset your password.
                </div>
                <Form
                    onFinish={onFinishVerify}
                    layout={"horizontal"}
                    labelWrap={true}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    style={{ marginTop: 10 }}
                >
                    <Row>
                        <Col md={24}>
                            {" "}
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your password!",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                name="confirm"
                                label="Confirm Password"
                                dependencies={["password"]}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please confirm your password!",
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                getFieldValue("password") ===
                                                    value
                                            ) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error(
                                                    "The new password that you entered do not match!"
                                                )
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div style={{ textAlign: "center" }}>
                        {" "}
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            style={{ width: "50%" }}
                        >
                            Submit
                        </Button>
                    </div>
                </Form>
            </Card>
            <div style={{ textAlign: "center" }}>
                <Typography.Text>
                    Terms of Service &#8226; Privacy Policy
                </Typography.Text>
            </div>
        </Space>
    );
};

export default ForgotPasswordVerifyToken;
