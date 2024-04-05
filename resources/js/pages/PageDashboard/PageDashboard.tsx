import React, { useEffect, useState } from "react";
import DashboardComponentButtons from "./Components/DashboardComponentButtons";
import DashboardComponentFilters from "./Components/DashboardComponentFilters";
import DashboardComponentWidget from "./Components/DashboardComponentWidget";
import { Card, Col, DatePicker, Row, Space, Statistic, Typography } from "antd";
import CallLogsTable from "./Components/CallLogsTable";
import {
    DollarCircleOutlined,
    LikeOutlined,
    UserOutlined,
} from "@ant-design/icons";
import Statistics from "./Components/Statistics";
import SuppressedContactsCounty from "./Components/SuppressedContactsCounty";
import { TimeRangePickerProps } from "antd/lib";
import dayjs, { Dayjs } from "dayjs";
import { EventValue } from "rc-picker/lib/interface";

interface MyProps {
    props: any;
}

const PageDashboard: React.FC<MyProps> = () => {
    const [dateFilter, setDateFilter] = useState<
        [EventValue<Dayjs>, EventValue<Dayjs>]
    >([dayjs().add(-7, "d"), dayjs()]);

    const rangePresets: TimeRangePickerProps["presets"] = [
        { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
        { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
        { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
        { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
    ];

    const onRangeChange = (
        dates: null | (Dayjs | null)[],
        dateStrings: string[]
    ) => {
        if (dates) {
            console.log([dates[0] || dayjs(), dates[1] || dayjs()]);
            setDateFilter([dates[0] || dayjs(), dates[1] || dayjs()]);
        } else {
            console.log("Clear");
        }
    };

    useEffect(() => {
        document.title = "Dashboard - SpeedLead";
        return () => {};
    }, []);

    return (
        <Space direction="vertical" className="w-100">
            <Space className="p-l-lg p-t-lg">
                Period:
                <DatePicker.RangePicker
                    presets={rangePresets}
                    onChange={onRangeChange}
                    value={dateFilter}
                />
            </Space>
            {/* <DashboardComponentButtons /> */}
            {/* 
            <DashboardComponentFilters />

            <DashboardComponentWidget /> */}

            <Statistics dateFilter={dateFilter} />

            <SuppressedContactsCounty dateFilter={dateFilter} />
            <CallLogsTable dateFilter={dateFilter} />
        </Space>
    );
};

export default PageDashboard;
