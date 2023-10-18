import React, { useEffect, useState } from "react";
import {
    Button,
    Col,
    Dropdown,
    Layout,
    Menu,
    Row,
    Space,
    Typography,
} from "antd";
import Sider from "antd/es/layout/Sider";
import {
    SlidersOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    DatabaseOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CustomFieldAddUpdateModal from "../../components/CustomFieldAddUpdateModal";
import CustomFieldSectionAddUpdateModal from "../../components/CustomFieldSectionAddUpdateModal";
import { MenuProps } from "antd/lib";

const { SubMenu } = Menu;

interface SetupLayoutProps {
    content: any;
    title: string;
}

const SetupLayout: React.FC<SetupLayoutProps> = (props) => {
    const { content, title } = props;
    const navigate = useNavigate();

    const [isCustomFieldAddUpdateOpen, setIsCustomFieldAddUpdateOpen] =
        React.useState(false);
    const [
        isCustomFieldSectionAddUpdateOpen,
        setIsCustomFieldSectionAddUpdateOpen,
    ] = React.useState(false);
    const items: MenuProps["items"] = [
        {
            label: "Add new Section",
            key: "1",
            onClick: () => {
                setIsCustomFieldSectionAddUpdateOpen(true);
            },
        },
        {
            label: "Map Dependency Fields",
            key: "2",
        },
    ];

    const sideMenuItems: any = [
        {
            key: "/setup/customizations",
            icon: <SlidersOutlined />,
            label: "Customizations",
            children: [
                // {
                //     key: "/setup/customizations/contact",
                //     path: "/setup/customizations/contact",
                //     label: "Contact",
                // },
                // {
                //     key: "/setup/customizations/deal",
                //     path: "/setup/customizations/deal",
                //     label: "Deal",
                // },
                // {
                //     key: "/setup/customizations/activity",
                //     path: "/setup/customizations/activity",
                //     label: "Activity",
                // },
                // {
                //     key: "/setup/customizations/calling",
                //     path: "/setup/customizations/calling",
                //     label: "Calling Configurations",
                // },
                {
                    key: "/setup/customizations/contact",
                    path: "/setup/customizations/contact",
                    label: "Contact",
                },
                {
                    key: "/setup/customizations/deal",
                    path: "/setup/customizations/deal",
                    label: "Deal",
                },
                {
                    key: "/setup/customizations/activity",
                    path: "/setup/customizations/activity",
                    label: "Activity",
                },
                {
                    key: "/setup/customizations/tag",
                    path: "/setup/customizations/tag",
                    label: "Tag Management",
                },
                // {
                //     key: "/setup/customizations/deal-pipeline",
                //     path: "/setup/customizations/deal-pipeline",
                //     label: "Deal Pipeline",
                // },
                {
                    key: "/setup/customizations/activity-types",
                    path: "/setup/customizations/activity-types",
                    label: "Activity Types",
                },
                // {
                //     key: "/setup/customizations/modules",
                //     path: "/setup/customizations/modules",
                //     label: "System Modules",
                // },
                // {
                //     key: "/setup/customizations/availability",
                //     path: "/setup/customizations/availability",
                //     label: "Availabity",
                // },
            ],
        },

        {
            key: "/setup/data-administration",
            icon: <DatabaseOutlined />,
            label: "Data Administration",
            children: [
                {
                    key: "/setup/data-administration/import-file",
                    path: "/setup/data-administration/import-file",
                    label: "Import Data",
                },
            ],
        },
    ];

    const removeLastWordSeparatedByBackslash = (str) => {
        const words = str.split("/"); // Split the string into an array of words using backslash as the separator
        words.pop(); // Remove the last word from the array
        return words.join("/"); // Join the remaining words back together using backslash as the separator
    };

    return (
        <Layout className="setup-layout">
            <Sider breakpoint="lg" collapsedWidth="0">
                <div className="demo-logo-vertical" />
                <Menu
                    className="setup-menu"
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[window.location.pathname]}
                    defaultOpenKeys={["/setup/customizations"]} // Set the default open keys here
                    onSelect={(info) => {
                        navigate(info.key);
                    }}
                >
                    {sideMenuItems.map((item) => {
                        if (item.children) {
                            return (
                                <SubMenu
                                    key={item.key}
                                    icon={item.icon}
                                    title={item.label}
                                >
                                    {item.children.map((child) => (
                                        <Menu.Item
                                            key={child.key}
                                            icon={child.icon}
                                        >
                                            {child.label}
                                        </Menu.Item>
                                    ))}
                                </SubMenu>
                            );
                        } else {
                            return (
                                <Menu.Item key={item.key} icon={item.icon}>
                                    {item.label}
                                </Menu.Item>
                            );
                        }
                    })}
                </Menu>
            </Sider>
            <Layout>
                <Layout.Header
                    style={{
                        padding: 0,
                        // background: colorBgContainer
                    }}
                >
                    <Row gutter={12}>
                        <Col span={12} className="p-l-md">
                            <Typography.Text>{title}</Typography.Text>
                        </Col>
                        <Col span={12} className="text-right p-r-md">
                            {title == "Contact" && (
                                <>
                                    <Space>
                                        <Button
                                            type="default"
                                            style={{
                                                background: "#52c41a", // Green color for success
                                                borderColor: "#52c41a",
                                                color: "white",
                                            }}
                                            icon={<PlusCircleOutlined />}
                                            // onClick={handleOpenCreateMdal}
                                        >
                                            Form Review
                                        </Button>
                                        <Dropdown.Button
                                            type="primary"
                                            menu={{ items }}
                                            onClick={() => {
                                                setIsCustomFieldAddUpdateOpen(
                                                    true
                                                );
                                            }}
                                        >
                                            New Custom Field
                                        </Dropdown.Button>
                                    </Space>

                                    <CustomFieldAddUpdateModal
                                        isModalOpen={isCustomFieldAddUpdateOpen}
                                        closeModal={() =>
                                            setIsCustomFieldAddUpdateOpen(false)
                                        }
                                        handleSubmit={() => {
                                            console.log("qwe");
                                        }}
                                        type={
                                            title == "Contact" ? "contact" : ""
                                        }
                                    />

                                    <CustomFieldSectionAddUpdateModal
                                        isModalOpen={
                                            isCustomFieldSectionAddUpdateOpen
                                        }
                                        closeModal={() =>
                                            setIsCustomFieldSectionAddUpdateOpen(
                                                false
                                            )
                                        }
                                        handleSubmit={() => {
                                            console.log("qwe");
                                        }}
                                        type={
                                            title == "Contact" ? "contact" : ""
                                        }
                                    />
                                </>
                            )}
                        </Col>
                    </Row>
                </Layout.Header>
                <Layout.Content style={{ margin: "24px 16px 40px" }}>
                    {content}
                </Layout.Content>
            </Layout>
        </Layout>
    );
};

export default SetupLayout;
