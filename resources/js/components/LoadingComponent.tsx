import React, { useState, useEffect } from "react";
import { Spin } from "antd";

const LoadingComponent = () => {
    const [loading, setLoading] = useState(true);

    // Simulating loading delay for demonstration purposes
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000); // Change this value to simulate actual data loading delay
    }, []);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <Spin spinning={true} size="large"></Spin>
        </div>
    );
};

export default LoadingComponent;
