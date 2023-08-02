import React, { useState } from "react";
import {
    Avatar,
    Button,
    Card,
    Col,
    Empty,
    Input,
    Menu,
    Row,
    Space,
    Typography,
} from "antd";
import {
    AppstoreOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    FolderOutlined,
    InboxOutlined,
    MailOutlined,
    SearchOutlined,
    SendOutlined,
    SettingOutlined,
    EllipsisOutlined,
} from "@ant-design/icons";
import { Divider } from "rc-menu";
import { useContactsAll } from "../../api/query/contactsQuery";
import TextItem from "./components/TextItem";
import { TContact } from "../../entities";
import DropdownComponent from "../../components/DropdownComponent";
import ChatBoxItem from "./components/ChatBoxItem";
import ContactInfo from "../ContactView/components/ContactInfo";
import ContactContext from "../ContactView/context";
import TextContent from "./components/TextContent";

const Texts = () => {
    const [menu, setMenu] = useState("all");
    const [selectedContact, setSelectedContact] = useState<TContact | null>(
        null
    );
    const { contacts, isLoading } = useContactsAll();
    return (
        <Card bodyStyle={{ padding: 0 }}>
            <Row gutter={0} style={{ height: "85vh" }}>
                <Col span={6} style={{ padding: "24px" }}>
                    <Row>
                        <Col span={9}>
                            <Menu
                                mode="vertical"
                                onClick={(e) => setMenu(e.key)}
                                selectedKeys={[menu]}
                                style={{ height: "80vh" }}
                            >
                                {/* Set mode to 'vertical' for a vertical menu */}
                                <Menu.Item key="all" icon={<MailOutlined />}>
                                    All
                                </Menu.Item>
                                <Menu.Item key="inbox" icon={<InboxOutlined />}>
                                    Inbox
                                </Menu.Item>
                                <Menu.Item
                                    key="scheduled"
                                    icon={<ClockCircleOutlined />}
                                >
                                    Scheduled
                                </Menu.Item>
                                <Menu.Item key="sent" icon={<SendOutlined />}>
                                    Sent
                                </Menu.Item>
                                <Menu.Item
                                    key="outbox"
                                    icon={<InboxOutlined />}
                                >
                                    Outbox
                                </Menu.Item>
                                <Menu.Item
                                    key="trash"
                                    icon={<DeleteOutlined />}
                                >
                                    Trash
                                </Menu.Item>
                                <Divider />
                                <Menu.Item
                                    key="templates"
                                    icon={<FolderOutlined />}
                                >
                                    Templates
                                </Menu.Item>
                            </Menu>
                        </Col>
                        <Col span={15}>
                            <Space
                                direction="vertical"
                                style={{ padding: "10px", width: "100%" }}
                            >
                                <Input
                                    suffix={<SearchOutlined />}
                                    placeholder="Search"
                                    style={{ marginBottom: "20px" }}
                                />
                                {contacts?.map((contact) => {
                                    if (!contact?.texts?.length) {
                                        return null;
                                    }
                                    return (
                                        <div
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                setSelectedContact(contact)
                                            }
                                        >
                                            <TextItem
                                                name={`${contact.firstName} ${contact.lastName}`}
                                                text={contact?.texts![0]}
                                            />
                                        </div>
                                    );
                                })}
                            </Space>
                        </Col>
                    </Row>
                </Col>
                <Col
                    span={18}
                    style={{ backgroundColor: "#F5F5F5", margin: 0 }}
                >
                    {selectedContact ? (
                        <div key={selectedContact.id}>
                            <TextContent
                                contactId={selectedContact.id}
                                menu={menu}
                            />
                        </div>
                    ) : null}
                </Col>
            </Row>
        </Card>
    );
};

export default Texts;
