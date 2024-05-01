import React, { useState, useEffect } from "react";
import { Card, Layout, Space, Spin, theme } from "antd";

const LoadingComponent2 = () => {
    const { Header, Content } = Layout;
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header
                style={{
                    padding: "0px 30px",
                    background: colorBgContainer,
                }}
            ></Header>
            <Layout>
                <Content
                    style={{
                        padding: "10px",
                        minHeight: 280,
                    }}
                >
                    <Card className="w-100" loading={true}></Card>
                </Content>
            </Layout>
        </Layout>
    );
};

export default LoadingComponent2;
