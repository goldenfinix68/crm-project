import { Card, Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { UserAddOutlined, PlusCircleOutlined } from "@ant-design/icons";
import ActivityTable from "./components/ActivityTable";

interface DataType {
    key: React.Key;
    title: string;
    start_date: string;
    duration: string;
    owner: string;
    title2: string;
    name: string;
    tags: any;
}

const Activity = () => {
    const data: DataType[] = [
        {
            key: "1",
            title: "Joanne Middleton PASCO AUCTION Deal Review",
            start_date: "Invalid date",
            duration: "01:00",
            owner: "Jesse Admin",
            title2: "",
            name: "Joanne Middleton PASCO AUCTION",
            tags: "",
        },
    ];

    return (
        <Card title="Activity List">
            <ActivityTable activites={data} />
        </Card>
    );
};

export default Activity;
