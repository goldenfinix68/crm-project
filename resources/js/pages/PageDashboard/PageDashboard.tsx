import React from "react";
import DashboardComponentButtons from "./Components/DashboardComponentButtons";
import DashboardComponentFilters from "./Components/DashboardComponentFilters";
import DashboardComponentWidget from "./Components/DashboardComponentWidget";
import { Card, Space, Typography } from "antd";
import CallLogsTable from "./Components/CallLogsTable";

interface MyProps {
    props: any;
}

const PageDashboard: React.FC<MyProps> = () => {
    return (
        <Space direction="vertical" className="w-100">
            {/* <DashboardComponentButtons /> */}
            {/* 
            <DashboardComponentFilters />

            <DashboardComponentWidget /> */}
            <Card title="Call Logs">
                <CallLogsTable />
            </Card>
        </Space>
    );
};

export default PageDashboard;
