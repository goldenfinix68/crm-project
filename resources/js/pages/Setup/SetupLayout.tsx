import React from "react";
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
    DatabaseOutlined,
    PlusCircleOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CustomFieldAddUpdateModal from "../../components/CustomFieldAddUpdateModal";
import CustomFieldSectionAddUpdateModal from "../../components/CustomFieldSectionAddUpdateModal";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CustomFieldFormModal from "../../components/CustomFieldFormModal";
import PipelineAddUpdateModal from "../DealPipelineSetup/components/PipelineAddUpdateModal";
import { useAppContextProvider } from "../../context/AppContext";
import { allowedroleToAccess } from "../../constants";
import CustomLink from "../../components/CustomLink";

const { SubMenu } = Menu;

interface SetupLayoutProps {
    content: any;
    title: string;
}

const SetupLayout: React.FC<SetupLayoutProps> = (props) => {
    const { loggedInUser } = useAppContextProvider();
    const { content, title } = props;

    const [isCustomFieldAddUpdateOpen, setIsCustomFieldAddUpdateOpen] =
        React.useState(false);
    const [isFormReviewModalOpen, setIsFormReviewModalOpen] =
        React.useState(false);
    const [
        isCustomFieldSectionAddUpdateOpen,
        setIsCustomFieldSectionAddUpdateOpen,
    ] = React.useState(false);
    const [isPipelineAddUpdateOpen, setIsPipelineAddUpdateOpen] =
        React.useState(false);

    const sideMenuItems: any = [
        {
            key: "customizations",
            icon: <SlidersOutlined />,
            label: "Customizations",
            children: [
                {
                    key: "/setup/customizations/contact",
                    path: "/setup/customizations/contact",
                    label: "Contact",
                },
                {
                    key: "/setup/customizations/deal-pipeline",
                    path: "/setup/customizations/deal-pipeline",
                    label: "Deal Pipeline",
                },
            ],
        },

        {
            key: "data-administration",
            icon: <DatabaseOutlined />,
            label: "Data Administration",
            children: [
                {
                    key: "/setup/data-administration/import-file",
                    path: "/setup/data-administration/import-file",
                    label: "Import Data from csv/excel",
                },
                {
                    key: "/setup/data-administration/import-file-gsheet",
                    path: "/setup/data-administration/import-file-gsheet",
                    label: "Import Data from google sheet",
                },
                {
                    key: "/setup/data-administration/roor-data-mapping",
                    path: "/setup/data-administration/roor-data-mapping",
                    label: "Roor Data Mapping",
                },
                {
                    key: "/setup/data-administration/openphone-audio-import",
                    path: "/setup/data-administration/openphone-audio-import",
                    label: "Manual Audio Import",
                },
                {
                    key: "/setup/data-administration/stop-word-list",
                    path: "/setup/data-administration/stop-word-list",
                    label: "Stop Word List",
                },
            ],
        },
    ];

    if (loggedInUser && allowedroleToAccess.includes(loggedInUser.role)) {
        sideMenuItems.push({
            key: "users-security",
            icon: <SettingOutlined />,
            label: "Users & Security",
            children: [
                {
                    key: "/setup/customizations/users",
                    path: "/setup/customizations/users",
                    label: "Users",
                },
                {
                    key: "/setup/customizations/call-forwarding",
                    path: "/setup/customizations/call-forwarding",
                    label: "Call Forwarding",
                },
            ],
        });
    }

    return (
        <Layout className="setup-layout">
            <Sider breakpoint="lg" collapsedWidth="0">
                <div className="demo-logo-vertical" />
                <Menu
                    className="setup-menu"
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[window.location.pathname]}
                    defaultOpenKeys={[
                        "customizations",
                        "users-security",
                        "data-administration",
                    ]}
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
                                            <CustomLink to={child.key}>
                                                {child.label}
                                            </CustomLink>
                                        </Menu.Item>
                                    ))}
                                </SubMenu>
                            );
                        } else {
                            return (
                                <Menu.Item key={item.key} icon={item.icon}>
                                    <CustomLink to={item.key}>
                                        {item.label}
                                    </CustomLink>
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
                    }}
                >
                    <Row gutter={12}>
                        <Col span={12} className="p-l-md">
                            <Typography.Text>{title}</Typography.Text>
                        </Col>
                        <Col span={12} className="text-right p-r-md">
                            {title == "Deal Pipeline" && (
                                <Space>
                                    <Button
                                        type="primary"
                                        icon={<PlusCircleOutlined />}
                                        onClick={() => {
                                            setIsPipelineAddUpdateOpen(true);
                                        }}
                                    >
                                        New Pipeline
                                    </Button>

                                    <PipelineAddUpdateModal
                                        isModalOpen={isPipelineAddUpdateOpen}
                                        closeModal={() =>
                                            setIsPipelineAddUpdateOpen(false)
                                        }
                                        handleSubmit={() => {
                                            console.log("qwe");
                                        }}
                                    />
                                </Space>
                            )}
                            {(title == "Contact" ||
                                title == "Deal" ||
                                title == "Activity") && (
                                <>
                                    <Space>
                                        {title != "Activity" && (
                                            <Button
                                                type="default"
                                                style={{
                                                    background: "#52c41a", // Green color for success
                                                    borderColor: "#52c41a",
                                                    color: "white",
                                                }}
                                                icon={<PlusCircleOutlined />}
                                                onClick={() => {
                                                    setIsFormReviewModalOpen(
                                                        true
                                                    );
                                                }}
                                            >
                                                Form Review
                                            </Button>
                                        )}

                                        <Dropdown.Button
                                            type="primary"
                                            onClick={() => {
                                                setIsCustomFieldAddUpdateOpen(
                                                    true
                                                );
                                            }}
                                            overlay={
                                                <Menu>
                                                    {title != "Activity" && (
                                                        <Menu.Item
                                                            key="1"
                                                            onClick={() => {
                                                                setIsCustomFieldSectionAddUpdateOpen(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            Add new Section
                                                        </Menu.Item>
                                                    )}

                                                    <Menu.Item
                                                        key="2"
                                                        onClick={() => {
                                                            // setIsCustomFieldSectionAddUpdateOpen(
                                                            //     true
                                                            // );
                                                        }}
                                                    >
                                                        Map Dependency Fields
                                                    </Menu.Item>
                                                </Menu>
                                            }
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
                                        type={title.toLowerCase()}
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
                                        type={title.toLowerCase()}
                                    />

                                    <CustomFieldFormModal
                                        isModalOpen={isFormReviewModalOpen}
                                        closeModal={() =>
                                            setIsFormReviewModalOpen(false)
                                        }
                                        handleSubmit={() => {
                                            console.log("qwe");
                                        }}
                                        type={title.toLowerCase()}
                                        preview
                                    />
                                </>
                            )}
                        </Col>
                    </Row>
                </Layout.Header>
                <Layout.Content style={{ margin: "24px 16px 40px" }}>
                    <DndProvider backend={HTML5Backend}>{content}</DndProvider>
                </Layout.Content>
            </Layout>
        </Layout>
    );
};

export default SetupLayout;
