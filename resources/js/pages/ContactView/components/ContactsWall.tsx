import {
    CalendarOutlined,
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
import React from "react";
import Notestab from "./NotesTab";

const ContactsWall = () => {
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
            <Typography.Text>July 2023</Typography.Text>
            <NoteBox />
            <TextBox />
            <CallBox />
        </Space>
    );
};

const NoteBox = () => {
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
            extra="Jul 4"
        >
            <Space direction="vertical" size={"middle"}>
                <Typography.Text>
                    Hi Jesse. Sorry didn't get back sooner. I'm out of town
                    until tomorrow. I would love to help you out. I will reach
                    out tomorrow. Thanks Anita
                </Typography.Text>
            </Space>
        </Card>
    );
};

const TextBox = () => {
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
                    Text Sent by Jesse Ashley
                </Typography.Text>
            }
            bordered={false}
            extra="Jul 4"
        >
            <Space direction="vertical" size={"middle"}>
                <Space size={"large"}>
                    <Typography.Text>To: +1 303-952-1461</Typography.Text>
                    <Typography.Text>From: +1 440-781-6916</Typography.Text>
                </Space>
                <Typography.Text>
                    Hi Jesse. Sorry didn't get back sooner. I'm out of town
                    until tomorrow. I would love to help you out. I will reach
                    out tomorrow. Thanks Anita
                </Typography.Text>
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
