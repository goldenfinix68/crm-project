import React, { useState } from "react";
import {
    Button,
    Card,
    Col,
    Dropdown,
    Menu,
    Row,
    Space,
    Typography,
} from "antd";
import { EllipsisOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { TTextTemplateFolder } from "../../entities";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";
import { useMutation } from "react-query";
import { deleteTextTemplateFolderMutation } from "../../api/mutation/useTextTemplateMutation";
import ConfirmModal from "../../components/ConfirmModal";
import queryClient from "../../queryClient";
import TextTemplatesContent from "./components/TextTemplatesContent";
import AddUpdateTemplateFolderModal from "./components/AddUpdateFolderModal";
import { useTextTemplateFolders } from "../../api/query/textTemplateQuery";
import { useAppContextProvider } from "../../context/AppContext";
import CustomLink from "../../components/CustomLink";

const TextTemplates = () => {
    const { route } = useParams();
    const { isRoleStats } = useAppContextProvider();
    const navigate = useNavigate();
    const [menu, setMenu] = useState(route ?? "All");
    const [templateFolder, setTemplateFolder] = useState<
        TTextTemplateFolder | undefined
    >();
    const { folders, isLoading } = useTextTemplateFolders();
    const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] =
        useState(false);
    if (isLoading) {
        return <LoadingComponent />;
    }
    return (
        <>
            <Card bodyStyle={{ padding: 0 }}>
                <Row gutter={0} style={{ height: "85vh" }}>
                    <Col span={4} style={{ padding: "24px" }}>
                        <Row>
                            <Col span={24}>
                                <Space
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography.Text strong>
                                        Folders
                                    </Typography.Text>
                                    <Button
                                        type="link"
                                        style={{ padding: 0 }}
                                        onClick={() => {
                                            setTemplateFolder(undefined);
                                            setIsCreateFolderModalOpen(true);
                                        }}
                                        disabled={isRoleStats}
                                    >
                                        <PlusCircleOutlined />
                                    </Button>
                                </Space>
                                <Menu
                                    mode="vertical"
                                    // onClick={(e) => {
                                    //     if (e.key == "All") {
                                    //         navigate("/text-templates");
                                    //     } else {
                                    //         navigate(
                                    //             "/text-templates/" + e.key
                                    //         );
                                    //     }
                                    //     setMenu(e.key);
                                    // }}
                                    selectedKeys={[menu]}
                                    style={{ height: "80vh" }}
                                >
                                    {/* Set mode to 'vertical' for a vertical menu */}
                                    <Menu.Item key="All">
                                        <CustomLink to="/text-templates">
                                            All
                                        </CustomLink>
                                    </Menu.Item>
                                    {folders &&
                                        folders?.map((template) => {
                                            return (
                                                <MenuItemHover
                                                    template={template}
                                                    handleRename={(
                                                        template
                                                    ) => {
                                                        setIsCreateFolderModalOpen(
                                                            true
                                                        );
                                                        setTemplateFolder(
                                                            template
                                                        );
                                                    }}
                                                />
                                            );
                                        })}
                                    <Menu.Item key="Archived">
                                        <CustomLink to="/text-templates/Archived">
                                            Archived
                                        </CustomLink>
                                    </Menu.Item>
                                </Menu>
                            </Col>
                        </Row>
                    </Col>
                    <Col
                        span={20}
                        style={{
                            backgroundColor: "#F5F5F5",
                            margin: 0,
                            height: "85vh",
                            overflowY: "auto",
                        }}
                    >
                        <TextTemplatesContent />
                    </Col>
                </Row>
            </Card>
            <AddUpdateTemplateFolderModal
                isModalOpen={isCreateFolderModalOpen}
                closeModal={() => setIsCreateFolderModalOpen(false)}
                templateFolder={templateFolder}
            />
        </>
    );
};
const MenuItemHover = ({ template, handleRename }) => {
    const { isRoleStats } = useAppContextProvider();
    const [isHovered, setIsHovered] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteBtnLoading, setIsDeleteBtnLoading] = useState(false);
    const navigate = useNavigate();

    const deleteTemplate = useMutation(
        (id: string) => deleteTextTemplateFolderMutation(template.id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("textTemplateFolders");
                setIsDeleteModalOpen(false);
            },
            onError: (e: any) => {
                console.log(e.message || "An error occurred");
            },
        }
    );

    const menu = (
        <Menu disabled={isRoleStats}>
            <Menu.Item
                key="rename"
                onClick={() => {
                    handleRename(template);
                    setIsHovered(false);
                }}
            >
                Rename
            </Menu.Item>
            <Menu.Item
                key="delete"
                onClick={() => {
                    setIsDeleteModalOpen(true);
                    setIsHovered(false);
                }}
            >
                Delete
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <Menu.Item
                key={template.name}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={(e) => (e as any).preventDefault()}
            >
                <Space
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography.Text>
                        <CustomLink to={"/text-templates/" + template.name}>
                            {template.name}
                        </CustomLink>
                    </Typography.Text>
                    {isHovered && (
                        <Dropdown
                            overlay={menu}
                            trigger={["click"]}
                            placement="bottomRight"
                            open={isDropdownOpen}
                        >
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    setIsDropdownOpen(!isDropdownOpen);
                                }}
                            >
                                <EllipsisOutlined />
                            </Button>
                        </Dropdown>
                    )}
                </Space>
            </Menu.Item>
            <ConfirmModal
                title="Confirm"
                message={`Are you sure you want to delete ${template.name}?`}
                handleNo={() => setIsDeleteModalOpen(false)}
                handleYes={async () => {
                    setIsDeleteBtnLoading(true);
                    await deleteTemplate.mutate(template.id);
                    setIsDeleteBtnLoading(false);
                }}
                isOpen={isDeleteModalOpen}
                loading={isDeleteBtnLoading}
            />
        </>
    );
};

export default TextTemplates;
