import {
    Button,
    Card,
    Mentions,
    Popover,
    Tooltip,
    Typography,
    Form,
} from "antd";
import React from "react";
import Notestab from "./NotesTab";
import ActivityTab from "./ActivityTab";
import LogActivityTab from "./LogActivityTab";
import FileTab from "./FileTab";
import EmailTab from "./EmailTab";

const ActionsTabs = () => {
    const [form] = Form.useForm();
    const [activeKey, setActiveTabKey] = React.useState<string>("note");
    const tabListNoTitle = [
        {
            key: "note",
            label: <TabLabel label="NOTE" />,
        },
        {
            key: "email",
            label: <TabLabel label="EMAIL" />,
        },
        // {
        //     key: "addActivity",
        //     label: <TabLabel label="ADD ACTIVITY" />,
        // },
        {
            key: "logActivity",
            label: <TabLabel label="LOG ACTIVITY" />,
        },
        {
            key: "file",
            label: <TabLabel label="FILE" />,
        },
    ];
    const handleFinish = (values) => {
        console.log(values);
        // Perform form submission logic here
    };

    const contentListNoTitle: Record<string, React.ReactNode> = {
        note: <Notestab />,
        email: <EmailTab />,
        // addActivity: <ActivityTab />,
        logActivity: <LogActivityTab />,
        file: <FileTab />,
    };
    return (
        <Card
            style={{ width: "100%" }}
            tabList={tabListNoTitle}
            activeTabKey={activeKey}
            onTabChange={(e) => setActiveTabKey(e)}
        >
            {contentListNoTitle[activeKey]}
        </Card>
    );
};

const TabLabel = ({ label }: { label: string }) => (
    <Typography.Text strong style={{ fontSize: 11 }}>
        {label}
    </Typography.Text>
);

export default ActionsTabs;
