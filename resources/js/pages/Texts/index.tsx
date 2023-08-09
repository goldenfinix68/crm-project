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
import { TContact, TText } from "../../entities";
import DropdownComponent from "../../components/DropdownComponent";
import ChatBoxItem from "./components/ChatBoxItem";
import ContactInfo from "../ContactView/components/ContactInfo";
import ContactContext from "../ContactView/context";
import TextContent from "./components/TextContent";
import { useNavigate, useParams } from "react-router-dom";
import { getTimeAgo } from "../../helpers";
import SentBox from "./components/SentBox";

const Texts = () => {
    const { route } = useParams();
    const navigate = useNavigate();
    const [menu, setMenu] = useState(route ?? "all");
    const isChatBox = ["all", "inbox", "scheduled"].includes(menu);
    const isSentBox = ["sent", "outbox", "failed"].includes(menu);
    const [selectedContact, setSelectedContact] = useState<TContact | null>(
        null
    );
    const [searchKey, setSearchKey] = useState("");
    const { contacts, isLoading } = useContactsAll();

    const filteredContacts = (): TContact[] | undefined => {
        let data = contacts;
        if (menu == "inbox") {
            data = contacts?.filter((contact) =>
                contact.texts?.some(
                    (text) => text.type == "received" || text.type == "sent"
                )
            );
        }
        if (menu == "scheduled") {
            data = contacts?.filter((contact) =>
                contact.texts?.some((text) => text.type == "scheduled")
            );
        }
        if (searchKey) {
            return data?.filter(
                (contact) =>
                    contact.firstName
                        .toLowerCase()
                        .includes(searchKey.toLowerCase()) ||
                    contact.lastName
                        .toLowerCase()
                        .includes(searchKey.toLowerCase())
            );
        }

        return data;
    };

    return (
        <Card bodyStyle={{ padding: 0 }}>
            <Row gutter={0} style={{ height: "85vh" }}>
                <Col span={isChatBox ? 6 : 3} style={{ padding: "24px" }}>
                    <Row>
                        <Col span={isChatBox ? 9 : 24}>
                            <Menu
                                mode="vertical"
                                onClick={(e) => {
                                    e.key == "all"
                                        ? navigate("/texts")
                                        : navigate("/texts/" + e.key);
                                    setMenu(e.key);
                                }}
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
                                    key="failed"
                                    icon={<DeleteOutlined />}
                                >
                                    Failed
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
                        {isChatBox ? (
                            <Col span={15}>
                                <Space
                                    direction="vertical"
                                    style={{ padding: "10px", width: "100%" }}
                                >
                                    <Input
                                        suffix={<SearchOutlined />}
                                        placeholder="Search"
                                        style={{ marginBottom: "20px" }}
                                        onKeyUp={(e: any) =>
                                            setSearchKey(e.target.value)
                                        }
                                    />
                                    {filteredContacts()?.length ? (
                                        filteredContacts()?.map((contact) => {
                                            if (contact.texts?.length) {
                                                return (
                                                    <div
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() =>
                                                            setSelectedContact(
                                                                contact
                                                            )
                                                        }
                                                    >
                                                        <TextItem
                                                            name={`${contact.firstName} ${contact.lastName}`}
                                                            text={
                                                                contact?.texts![0]
                                                            }
                                                        />
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })
                                    ) : (
                                        <Typography.Text>
                                            No converstation found.
                                        </Typography.Text>
                                    )}
                                </Space>
                            </Col>
                        ) : null}
                    </Row>
                </Col>
                <Col
                    span={isChatBox ? 18 : 21}
                    style={{
                        backgroundColor: "#F5F5F5",
                        margin: 0,
                        height: "85vh",
                        overflowY: "auto",
                    }}
                >
                    {selectedContact && isChatBox ? (
                        <div key={selectedContact.id}>
                            <TextContent
                                contactId={selectedContact.id}
                                menu={menu}
                            />
                        </div>
                    ) : isSentBox ? (
                        <SentBox menu={menu} />
                    ) : null}
                </Col>
            </Row>
        </Card>
    );
};

export default Texts;
