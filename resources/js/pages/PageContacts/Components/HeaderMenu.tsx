import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Menu, Modal, Space, Typography } from "antd";

import {
    CloseOutlined,
    PullRequestOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import CustomLink from "../../../components/CustomLink";

const HeaderMenu = () => {
    const [currentMenu, setCurrentMenu] = useState("mail");
    const navigate = useNavigate();
    return (
        <Menu
            // onClick={(e) => navigate("/" + e.key)}
            selectedKeys={[currentMenu]}
            mode="horizontal"
            items={[
                {
                    label: <CustomLink to="/contacts">Contacts</CustomLink>,
                    key: "contacts",
                    icon: <UserOutlined />,
                },
                {
                    label: (
                        <CustomLink to="/bulk-action">Bulk Action</CustomLink>
                    ),
                    key: "bulk-action",
                    icon: <PullRequestOutlined />,
                },
            ]}
        />
    );
};

export default HeaderMenu;
