import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    CalendarOutlined,
    CaretDownOutlined,
    CaretUpOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    DownloadOutlined,
    InfoCircleOutlined,
    PaperClipOutlined,
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
    Empty,
    Menu,
    Popover,
    Row,
    Space,
    Tooltip,
    Typography,
} from "antd";
import SubMenu from "antd/es/menu/SubMenu";
import React, { useContext, useRef } from "react";
import Notestab from "./NotesTab";
import ContactContext from "../context";
import { TNote, TUser, TWallData } from "../../../entities";
import { useLoggedInUser } from "../../../api/query/userQuery";
import moment from "moment";

const ContactsWall = () => {
    const { contact } = useContext(ContactContext);
    const [showing, setShowing] = React.useState("");
    const filteredData = contact.wall?.filter((data) =>
        data.type.includes(showing)
    );
    const { user, isLoading } = useLoggedInUser();
    const items = [
        {
            title: "Showing: ",
        },
        {
            title: <a onClick={() => setShowing("")}>All</a>,
        },
        {
            title: <a>Activities</a>,
        },
        {
            title: <a onClick={() => setShowing("deal")}>Deals</a>,
        },
        {
            title: <a onClick={() => setShowing("note")}>Notes</a>,
        },
        {
            title: <a>Emails</a>,
        },
        {
            title: <a onClick={() => setShowing("activity log")}>Log</a>,
        },
        {
            title: <a onClick={() => setShowing("text")}>Texts</a>,
        },
        {
            title: <a onClick={() => setShowing("files")}> Files</a>,
        },
    ];

    const feedBox = (data: TWallData) => {
        if (data.type === "note") {
            return <NoteBox data={data} />;
        } else if (data.type === "text") {
            return <TextBox data={data} />;
        } else if (data.type === "deal") {
            return <DealBox data={data} />;
        } else if (data.type === "update") {
            return <UpdateBox data={data} user={user} />;
        } else if (data.type === "activity log") {
            return <Log data={data} />;
        } else if (data.type === "files") {
            return <File data={data} />;
        } else {
            return <></>;
        }
    };

    return (
        <Space direction="vertical" style={{ width: "100%" }} size={"large"}>
            <Breadcrumb separator={<span>&nbsp;</span>} items={items} />
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
                                {feedBox(data)}
                            </div>
                        );
                    } else {
                        // For the first item, render the header unconditionally
                        return (
                            <div key={index}>
                                <Typography.Text>{monthYear}</Typography.Text>
                                {feedBox(data)}
                            </div>
                        );
                    }
                })
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            {/* <CallBox /> */}
        </Space>
    );
};

const NoteBox = ({ data }: { data: TWallData }) => {
    const [expanded, setExpanded] = React.useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [divHeight, setDivHeight] = React.useState(0);
    const [actualContentHeight, setActualContentHeight] = React.useState(0);

    React.useEffect(() => {
        setDivHeight(contentRef?.current?.getBoundingClientRect().height ?? 0);
        setActualContentHeight(contentRef?.current?.scrollHeight ?? 0);
    }, [data.note?.notes, expanded]);

    // Helper function to get the card content
    const getCardContent = () => {
        const originalDivHeight = divHeight;
        return (
            <Space direction="vertical" size="middle">
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
                        }}
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
    return (
        <Card
            title={
                <Typography.Text>
                    <Avatar
                        style={{
                            backgroundColor: "#C0CA33",
                            verticalAlign: "middle",
                        }}
                        size={20}
                    >
                        J
                    </Avatar>{" "}
                    Note Added - by Jesse
                </Typography.Text>
            }
            bordered={false}
            extra={data.month.substring(0, 3) + " " + data.day}
            // Set the height to 300px when not expanded
            style={{
                height: expanded || divHeight < 300 ? "auto" : 300,
                overflow: expanded ? "visible" : "hidden",
            }}
            // Add the clickable area to expand/collapse the card
        >
            {getCardContent()}
        </Card>
    );
};

const TextBox = ({ data }: { data: TWallData }) => {
    const header = () => {
        if (data.text?.isFromApp) {
        }
    };
    return (
        <Card
            title={
                <Typography.Text>
                    <Avatar
                        style={{
                            backgroundColor: "#C0CA33",
                            verticalAlign: "middle",
                        }}
                        size={20}
                    >
                        {data?.text?.sender.charAt(0)}
                    </Avatar>{" "}
                    {data.text?.isFromApp
                        ? "Text Sent by " + data.text.sender
                        : "Text Received from " + data.text?.sender}
                </Typography.Text>
            }
            bordered={false}
            extra={data.month.substring(0, 3) + " " + data.day}
        >
            <Space direction="vertical" size={"middle"}>
                <Space size={"large"}>
                    <Typography.Text>To: {data.text?.to}</Typography.Text>
                    <Typography.Text>From: {data.text?.from}</Typography.Text>
                </Space>
                <Typography.Text>{data.text?.message}</Typography.Text>
            </Space>
        </Card>
    );
};

