import { Card, Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { UserAddOutlined, PlusCircleOutlined } from "@ant-design/icons";
import ActivityTable from "./components/ActivityTable";

const Activity = () => {
    return (
        <Card title="Activity List">
            <ActivityTable />
        </Card>
    );
};

export default Activity;
