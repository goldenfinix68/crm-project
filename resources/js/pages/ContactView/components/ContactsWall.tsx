import {
    CalendarOutlined,
    CaretDownOutlined,
    CaretUpOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    DownloadOutlined,
    InfoCircleOutlined,
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
    Menu,
    Popover,
    Space,
    Tooltip,
    Typography,
} from "antd";
import SubMenu from "antd/es/menu/SubMenu";
import React, { useContext, useRef } from "react";
import Notestab from "./NotesTab";
import ContactContext from "../context";
import { TNote, TWallData } from "../../../entities";

const ContactsWall = () => {
    const { contact } = useContext(ContactContext);
    const items = [
        {
            title: "Showing: ",
        },
        {
            title: <a href="">All</a>,
        },
        {
            title: <a href="">Activities</a>,
        },
        {
            title: <a href="">Deals</a>,
        },
        {
            title: <a href="">Notes</a>,
        },
        {
            title: <a href="">Emails</a>,
        },
        {
            title: <a href="">Files</a>,
        },
        {
            title: <a href="">Texts</a>,
        },
        {
            title: <a href="">Updates</a>,
        },
    ];

    return (
        <Space direction="vertical" style={{ width: "100%" }} size={"large"}>
            <Breadcrumb separator={<span>&nbsp;</span>} items={items} />
            {contact?.wall?.map((data, index) => {
                const monthYear = data.month + " " + data.year;

                // Check if it's the first item or the monthYear has changed
                if (index !== 0) {
                    const prevData = contact.wall![index - 1];
                    const prevMonthYear = prevData.month + " " + prevData.year;

                    // Use a ternary operator directly in the JSX to conditionally render the header
                    return (
                        <div key={index}>
                            {monthYear !== prevMonthYear && (
                                <Typography.Text>{monthYear}</Typography.Text>
                            )}
                            {data.type === "note" ? (
                                <NoteBox data={data} />
                            ) : null}
                            {data.type === "text" ? (
                                <TextBox data={data} />
                            ) : null}
                        </div>
                    );
                } else {
                    // For the first item, render the header unconditionally
                    return (
                        <div key={index}>
                            <Typography.Text>{monthYear}</Typography.Text>
                            {data.type === "note" ? (
                                <NoteBox data={data} />
                            ) : null}
                            {data.type === "text" ? (
                                <TextBox data={data} />
                            ) : null}
                        </div>
                    );
                }
            })}
            <CallBox />
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
    const isSent = data.text?.type == "sent";
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
                    {`Text ${data.text?.type} ${isSent ? "by" : "from"} ${
                        data.text?.sender
                    }`}
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
