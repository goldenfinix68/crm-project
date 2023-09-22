import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Menu, Modal, Space, Typography } from "antd";

import {
    CloseOutlined,
    PullRequestOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const HeaderMenu = () => {
    const [currentMenu, setCurrentMenu] = useState("mail");
    const navigate = useNavigate();
    return (
        <Menu
            onClick={(e) => navigate("/" + e.key)}
            selectedKeys={[currentMenu]}
            mode="horizontal"
            items={[
                {
                    label: "Contacts",
                    key: "contacts",
                    icon: <UserOutlined />,
                },
                {
                    label: "Bulk Action",
                    key: "bulk-action",
                    icon: <PullRequestOutlined />,
                },
            ]}
        />
    );
};

export default HeaderMenu;
