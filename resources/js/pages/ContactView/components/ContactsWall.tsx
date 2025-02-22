import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    CalendarOutlined,
    CaretDownOutlined,
    CaretUpOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    CloseOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EllipsisOutlined,
    InfoCircleOutlined,
    PaperClipOutlined,
    PauseOutlined,
    PhoneOutlined,
    PlayCircleOutlined,
    PlaySquareFilled,
    PlaySquareOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Breadcrumb,
    Button,
    Card,
    Col,
    Divider,
    Dropdown,
    Empty,
    Menu,
    Modal,
    Popconfirm,
    Popover,
    Row,
    Space,
    Tooltip,
    Typography,
} from "antd";
import SubMenu from "antd/es/menu/SubMenu";
import React, { useContext, useEffect, useRef, useState } from "react";
import Notestab from "./NotesTab";
import ContactContext from "../context";
import { TNote, TUser, TWallData } from "../../../entities";
import { useLoggedInUser } from "../../../api/query/userQuery";
import moment from "moment";
import CustomLink from "../../../components/CustomLink";
import { useMutation } from "react-query";
import { deleteNoteMutation } from "../../../api/mutation/useNoteMutation";
import queryClient from "../../../queryClient";
import { MenuProps } from "antd/lib";

const ContactsWall = () => {
    const { contact } = useContext(ContactContext);
    const [showing, setShowing] = React.useState("");

    const [showingClass, setShowingClass] = React.useState("");
    const filteredData = contact.wall?.filter(
        (data) => data.type.includes(showing) && data.type != "contactUpdates"
    );
    const { user, isLoading } = useLoggedInUser();

    // console.log("user", user);
    const items = [
        {
            title: "Showing: ",
        },
        {
            title: (
                <a
                    onClick={() => {
                        setShowing("");
                    }}
                >
                    All
                </a>
            ),
        },
        // {
        //     title: (
        //         <a
        //             onClick={() => {
        //                 setShowing("activities");
        //             }}
        //         >
        //             Activities
        //         </a>
        //     ),
        // },
        {
            title: (
                <a
                    onClick={() => {
                        setShowing("deal");
                    }}
                >
                    Deals
                </a>
            ),
        },
        {
            title: (
                <a
                    onClick={() => {
                        setShowing("note");
                    }}
                >
                    Notes
                </a>
            ),
        },
        // {
        //     title: <a>Emails</a>,
        // },
        {
            title: (
                <a
                    onClick={() => {
                        setShowing("activity log");
                    }}
                >
                    Log
                </a>
            ),
        },
        {
            title: (
                <a
                    onClick={() => {
                        setShowing("text");
                    }}
                >
                    Texts
                </a>
            ),
        },
        {
            title: (
                <a
                    onClick={() => {
                        setShowing("files");
                    }}
                >
                    {" "}
                    Files
                </a>
            ),
        },
    ];

    const feedBox = (data: TWallData) => {
        if (data.type === "note") {
            return <NoteBox data={data} />;
        } else if (data.type === "text") {
            return <TextBox data={data} user={user!} />;
        } else if (data.type === "deal") {
            return <DealBox data={data} user={user!} />;
        } else if (data.type === "dealUpdates") {
            return <UpdateBox data={data} user={user!} />;
        } else if (data.type === "activity log") {
            return <Log data={data} user={user!} />;
        } else if (data.type === "files") {
            return <File data={data} user={user!} />;
        } else if (data.type === "activities") {
            return <Activities data={data} user={user!} />;
        } else if (data.type === "call") {
            return <CallBox data={data} user={user!} />;
        } else {
            return <></>;
        }
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                }}
            >
                {items.map((x: any) => {
                    return (
                        <div>
                            {x.title == "Showing: " ? (
                                <div>{x.title}</div>
                            ) : (
                                <Button
                                    type={"text"}
                                    style={{ padding: 5 }}
                                    className="wall-active-button"
                                >
                                    {x.title}
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>
            <Divider />
            <Space
                direction="vertical"
                style={{ width: "100%" }}
                size={"large"}
            >
                {filteredData?.length ? (
                    filteredData.map((data, index) => {
                        const monthYear = data.month + " " + data.year;

                        // Check if it's the first item or the monthYear has changed
                        if (index !== 0) {
                            const prevData = contact.wall![index - 1];
                            const prevMonthYear =
                                prevData.month + " " + prevData.year;

                            // Use a ternary operator directly in the JSX to conditionally render the header
                            return (
                                <div key={index}>
                                    {monthYear !== prevMonthYear && (
                                        <Typography.Text>
                                            {monthYear}
                                        </Typography.Text>
                                    )}
                                    <div style={{ marginTop: 10 }}>
                                        {feedBox(data)}
                                    </div>
                                </div>
                            );
                        } else {
                            // For the first item, render the header unconditionally
                            return (
                                <div key={index}>
                                    <Typography.Text>
                                        {monthYear}
                                    </Typography.Text>
                                    <div style={{ marginTop: 10 }}>
                                        {feedBox(data)}
                                    </div>
                                </div>
                            );
                        }
                    })
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
                {/* <CallBox /> */}
            </Space>
        </>
    );
};

const NoteBox = ({ data }: { data: TWallData }) => {
    const [expanded, setExpanded] = React.useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [divHeight, setDivHeight] = React.useState(0);
    const [actualContentHeight, setActualContentHeight] = React.useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);

    React.useEffect(() => {
        setDivHeight(contentRef?.current?.getBoundingClientRect().height ?? 0);
        setActualContentHeight(contentRef?.current?.scrollHeight ?? 0);
    }, [data.note?.notes, expanded]);

    const deleteTemplate = useMutation(
        (id: string) => deleteNoteMutation(data.note?.id!),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("getContact");
            },
            onError: (e: any) => {
                console.log(e.message || "An error occurred");
            },
        }
    );

    // Helper function to get the card content
    const getCardContent = () => {
        const originalDivHeight = divHeight;
        return (
            <Space direction="vertical" size="middle" className="w-100">
                <Typography.Text>
                    <div
                        ref={contentRef}
                        dangerouslySetInnerHTML={{
                            __html: data.note?.notes || "",
                        }}
                        style={{
                            // Set the height to 'auto' if expanded or if content height is greater than 300px
                            height: expanded || divHeight < 300 ? "auto" : 300,
                            // Add vertical scrollbar when content overflows
                            overflowY: expanded ? "auto" : "hidden",
                            width: "100%",
                        }}
                        className="noteDiv"
                    />
                </Typography.Text>
                {actualContentHeight > 300 && (
                    <span
                        onClick={() => setExpanded(!expanded)}
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            cursor: "pointer",
                            fontSize: 24,
                        }}
                    >
                        {expanded ? <CaretUpOutlined /> : <CaretDownOutlined />}
                    </span>
                )}
            </Space>
        );
    };

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: <div onClick={() => setIsModalOpen(true)}>Edit</div>,
        },
        {
            key: "2",
            label: (
                <Popconfirm
                    title="Delete"
                    description="Are you sure to delete this note?"
                    onConfirm={() => {
                        deleteTemplate.mutate(data.note?.id!);
                    }}
                    // onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                >
                    Delete
                </Popconfirm>
            ),
        },
    ];

    return (
        <>
            <Card
                title={
                    <Typography.Text>
                        Note Added - by{" "}
                        {data.note?.user.firstName +
                            " " +
                            data.note?.user.lastName}
                    </Typography.Text>
                }
                extra={
                    <Space size={"small"}>
                        {moment.utc(data.date).local().format("MMM DD hh:mm A")}
                        <Dropdown
                            menu={{ items }}
                            className="dashboard-actions"
                            trigger={["click"]}
                        >
                            <Button type="link" style={{ padding: 0 }}>
                                <EllipsisOutlined
                                    style={{ transform: "rotate(90deg)" }}
                                />
                            </Button>
                        </Dropdown>
                    </Space>
                }
                // Set the height to 300px when not expanded
                style={{
                    height: expanded || divHeight < 300 ? "auto" : 300,
                    overflow: expanded ? "visible" : "hidden",
                    backgroundColor: "#fef9c1",
                    border: "3px dashed black",
                }}
                // Add the clickable area to expand/collapse the card
            >
                {getCardContent()}
            </Card>
            {isModalOpen && (
                <Modal
                    closable={false}
                    className="your-modal"
                    width={650}
                    title={null}
                    open={isModalOpen}
                    style={{ maxHeight: "700px" }}
                    footer={null}
                >
                    <div className="modal-header m-b-md">
                        <Typography.Title level={5} style={{ color: "white" }}>
                            Update note
                        </Typography.Title>

                        <Button
                            style={{
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                border: "0px",
                            }}
                            onClick={() => setIsModalOpen(false)}
                            icon={<CloseOutlined style={{ color: "white" }} />}
                        />
                    </div>
                    <div className="modal-content">
                        <Notestab
                            note={data.note}
                            handleCancel={() => {
                                setIsModalOpen(false);
                            }}
                        />
                    </div>
                </Modal>
            )}
        </>
    );
};

