import React, { useEffect, useState } from "react";
import { Button, Col, Row, Space, Typography } from "antd";
import ContactInfo from "../../ContactView/components/ContactInfo";
import ChatBoxItem from "./ChatBoxItem";
import LoadingComponent from "../../../components/LoadingComponent";
import queryClient from "../../../queryClient";
import { useMutation } from "react-query";
import { useMarkThreadSeen } from "../../../api/mutation/useTextMutation";
import TextForm from "./TextForm";
import CustomFieldFormModal from "../../../components/CustomFieldFormModal";
import ModalAddExistingNumberContact from "../../../components/ModalAddExistingNumberContact";
import { useNavigate, useParams } from "react-router-dom";
import { useTextThread } from "../../../api/query/textQuery";
// import AssignLabelDropdown from "./AssignLabelDropdown";

const TextContent = ({ menu }: { menu: string }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [divKey, setDivKey] = React.useState(0);
    const chatBoxRef = React.useRef<HTMLDivElement>(null);
    const [isCreateNewContactModalOpen, setIsCreateNewContactModalOpen] =
        useState(false);
    const [
        isAddToExistingContactModalOpen,
        setIsAddToExistingContactModalOpen,
    ] = useState(false);

    const { threadId } = useParams();
    const { contactId } = useParams();

    const {
        thread,
        refetch,
        isLoading: isThreadLoading,
    } = useTextThread(
        contactId ?? threadId ?? "",
        contactId ? "contact" : "thread",
        (data) => {
            setIsLoading(false);
        }
    );

    const markAsSeen = useMutation(useMarkThreadSeen, {
        onSuccess: () => {
            queryClient.invalidateQueries("textThreads");
        },
    });

    useEffect(() => {
        // Check if the contact exists and has no value
        if (!threadId && !contactId) {
            navigate("/text-threads");
        } else {
            setIsLoading(true);
            refetch();
        }
    }, [threadId]);

    React.useEffect(() => {
        if (thread) {
            markAsSeen.mutate({
                id: contactId ?? threadId,
                type: contactId ? "contact" : "thread",
            });
        }
    }, [thread]);

    const scrollToBottom = () => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    };
    const lastText = thread?.texts[thread?.texts.length - 1];

    React.useEffect(() => {
        scrollToBottom();
        setDivKey(divKey + 1);
        console.log("thread", thread);
        return () => {};
    }, [thread]);

    return ["all", "inbox", "scheduled"].includes(menu) ? (
        <Row key={thread?.id}>
            {isLoading && <LoadingComponent />}
            <Col
                span={13}
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
                    <Space direction="vertical" size={0}>
                        <Typography.Text strong>
                            {thread?.contactName}
                        </Typography.Text>
                        <Typography.Text>
                            {thread?.phoneNumbers}
                        </Typography.Text>
                    </Space>
                </div>

                <div style={{ paddingTop: "50px", height: "85%" }}>
                    <div style={{ minHeight: "80%" }}>
                        {thread?.texts
                            ?.sort(
                                (a, b) =>
                                    parseInt(a.id ?? "0") -
                                    parseInt(b.id ?? "0")
                            )
                            .map((text) => (
                                <ChatBoxItem
                                    name={thread?.contactName}
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
                        key={divKey}
                    >
                        <TextForm
                            handleSubmit={() => {
                                queryClient.invalidateQueries("getContact");
                                queryClient.invalidateQueries("thread");
                            }}
                            phoneNumbers={
                                thread?.contact
                                    ? thread?.contact?.phoneNumbers
                                    : [thread?.phoneNumbers!]
                            }
                            defaultTo={
                                lastText?.isFromApp
                                    ? lastText?.to
                                    : lastText?.from
                            }
                            defaultFrom={
                                thread?.contact?.defaultMobileNumber ??
                                (lastText?.isFromApp
                                    ? lastText?.from
                                    : lastText?.to)
                            }
                            contact={thread?.contact ?? undefined}
                        />
                    </div>
                </div>
            </Col>
            <Col span={11} style={{ height: "85vh", overflowY: "auto" }}>
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
                            height: "74px",
                            alignItems: "center", // Vertical alignment: center
                            justifyContent: "center", // Horizontal alignment: center
                            textAlign: "center",
                            fontSize: "16px",
                        }}
                    >
                        Related Information
                    </div>

                    {thread?.contact ? (
                        <ContactInfo contact={thread?.contact} />
                    ) : (
                        <Space
                            style={{ textAlign: "center" }}
                            className="w-100"
                            size="large"
                            direction="vertical"
                        >
                            Number not saved in contacts
                            <Button
                                onClick={() =>
                                    setIsCreateNewContactModalOpen(true)
                                }
                            >
                                Create Contact
                            </Button>
                            <Button
                                onClick={() =>
                                    setIsAddToExistingContactModalOpen(true)
                                }
                            >
                                Add to existing Contact
                            </Button>
                        </Space>
                    )}
                </Space>
            </Col>

            <CustomFieldFormModal
                isModalOpen={isCreateNewContactModalOpen}
                closeModal={() => {
                    setIsCreateNewContactModalOpen(false);
                }}
                handleSubmit={() => {
                    queryClient.invalidateQueries("textThreads");
                    queryClient.invalidateQueries("thread");
                }}
                type="contact"
                record={{ mobile: thread?.phoneNumbers }}
            />

            <ModalAddExistingNumberContact
                isModalOpen={isAddToExistingContactModalOpen}
                closeModal={() => setIsAddToExistingContactModalOpen(false)}
                handleSubmit={() => {
                    queryClient.invalidateQueries("textThreads");
                    queryClient.invalidateQueries("thread");
                }}
                contactNumber={thread?.phoneNumbers!}
            />
        </Row>
    ) : null;
};

export default TextContent;
