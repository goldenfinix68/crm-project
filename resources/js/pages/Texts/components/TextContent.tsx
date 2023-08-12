import React from "react";
import {
    Avatar,
    Button,
    Col,
    Empty,
    Form,
    Input,
    Row,
    Select,
    Space,
    Typography,
} from "antd";
import { TText } from "../../../entities";
import { EllipsisOutlined } from "@ant-design/icons";
import DropdownComponent from "../../../components/DropdownComponent";
import ContactInfo from "../../ContactView/components/ContactInfo";
import ContactContext from "../../ContactView/context";
import ChatBoxItem from "./ChatBoxItem";
import { useGetContact } from "../../../api/query/contactsQuery";
import LoadingComponent from "../../../components/LoadingComponent";
import queryClient from "../../../queryClient";
import { useMutation } from "react-query";
import { sendTextMutation } from "../../../api/mutation/useTextMutation";
import TextForm from "./TextForm";

const TextContent = ({
    menu,
    contactId,
}: {
    menu: string;
    contactId: string;
}) => {
    const [form] = Form.useForm();
    const [isFocused, setIsFocused] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const chatBoxRef = React.useRef<HTMLDivElement>(null);
    const { contact, refetch } = useGetContact(contactId ?? "", (data) => {
        // Do something with the fetched data when it's successful
        console.log("Data fetched successfully:", data);
        setIsLoading(false);
        scrollToBottom();
    });

    const scrollToBottom = () => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    };

    React.useEffect(() => {
        setIsLoading(true);
        refetch();
    }, [contactId]);

    React.useEffect(() => {
        scrollToBottom();
    }, [contact]);

    if (isLoading || !contact) {
        return <LoadingComponent />;
    }

    return ["all", "inbox", "scheduled"].includes(menu) ? (
        <ContactContext.Provider value={{ contact: contact }}>
            <Row key={contactId}>
                <Col
                    span={18}
                    style={{ height: "85vh", overflowY: "auto" }}
                    ref={chatBoxRef}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            width: "100%",
                            padding: "15px",
                            display: "flex",
                            alignItems: "center",
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                        }}
                    >
                        {/* Your content */}
                        <Avatar
                            className="avatarText m-r-sm"
                            size={32}
                            style={{
                                backgroundColor: "#1677FF",
                                verticalAlign: "middle",
                            }}
                        >
                            {contact.firstName.charAt(0)}
                        </Avatar>{" "}
                        {`${contact.firstName} ${contact.lastName}`}
                        <span style={{ marginLeft: "auto" }}>
                            <DropdownComponent
                                menuList={[
                                    {
                                        label: (
                                            <Typography.Text onClick={() => {}}>
                                                Delete all
                                            </Typography.Text>
                                        ),
                                        key: "1",
                                    },
                                    {
                                        label: (
                                            <Typography.Text onClick={() => {}}>
                                                Block number
                                            </Typography.Text>
                                        ),
                                        key: "2",
                                    },
                                ]}
                                showCarret={false}
                                label={
                                    <EllipsisOutlined
                                        style={{
                                            transform: "rotate(90deg)",
                                        }}
                                    />
                                }
                            />
                        </span>
                    </div>

                    <div style={{ paddingTop: "50px", height: "100%" }}>
                        <div style={{ paddingBottom: "106" }}>
                            {contact.texts
                                ?.sort(
                                    (a, b) =>
                                        parseInt(a.id ?? "0") -
                                        parseInt(b.id ?? "0")
                                )
                                .map((text) => (
                                    <ChatBoxItem
                                        name={
                                            contact.firstName +
                                            " " +
                                            contact.lastName
                                        }
                                        text={text}
                                        key={text.id}
                                    />
                                ))}
                        </div>

                        <div
                            style={{
                                position: "sticky",
                                bottom: 0,
                                left: 0,
                                width: "100%",
                                backgroundColor: "white",
                                padding: "10px",
                            }}
                        >
                            {isFocused ? (
                                <TextForm
                                    handleSubmit={() => {
                                        queryClient.invalidateQueries(
                                            "getContact"
                                        );
                                        setIsFocused(false);
                                    }}
                                    handleCancel={() => {
                                        setIsFocused(false);
                                    }}
                                />
                            ) : (
                                <Input.TextArea
                                    rows={2}
                                    placeholder="Type here ..."
                                    onClick={() => setIsFocused(true)}
                                ></Input.TextArea>
                            )}
                        </div>
                    </div>
                </Col>
                <Col span={6} style={{ height: "85vh", overflowY: "auto" }}>
                    <Space
                        direction="vertical"
                        size={0}
                        style={{ width: "100%", overflowY: "auto" }}
                    >
                        <div
                            style={{
                                backgroundColor: "#F5F5F5",
                                width: "100%",
                                padding: "15px",
                                display: "flex",
                                fontWeight: "bold",
                            }}
                        >
                            Related Information
                        </div>

                        <ContactInfo />
                    </Space>
                </Col>
            </Row>
        </ContactContext.Provider>
    ) : null;
};

export default TextContent;
