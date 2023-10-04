import React, { useState, useEffect } from "react";
import { Spin } from "antd";

const LoadingComponent = () => {
    const [loading, setLoading] = useState(true);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999, // Adjust z-index to ensure it's above other elements
                pointerEvents: loading ? "auto" : "none", // Disable user interactions when loading
            }}
        >
            <Spin spinning={true} size="large"></Spin>
        </div>
    );
};

export default LoadingComponent;