const DealBox = ({ data }: { data: TWallData }) => {
    return (
        <Card
            title={
                <Typography.Text>
                    <Avatar
                        style={{
                            backgroundColor: "#C0CA33",
                            verticalAlign: "middle",
                        }}
                        size={20}
                    >
                        {data.deal?.owner.charAt(0)}
                    </Avatar>{" "}
                    {`Deal created - by you`}
                </Typography.Text>
            }
            bordered={false}
            extra={data.month.substring(0, 3) + " " + data.day}
        >
            <Button type="link">{data.deal?.title}</Button>
        </Card>
    );
};

const UpdateBox = ({ data, user }: { data: TWallData; user: TUser }) => {
    return (
        <Card
            title={
                <Typography.Text>
                    <Avatar
                        style={{
                            backgroundColor: "#C0CA33",
                            verticalAlign: "middle",
                        }}
                        size={20}
                    >
                        {data.update?.by.charAt(0)}
                    </Avatar>{" "}
                    {`${data.update?.title} - by ${
                        user.id == data.update?.userId ? "You" : data.update?.by
                    }`}
                </Typography.Text>
            }
            bordered={false}
            extra={data.month.substring(0, 3) + " " + data.day}
            style={{ backgroundColor: "transparent", boxShadow: "none" }}
        >
            {data.update?.from ?? "blank"} <ArrowRightOutlined />{" "}
            {data.update?.to ?? "blank"}
        </Card>
    );
};
const Log = ({ data }: { data: TWallData }) => {
    console.log(data);
    return (
        <Card
            title={
                <Typography.Text>
                    <Avatar
                        style={{
                            backgroundColor: "#C0CA33",
                            verticalAlign: "middle",
                        }}
                        size={20}
                    >
                        {data.update?.owner?.firstName.charAt(0)}
                    </Avatar>{" "}
                    {data.update?.type + "  - by you"}
                </Typography.Text>
            }
            bordered={false}
            extra={data.month.substring(0, 3) + " " + data.day}
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
const File = ({ data }: { data: TWallData }) => {
    console.log(data);
    return (
        <Card
            title={
                <Typography.Text>
                    <Avatar
                        style={{
                            backgroundColor: "#C0CA33",
                            verticalAlign: "middle",
                        }}
                        size={20}
                    >
                        {data.update?.uploaded_by?.firstName.charAt(0)}
                    </Avatar>{" "}
                    {"File Added - by you"}
                </Typography.Text>
            }
            bordered={false}
            extra={data.month.substring(0, 3) + " " + data.day}
        >
            <div
                style={{
                    background: "#F2F5FA",
                    borderRadius: 5,
                    padding: 10,
                    cursor: "pointer",
                }}
                onClick={() => {
                    window.open(
                        window.location.origin + "/" + data?.update?.file_url
                    );
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <span>
                        <PaperClipOutlined style={{ fontSize: 20 }} />
                    </span>
                    <span style={{ marginLeft: 10 }}>
                        {data?.update?.file_name}

                        <div style={{ fontSize: 10 }}>
                            {" "}
                            {data?.update?.file_size}
                        </div>
                    </span>
                </div>
            </div>
        </Card>
    );
};

const CallBox = () => {
    return (
        <Card
            title={
                <Typography.Text>
                    <Avatar
                        style={{
                            backgroundColor: "blue",
                            verticalAlign: "middle",
                        }}
                        size={20}
                    >
                        J
                    </Avatar>{" "}
                    Call for Jesse Ashley
                </Typography.Text>
            }
            bordered={false}
            extra="Jul 2"
        >
            <Space
                direction="vertical"
                size={"middle"}
                style={{ width: "100%" }}
            >
                <Space size={"large"}>
                    <InfoCircleOutlined />
                    <Typography.Text>From: Outreach</Typography.Text>
                    <Typography.Text>To: +1 303-952-1461</Typography.Text>
                    <Button type="link" style={{ padding: 0 }}>
                        <PhoneOutlined /> Call back
                    </Button>
                </Space>
                <Space size={"large"}>
                    <Typography.Text>
                        <CalendarOutlined /> Jun 30, 2023 10:03 AM
                    </Typography.Text>
                    <Typography.Text>
                        <ClockCircleOutlined /> 2 mins
                    </Typography.Text>
                    <Typography.Text>Outcome: Connected</Typography.Text>
                </Space>

                <Space size={"large"}>
                    <PlayCircleOutlined />
                    <PlaySquareFilled style={{ color: "green" }} />
                    <DeleteOutlined />
                    <DownloadOutlined />
                </Space>
                <Notestab />
            </Space>
        </Card>
    );
};

export default ContactsWall;
