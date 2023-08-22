import React from "react";
import {
    Button,
    Card,
    Checkbox,
    Divider,
    Form,
    Input,
    Space,
    Typography,
} from "antd";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
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
            <Card style={{ width: "400px", padding: "24px" }}>
                <Form onFinish={onFinish}>
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
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your password!",
                            },
                        ]}
                    >
                        <Input.Password placeholder="Password" size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                            noStyle
                        >
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a
                            className="forgot-password"
                            href="/forgot-password"
                            style={{ float: "right" }}
                        >
                            Forgot password
                        </a>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            style={{ width: "100%" }}
                            loading={loginMutation.isLoading}
                        >
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
                <Divider>Or Sign In with</Divider>
                <Button
                    type="default"
                    style={{ width: "100%" }}
                    size="large"
                    icon={
                        <img
                            src="/images/googleLogo.svg"
                            alt="Google Logo"
                            style={{
                                height: "16px",
                                marginRight: "4px",
                            }}
                        />
                    }
                >
                    Google
                </Button>
                <div style={{ textAlign: "center" }}>
                    <Typography.Text>
                        Not a registered user?{" "}
                        <Button type="link" style={{ padding: 0 }}>
                            Sign up
                        </Button>
                    </Typography.Text>
                </div>
            </Card>
            <div style={{ textAlign: "center" }}>
                <Typography.Text>
                    Terms of Service &#8226; Privacy Policy
                </Typography.Text>
            </div>
        </Space>
    );
};

export default Login;
