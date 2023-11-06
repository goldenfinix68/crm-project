import React, { useContext } from "react";
import { useLoggedInUser } from "../api/query/userQuery";
import { Space, List, Typography, Popover, Button } from "antd";
import { useTextTemplates } from "../api/query/textTemplateQuery";
import { replacePlaceholders } from "../helpers";
import ContactContext from "../pages/ContactView/context";
import Search from "antd/es/input/Search";
import LoadingComponent from "./LoadingComponent";
import { TContact } from "../entities";

const UseTemplatePopover = ({
    handleSelect,
    contact,
}: {
    handleSelect: (e) => void;
    contact: {
        [key: string]: any;
    }[];
}) => {
    const { templates, isLoading } = useTextTemplates();

    if (isLoading) {
        return <LoadingComponent />;
    }
    return (
        <Space direction="vertical" size={"large"}>
            <Search placeholder="Search" />

            <List
                dataSource={templates?.filter(
                    (template) => !template.deleted_at
                )}
                style={{ maxHeight: "200px", overflowY: "auto" }}
                renderItem={(item) => (
                    <div
                        style={{
                            cursor: "pointer", // Add pointer cursor
                            backgroundColor: "white", // Set the default background color
                            padding: "8px",

                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "blue";
                            e.currentTarget.style.color = "white"; // Change background color on hover
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "white";
                            e.currentTarget.style.color = "black"; // Restore default background color on hover out
                        }}
                        onClick={() => {
                            handleSelect(item.textMessage);
                        }}
                    >
                        <Typography.Text strong style={{ color: "inherit" }}>
                            {item.name}
                        </Typography.Text>

                        <Popover
                            content={
                                <Typography.Text>
                                    {replacePlaceholders(
                                        item.textMessage,
                                        contact.reduce((obj, item) => {
                                            obj[item.key] = item.value;
                                            return obj;
                                        }, {})
                                    )}
                                </Typography.Text>
                            }
                            trigger={"hover"}
                        >
                            <Button
                                type="link"
                                style={{ padding: 0, color: "inherit" }}
                                onClick={() => {
                                    // setTemplateFolder(undefined);
                                    // setIsCreateFolderModalOpen(true);
                                }}
                            >
                                Preview
                            </Button>
                        </Popover>
                    </div>
                )}
            />
        </Space>
    );
};

export default UseTemplatePopover;
