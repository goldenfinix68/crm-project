import React, { useState } from "react";
import { GiftOutlined, LogoutOutlined } from "@ant-design/icons";
import { Alert, Button, Space, Tooltip } from "antd";

import { updateAppVersion } from "../helpers";
import { isAppLatestVersion as isLatestVersion } from "../helpers";
import { useAppContextProvider } from "../context/AppContext";

const ImpersonateBanner = () => {
    const { loggedInUser } = useAppContextProvider();
    const impersonaterToken = localStorage.getItem("impersonator_access_token");
    return (
        <>
            {impersonaterToken && (
                <Alert
                    message={
                        <Space style={{ float: "right" }}>
                            {`Impersonating: ${loggedInUser?.firstName} ${loggedInUser?.lastName}`}
                            <Tooltip title="Logout">
                                <Button
                                    type="link"
                                    className="p-0"
                                    onClick={() => {
                                        localStorage.setItem(
                                            "access_token",
                                            localStorage.getItem(
                                                "impersonator_access_token"
                                            )!
                                        );
                                        localStorage.removeItem(
                                            "impersonator_access_token"
                                        );
                                        window.location.replace("/users");
                                    }}
                                    icon={<LogoutOutlined />}
                                />
                            </Tooltip>
                        </Space>
                    }
                    type="error"
                    style={{ borderRadius: 0 }}
                />
            )}
        </>
    );
};

export default ImpersonateBanner;
