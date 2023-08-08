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

    const resetFields = () => {
        setIsFocused(false);
        form.resetFields();
    };

    const sendText = useMutation(sendTextMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("getContact");
            resetFields();
        },
    });

    const onFinish = async (values: any) => {
        await sendText.mutate({
            ...values,
            ...{ contactId: contactId, to: contact?.phone },
        });
    };

    if (isLoading || !contact) {
        return <LoadingComponent />;
    }

    return ["all", "inbox", "scheduled"].includes(menu) ? (
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
                        }}
                    >
                        <Form
                            name="basic"
                            layout="vertical"
                            labelWrap
                            initialValues={{
                                to: "+14405633236",
                                from: "Outreach (+1 303-952-1461)",
                            }}
                            onFinish={onFinish}
                            autoComplete="off"
                            form={form}
                            style={{
                                backgroundColor: "white",
                                padding: "14px",
                                position: "sticky",
                                bottom: 0,
                            }}
                        >
                            {isFocused && (
                                <Form.Item
                                    label="From"
                                    name="from"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select style={{ width: "100%" }}>
                                        <Select.Option value="Outreach (+1 303-952-1461)">
                                            Outreach (+1 303-952-1461)
                                        </Select.Option>
                                        <Select.Option value="task">
                                            Default
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            )}

                            <Form.Item
                                name="message"
                                rules={[
                                    {
                                        required: true,
                                        message: "this is required",
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={2}
                                    placeholder="Type here ..."
                                    onClick={() => setIsFocused(true)}
                                ></Input.TextArea>
                            </Form.Item>
                            {isFocused && (
                                <div className="modal-footer">
                                    <Space>
                                        <Button
                                            type="primary"
                                            onClick={() =>
                                                form
                                                    .validateFields()
                                                    .then((values) => {
                                                        form.submit();
                                                    })
                                            }
                                            loading={sendText.isLoading}
                                        >
                                            Send
                                        </Button>
                                        <Button onClick={resetFields}>
                                            Schedule
                                        </Button>
                                        <Button onClick={resetFields}>
                                            Cancel
                                        </Button>
                                    </Space>
                                </div>
                            )}
                        </Form>
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

                    <ContactContext.Provider value={{ contact: contact }}>
                        <ContactInfo />
                    </ContactContext.Provider>
                </Space>
            </Col>
        </Row>
    ) : null;
};

export default TextContent;