const TextBox = ({ data, user }: { data: TWallData; user: TUser }) => {
    const header = () => {
        if (data.text?.isFromApp) {
        }
    };
    return (
        <Card
            title={
                <Typography.Text>
                    {data.text?.isFromApp
                        ? "Text Sent by " + data.text.sender
                        : "Text Received from " + data.text?.sender}
                </Typography.Text>
            }
            bordered={false}
            extra={moment.utc(data.date).local().format("MMM DD hh:mm A")}
        >
            <Space direction="vertical" size={"middle"}>
                <Space size={"large"}>
                    <Typography.Text>
                        To:{" "}
                        {data.text?.to.replace(
                            /^(\d{3})(\d{3})(\d{4})$/,
                            "($1) $2-$3"
                        )}
                    </Typography.Text>
                    <Typography.Text>
                        From:{" "}
                        {data.text?.from.replace(
                            /^(\d{3})(\d{3})(\d{4})$/,
                            "($1) $2-$3"
                        )}
                    </Typography.Text>
                </Space>
                <Typography.Text>{data.text?.message}</Typography.Text>
            </Space>
        </Card>
    );
};

const DealBox = ({ data, user }: { data: TWallData; user: TUser }) => {
    return (
        <Card
            title={
                <Typography.Text>
                    {user.id == data.deal?.creator?.id
                        ? "Deal created - by You"
                        : "Deal created - by " + data.deal?.creator?.firstName}
                </Typography.Text>
            }
            bordered={false}
            extra={moment.utc(data.date).local().format("MMM DD hh:mm A")}
        ></Card>
    );
};

