import React from "react";
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
} from "antd";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const loginMutation = useMutation(
        async (credentials: any) => {
            const response = await axios.post("/api/login", credentials);
            return response.data.access_token;
        },
        {
            onSuccess: (data) => {
                console.log(data);
                localStorage.setItem("access_token", data);
                window.location.replace("/dashboard");
            },
        }
    );
    const onFinish = async (values: any) => {
        try {
            await loginMutation.mutateAsync(values);
            console.log("Login successful");
            // Handle successful login, e.g., redirect to dashboard
        } catch (error) {
            console.error("Login failed:", error);
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
                                message: "Please enter your username!",
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
                                    loading={loginMutation.isLoading}
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
