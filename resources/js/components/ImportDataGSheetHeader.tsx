import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Menu, Modal, Space, Typography } from "antd";

import {
    DatabaseOutlined,
    HistoryOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import CustomLink from "./CustomLink";

const ImportDataGSheetHeader = () => {
    useEffect(() => {
        document.title = "Import Data GSheet - SpeedLead";
        return () => {};
    }, []);
    return (
        <Menu
            // onClick={(e) => navigate("/" + e.key)}
            mode="horizontal"
            items={[
                {
                    label: (
                        <CustomLink to="/setup/data-administration/import-file-gsheet">
                            Import File
                        </CustomLink>
                    ),
                    key: "import-file",
                    icon: <DatabaseOutlined />,
                },
                {
                    label: (
                        <CustomLink to="/setup/data-administration/import-file-gsheet/history">
                            History
                        </CustomLink>
                    ),
                    key: "history",
                    icon: <HistoryOutlined />,
                },
            ]}
        />
    );
};

export default ImportDataGSheetHeader;