const UpdateBox = ({ data, user }: { data: TWallData; user: TUser }) => {
    return (
        <Card
            title={
                <Typography.Text>
                    {`${data.update?.title} - by ${
                        user.id == data.update?.userId ? "You" : data.update?.by
                    }`}
                </Typography.Text>
            }
            bordered={false}
            extra={moment.utc(data.date).local().format("MMM DD hh:mm A")}
            style={{ backgroundColor: "transparent", boxShadow: "none" }}
        >
            {data.update?.from ?? "blank"} <ArrowRightOutlined />{" "}
            {data.update?.to ?? "blank"}
        </Card>
    );
};
const Log = ({ data, user }: { data: TWallData; user: TUser }) => {
    // console.log(data);
    return (
        <Card
            title={
                <Typography.Text>
                    {user.id == data.update?.owner?.id
                        ? data.update?.type + "  - by You"
                        : data.update?.type +
                          "  - by " +
                          data.update?.owner?.firstName}
                </Typography.Text>
            }
            bordered={false}
            extra={moment.utc(data.date).local().format("MMM DD hh:mm A")}
        >
            <Row>
                <Col md={14}>
                    {" "}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: 20,
                            paddingTop: 0,
                            paddingBottom: 0,
                            marginTop: 10,
                        }}
                    >
                        <span>
                            <CalendarOutlined style={{ fontSize: 14 }} />
                        </span>
                        <span
                            style={{
                                fontSize: 14,
                                marginLeft: 10,
                            }}
                        >
                            {" "}
                            {moment(data.update?.start_date).format("LLL")}
                        </span>
                    </div>
                </Col>
                <Col md={10}>
                    {" "}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: 20,
                            paddingTop: 0,
                            paddingBottom: 0,
                            marginTop: 10,
                        }}
                    >
                        <span>Outcome:</span>
                        <span
                            style={{
                                fontSize: 14,
                                marginLeft: 10,
                            }}
                        >
                            {" "}
                            {data.update?.outcome}
                        </span>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};
