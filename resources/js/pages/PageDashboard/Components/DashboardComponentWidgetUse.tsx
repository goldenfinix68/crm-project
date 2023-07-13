import React, { useState } from "react";
import { CaretDownFilled } from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Dropdown,
    List,
    Progress,
    Row,
    Space,
    Typography,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import appStore from "../../../../images/app-store.svg";
import chromeWeb from "../../../../images/chrome-web-store.svg";
import googlePlay from "../../../../images/google-play-btn.svg";

interface MyProps {
    props: any;
}

const data = [
    "Built-in calling and texting",
    "Team / Shared Inbox",
    "Create forms to capture leads",
    "Automate your journeys",
    "Explore chat",
];

const DashboardComponentWidgetUse: React.FC<MyProps> = (props) => {
    const {} = props;

    return (
        <>
            <Card
                className="m-t-sm"
                bodyStyle={{ padding: "15px 20px 20px" }}
                style={{ borderRadius: 5 }}
            >
                <Typography.Text strong>Use From Anywhere</Typography.Text>
                <br />
                <Space style={{ marginTop: 15 }}>
                    <img src={appStore} />
                    <img src={googlePlay} />
                    <img src={chromeWeb} />
                </Space>
            </Card>
        </>
    );
};

export default DashboardComponentWidgetUse;
