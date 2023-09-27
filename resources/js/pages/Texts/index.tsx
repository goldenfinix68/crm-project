import React, { useEffect, useState } from "react";
import {
    Avatar,
    Button,
    Card,
    Col,
    Dropdown,
    Empty,
    Input,
    List,
    Menu,
    Row,
    Space,
    Tag,
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
import TextsHeaderMenu from "./components/TextsHeaderMenu";

const Texts = () => {
    const { route } = useParams();
    const navigate = useNavigate();
    const [searchKey, setSearchKey] = useState("");
    const { contacts, isLoading } = useContactsAll();
    const isChatBox = ["all", "inbox"].includes(route ?? "all");

    const filteredContacts = (): TContact[] | undefined => {
        let data = contacts;

        data = data?.filter((contact) => contact.texts?.length);

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
        <Space direction="vertical" style={{ width: "100%" }}>
            <TextsHeaderMenu
                handleLabelChange={(e) => setSearchKey(`{{label:${e.key}}} `)}
            />
            <Card>
                {isChatBox ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={filteredContacts()}
                        renderItem={(contact) => (
                            <List.Item
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                    navigate("/texts/contact/" + contact.id)
                                }
                            >
                                <Row gutter={12} style={{ width: "100%" }}>
                                    <Col span={3}>
                                        <TextEllipsis
                                            style={{ fontWeight: "bold" }}
                                        >
                                            {`${contact.firstName} ${contact.lastName}`}
                                        </TextEllipsis>
                                    </Col>
                                    <Col span={19}>
                                        <TextEllipsis>
                                            <Space>
                                                {contact.label?.name ? (
                                                    <Tag
                                                        style={{
                                                            float: "right",
                                                        }}
                                                    >
                                                        {contact.label?.name}
                                                    </Tag>
                                                ) : null}
                                                {contact?.texts![0].message}
                                            </Space>
                                        </TextEllipsis>
                                    </Col>
                                    <Col span={2}>
                                        <TextEllipsis
                                            style={{ textAlign: "right" }}
                                        >
                                            {contact?.texts![0].day +
                                                " " +
                                                contact?.texts![0].month}
                                        </TextEllipsis>
                                    </Col>
                                </Row>
                            </List.Item>
                        )}
                    />
                ) : (
                    <SentBox menu={route} />
                )}
            </Card>
        </Space>
    );
};

const TextEllipsis = ({
    children,
    style,
}: {
    children: any;
    style?: React.CSSProperties;
}) => {
    const defaultStyles: React.CSSProperties = {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    };
    const combinedStyles = { ...defaultStyles, ...style };
    return <div style={combinedStyles}>{children}</div>;
};
export default Texts;
