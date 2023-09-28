import React, { useState } from "react";
import { Dropdown, Input, Menu, Tag, Typography } from "antd";
import {
    MailOutlined,
    InboxOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    FolderOutlined,
    SendOutlined,
    TagFilled,
} from "@ant-design/icons";
import { useTextLabels } from "../../../api/query/textQuery";
import { useNavigate } from "react-router-dom";
import AddUpdateTextLabelModal from "../../PageContacts/Components/AddUpdateTextLabelModal";
import { TTextLabel } from "../../../entities";

const TextsHeaderMenu = ({
    handleLabelChange,
}: {
    handleLabelChange: (e) => void;
}) => {
    const navigate = useNavigate();
    const { labels, isLoading: isLabelsLoading } = useTextLabels();
    const [tagSearchKey, setTagSearchKey] = React.useState("");
    const [isLabelsDropdownVisible, setIsLabelsDropdownVisible] =
        useState(false);
    const [isCreateLabelModalOpen, setIsCreateLabelModalOpen] = useState(false);
    const [selectedTextLabel, setSelectedTextLabel] = useState<
        TTextLabel | undefined
    >(undefined);

    return (
        <>
            <Menu
                onClick={(e) => {
                    if (e.key != "labels") {
                        if (e.key == "inbox") {
                            navigate("/text-threads");
                        } else if (e.key == "templates") {
                            navigate("/text-templates");
                        } else {
                            navigate("/texts/" + e.key);
                        }
                    } else {
                        setIsLabelsDropdownVisible(!isLabelsDropdownVisible);
                    }
                }}
                mode="horizontal"
            >
                <Menu.Item key="inbox" icon={<InboxOutlined />}>
                    Inbox
                </Menu.Item>
                <Menu.Item key="scheduled" icon={<ClockCircleOutlined />}>
                    Scheduled
                </Menu.Item>
                <Menu.Item key="sent" icon={<SendOutlined />}>
                    Sent
                </Menu.Item>
                <Menu.Item key="outbox" icon={<InboxOutlined />}>
                    Outbox
                </Menu.Item>
                <Menu.Item key="failed" icon={<DeleteOutlined />}>
                    Failed
                </Menu.Item>
                <Menu.Item key="templates" icon={<FolderOutlined />}>
                    Templates
                </Menu.Item>
                <Menu.Item
                    key="labels"
                    icon={
                        <TagFilled
                            style={{
                                transform: "rotate(45deg)",
                            }}
                        />
                    }
                >
                    <>
                        <Dropdown
                            overlay={
                                <Menu
                                    onClick={(e) => {
                                        if (e.key != "new") {
                                            handleLabelChange(e);
                                        } else {
                                            setIsCreateLabelModalOpen(
                                                !isCreateLabelModalOpen
                                            );
                                        }
                                    }}
                                >
                                    <Menu.Item key="search">
                                        <Input
                                            placeholder="Search"
                                            onKeyUp={(e: any) =>
                                                setTagSearchKey(e.target.value)
                                            }
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </Menu.Item>
                                    <Menu.Item key="disabled" disabled>
                                        <Typography.Text strong>
                                            SELECT TEXT LABEL
                                        </Typography.Text>
                                    </Menu.Item>
                                    {labels
                                        ?.filter((label) =>
                                            label.name.includes(tagSearchKey)
                                        )
                                        ?.map((type) => (
                                            <Menu.Item key={type.name}>
                                                <Tag>{type.name}</Tag>
                                            </Menu.Item>
                                        ))}
                                    <Menu.Divider />
                                    <Menu.Item key="new">
                                        <a
                                            onClick={(e) => {
                                                e.preventDefault();
                                                // setIsCreateNewTypeOpen(true);
                                            }}
                                        >
                                            Create New Label
                                        </a>
                                    </Menu.Item>
                                </Menu>
                            }
                            trigger={["click"]}
                            open={isLabelsDropdownVisible}
                        >
                            <Typography.Text>Labels</Typography.Text>
                        </Dropdown>
                    </>
                </Menu.Item>
            </Menu>

            <AddUpdateTextLabelModal
                isModalOpen={isCreateLabelModalOpen}
                closeModal={() => setIsCreateLabelModalOpen(false)}
                textLabel={selectedTextLabel}
            />
        </>
    );
};

export default TextsHeaderMenu;