const Activities = ({ data, user }: { data: TWallData; user: TUser }) => {
    console.log("data activities", data);
    return (
        <Card
            title={
                <Typography.Text>
                    {user.id == data.activity?.owner?.id
                        ? data.activity?.type + "  - by You"
                        : data.activity?.type +
                          "  - by " +
                          data.activity?.owner?.firstName}
                </Typography.Text>
            }
            bordered={false}
            extra={moment.utc(data.date).local().format("MMM DD hh:mm A")}
        >
            <Row>
                <Col md={14}>
                    {" "}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: 20,
                            paddingTop: 0,
                            paddingBottom: 0,
                            marginTop: 10,
                        }}
                    >
                        <span>
                            <CalendarOutlined style={{ fontSize: 14 }} />
                        </span>
                        <span
                            style={{
                                fontSize: 14,
                                marginLeft: 10,
                            }}
                        >
                            {" "}
                            {moment(data.activity?.start_date).format("LLL")}
                        </span>
                    </div>
                </Col>
                <Col md={10}>
                    {" "}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: 20,
                            paddingTop: 0,
                            paddingBottom: 0,
                            marginTop: 10,
                        }}
                    >
                        <span>Outcome:</span>
                        <span
                            style={{
                                fontSize: 14,
                                marginLeft: 10,
                            }}
                        >
                            {" "}
                            {data.activity?.availability}
                        </span>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};
const File = ({ data, user }: { data: TWallData; user: TUser }) => {
    console.log({ data });
    return (
        <Card
            title={
                <Typography.Text>
                    {data?.file?.file_type +
                        " Added - by " +
                        data.file?.uploaded_by?.firstName}
                </Typography.Text>
            }
            bordered={false}
            extra={moment.utc(data.date).local().format("MMM DD hh:mm A")}
        >
            {data?.file?.file_type == "Call Recording" && (
                <audio
                    src={window.location.origin + "/" + data?.file?.file_url}
                    controls
                />
            )}

            {data?.file?.file_type == "Image" && (
                <div
                    style={{
                        position: "relative",
                        overflow: "hidden", // This ensures child elements don't overflow
                    }}
                >
                    <img
                        src={
                            window.location.origin + "/" + data?.file?.file_url
                        }
                        alt="Your Image"
                        style={{
                            width: "100%", // This ensures the image fills the parent container
                            height: "auto", // This maintains the aspect ratio
                            display: "block", // Removes any default inline styles
                        }}
                    />
                </div>
            )}
        </Card>
    );
};
const CallBox = ({ data, user }: { data: TWallData; user: TUser }) => {
    const capFirstLetter = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    };

    let url: any = data.call?.recording_url;
    url = url.split(",");
    url = url[0];
    url = url.replace("playAudio('", "");
    return (
        <Card
            title={
                <Typography.Text>
                    Call{" "}
                    {data.call?.isFromApp
                        ? `by ${data.call?.contactNameFrom}`
                        : `for ${data.call?.contactNameTo}`}
                </Typography.Text>
            }
            bordered={false}
            extra={moment.utc(data.date).local().format("MMM DD hh:mm A")}
        >
            <Space
                direction="vertical"
                size={"middle"}
                style={{ width: "100%" }}
            >
                <Space size={"large"}>
                    <Typography.Text>From: {data.call?.from}</Typography.Text>
                    <Typography.Text>To: {data.call?.to}</Typography.Text>
                    <Button type="link" style={{ padding: 0 }}>
                        <PhoneOutlined /> Call back
                    </Button>
                </Space>
                <Space size={"large"}>
                    <Typography.Text style={{ alignItems: "center" }}>
                        <CalendarOutlined /> {data.call?.dateTime}
                    </Typography.Text>
                    <Typography.Text>
                        <ClockCircleOutlined /> {data.call?.duration}
                    </Typography.Text>
                    <Typography.Text>
                        Outcome: {capFirstLetter(data.call?.outcome)}
                    </Typography.Text>
                </Space>
                {data.call?.recording_url ? (
                    <div style={{ padding: 10 }}>
                        <audio src={url} controls />
                    </div>
                ) : null}
            </Space>
        </Card>
    );
};

export default ContactsWall;
