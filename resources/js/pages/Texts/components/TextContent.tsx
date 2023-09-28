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
import { TContact, TText, TTextThread } from "../../../entities";
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
// import AssignLabelDropdown from "./AssignLabelDropdown";

const TextContent = ({
    menu,
    thread,
}: {
    menu: string;
    thread: TTextThread;
}) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const chatBoxRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [thread]);
    console.log(thread);

    return ["all", "inbox", "scheduled"].includes(menu) ? (
        <Row key={thread.id}>
            <Col
                span={12}
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
                        {thread.contactName.charAt(0)}
                    </Avatar>{" "}
                    {`${thread.contactName}`}
                </div>

                <div style={{ paddingTop: "50px", height: "85%" }}>
                    <div style={{ paddingBottom: "106", minHeight: "100%" }}>
                        {thread.texts
                            ?.sort(
                                (a, b) =>
                                    parseInt(a.id ?? "0") -
                                    parseInt(b.id ?? "0")
                            )
                            .map((text) => (
                                <ChatBoxItem
                                    name={thread.contactName}
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
                                    queryClient.invalidateQueries("getContact");
                                    setIsFocused(false);
                                }}
                                handleCancel={() => {
                                    setIsFocused(false);
                                }}
                                to={thread.contactNumber}
                                contact={thread.contact ?? undefined}
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
            <Col span={12} style={{ height: "85vh", overflowY: "auto" }}>
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
                    {thread.contact ? (
                        <ContactContext.Provider
                            value={{ contact: thread.contact }}
                        >
                            <ContactInfo />
                        </ContactContext.Provider>
                    ) : (
                        <p style={{ textAlign: "center" }}>
                            Number not saved in contacts
                        </p>
                    )}
                </Space>
            </Col>
        </Row>
    ) : null;
};

export default TextContent;
