import React, { useState } from "react";
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

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [showSuscces, setShowSuccess] = useState(false);
    const checkEmail = useMutation(
        async (credentials: any) => {
            const response = await axios.post(
                "/api/forgotpassword",
                credentials
            );
            return response.data;
        },
        {
            onSuccess: (res) => {
                if (res.success) {
                    setShowSuccess(true);
                } else {
                    notification.error({
                        message: "Email Address Not Found",
                    });
                }
            },
        }
    );
    const onFinish = async (values: any) => {
        try {
            await checkEmail.mutateAsync(values);
            // Handle successful login, e.g., redirect to dashboard
        } catch (error) {
            // Handle login error, e.g., display an error message
        }
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
                <Form onFinish={onFinish} style={{ marginTop: 10 }}>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your email!",
                            },
                        ]}
                    >
                        <Input placeholder="Email" size="large" />
                    </Form.Item>
                    <Row>
                        <Col xs={24} md={12}>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    style={{ width: "100%" }}
                                    loading={checkEmail.isLoading}
                                >
                                    Reset My Password
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} style={{ textAlign: "right" }}>
                            <a
                                href="/"
                                style={{
                                    marginTop: 10,
                                    fontSize: 15,
                                    position: "relative",
                                    top: 7,
                                    textDecoration: "initial",
                                }}
                            >
                                Return to Login
                            </a>
                        </Col>
                    </Row>

                    <div>
                        {showSuscces && (
                            <Alert
                                className="m-t-sm"
                                type={"success"}
                                message={
                                    "An e-mail has been sent, please check your inbox or your spam folder"
                                }
                            />
                        )}
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

export default ForgotPassword;
