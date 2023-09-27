import React, { useEffect, useState } from "react";
import {
    Avatar,
    Button,
    Col,
    Divider,
    Empty,
    Input,
    List,
    Row,
    Space,
    Tag,
    Typography,
} from "antd";
import { TContact, TText } from "../../../entities";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useContactsAll } from "../../../api/query/contactsQuery";
import { getTimeAgo } from "../../../helpers";

const TextList = ({ label }) => {
    const [searchKey, setSearchKey] = useState("");
    const { contacts, isLoading } = useContactsAll();
    const navigate = useNavigate();

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

    useEffect(() => {
        setSearchKey(label);
    }, [label]);

    const contactsList = filteredContacts();

    return (
        <>
            <Input
                suffix={<SearchOutlined />}
                placeholder="Search"
                style={{ marginBottom: "20px" }}
                onChange={(e: any) => setSearchKey(e.target.value)}
                value={searchKey}
            />
            <List
                itemLayout="horizontal"
                dataSource={contactsList}
                style={{ marginTop: 0 }}
                renderItem={(contact, index) => (
                    <>
                        {index === 0 && <Divider style={{ margin: "5px" }} />}
                        <List.Item
                            style={{ cursor: "pointer", padding: "3px 0" }} // Adjust padding for thinner list items
                            onClick={() =>
                                navigate("/texts/contact/" + contact.id)
                            }
                        >
                            <Row gutter={12} style={{ width: "100%" }}>
                                <Col span={3}>
                                    <TextEllipsis
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "16px", // Adjust font size
                                        }}
                                    >
                                        {`${contact.firstName} ${contact.lastName}`}
                                    </TextEllipsis>
                                </Col>
                                <Col span={18}>
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
                                <Col span={3}>
                                    <TextEllipsis
                                        style={{
                                            textAlign: "right",
                                            fontSize: "12px", // Adjust font size
                                        }}
                                    >
                                        {getTimeAgo(
                                            contact?.texts![0].created_at
                                        )}
                                    </TextEllipsis>
                                </Col>
                            </Row>
                        </List.Item>
                    </>
                )}
            />
        </>
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

export default TextList;
