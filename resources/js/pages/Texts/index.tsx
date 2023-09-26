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
    PlusCircleOutlined,
    TagFilled,
} from "@ant-design/icons";
import { Divider } from "rc-menu";
import { useContactsAll } from "../../api/query/contactsQuery";
import { TContact, TText, TTextLabel } from "../../entities";
import DropdownComponent from "../../components/DropdownComponent";
import ChatBoxItem from "./components/ChatBoxItem";
import ContactInfo from "../ContactView/components/ContactInfo";
import ContactContext from "../ContactView/context";
import TextContent from "./components/TextContent";
import { useNavigate, useParams } from "react-router-dom";
import { getTimeAgo } from "../../helpers";
import SentBox from "./components/SentBox";
import TextItem from "./components/TextItem";
import LoadingComponent from "../../components/LoadingComponent";
import AddUpdateTextLabelModal from "../PageContacts/Components/AddUpdateTextLabelModal";
import { useTextLabels } from "../../api/query/textQuery";

const Texts = () => {
    const { route } = useParams();
    const navigate = useNavigate();
    const [menu, setMenu] = useState(route ?? "all");
    const isChatBox = ["all", "inbox"].includes(menu);
    const isSentBox = ["sent", "outbox", "failed", "scheduled"].includes(menu);
    const [selectedContact, setSelectedContact] = useState<TContact | null>(
        null
    );
    const [searchKey, setSearchKey] = useState("");
    const { contacts, isLoading } = useContactsAll();
    const { labels, isLoading: isLabelsLoading } = useTextLabels();
    const [isCreateLabelModalOpen, setIsCreateLabelModalOpen] = useState(false);
    const [selectedTextLabel, setSelectedTextLabel] = useState<
        TTextLabel | undefined
    >(undefined);

    const filteredContacts = (): TContact[] | undefined => {
        let data = contacts;

        data = data?.filter((contact) => contact.texts?.length);
        if (menu == "inbox") {
            data = data?.filter((contact) =>
                contact.texts?.some((text) => !text.isFromApp)
            );
        }
        if (searchKey) {
            let searchWord = searchKey;
            let label = "";
            const match = searchKey.match(/\{\{label:(.*?)\}\}/);

            if (match) {
                label = match[1];
                searchWord = searchWord.replace(/\{\{.*?\}\}\s*/g, "");
            }

            return data?.filter((contact) => {
                let bool = false;
                if (label) {
                    bool =
                        (contact.firstName
                            .toLowerCase()
                            .includes(searchWord.toLowerCase()) ||
                            contact.lastName
                                .toLowerCase()
                                .includes(searchWord.toLowerCase())) &&
                        contact.label?.name == label;
                } else if (searchWord != "") {
                    bool =
                        contact.firstName
                            .toLowerCase()
                            .includes(searchWord.toLowerCase()) ||
                        contact.lastName
                            .toLowerCase()
                            .includes(searchWord.toLowerCase());
                }

                return bool;
            });
        }

        return data;
    };

    return (
        <Card bodyStyle={{ padding: 0 }}>
            <Row gutter={0} style={{ height: "85vh" }}>
                <Col span={isChatBox ? 10 : 3} style={{ padding: "24px" }}>
                    <Row>
                        <Col span={isChatBox ? 7 : 24}>
                            <Menu
                                mode="vertical"
                                onClick={(e) => {
                                    if (e.key == "all") {
                                        navigate("/texts");
                                    } else if (e.key == "templates") {
                                        navigate("/text-templates");
                                    } else {
                                        navigate("/texts/" + e.key);
                                    }
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

                                <Divider />
                                <Space
                                    direction="vertical"
                                    size={"large"}
                                    style={{
                                        padding: "15px",
                                    }}
                                >
                                    <Space>
                                        <Typography.Text strong>
                                            Labels
                                        </Typography.Text>
                                        <Button
                                            type="link"
                                            style={{ padding: 0 }}
                                            onClick={() => {
                                                setIsCreateLabelModalOpen(true);
                                                setSelectedTextLabel(undefined);
                                            }}
                                        >
                                            <PlusCircleOutlined />
                                        </Button>
                                    </Space>

                                    {labels?.map((label) => (
                                        <Space
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setSearchKey(
                                                    `{{label:${label.name}}} `
                                                );
                                                console.log("implement filter");
                                            }}
                                        >
                                            <TagFilled
                                                style={{
                                                    transform: "rotate(45deg)",
                                                }}
                                            />{" "}
                                            {label.name}
                                        </Space>
                                    ))}
                                </Space>
                            </Menu>
                        </Col>
                        {isChatBox ? (
                            <Col span={17}>
                                <Space
                                    direction="vertical"
                                    style={{ padding: "10px", width: "100%" }}
                                >
                                    <Input
                                        suffix={<SearchOutlined />}
                                        placeholder="Search"
                                        style={{ marginBottom: "20px" }}
                                        onChange={(e: any) =>
                                            setSearchKey(e.target.value)
                                        }
                                        value={searchKey}
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
                                                            label={
                                                                contact.label
                                                                    ?.name
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
                    span={isChatBox ? 14 : 21}
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

            <AddUpdateTextLabelModal
                isModalOpen={isCreateLabelModalOpen}
                closeModal={() => setIsCreateLabelModalOpen(false)}
                textLabel={selectedTextLabel}
            />
        </Card>
    );
};

export default Texts;
