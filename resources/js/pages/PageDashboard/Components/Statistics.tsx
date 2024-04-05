import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import {
    CommentOutlined,
    DollarCircleOutlined,
    PhoneOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { mutateGet } from "../../../api/mutation/useSetupMutation";

const Statistics = ({ dateFilter }) => {
    const [isLoading, setIsLoading] = useState(false);

    const { data, refetch } = mutateGet(
        { dateFilter },
        "/api/dashboard/statistics",
        "dashboard-statistics",
        () => {
            setIsLoading(false);
        }
    );

    useEffect(() => {
        setIsLoading(true);
        refetch();
    }, [dateFilter]);

    return (
        <Card loading={isLoading}>
            <Row gutter={16} className="p-lg">
                <Col span={6}>
                    <Statistic
                        title="Contacts"
                        value={data?.data?.contacts ?? 0}
                        prefix={<UserOutlined />}
                    />
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Deals"
                        value={data?.data?.deals ?? 0}
                        prefix={<DollarCircleOutlined />}
                    />
                </Col>
                <Col span={6}>
                    <Statistic
                        title="SMS Received"
                        value={data?.data?.texts ?? 0}
                        prefix={<CommentOutlined />}
                    />
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Calls Received"
                        value={data?.data?.calls ?? 0}
                        prefix={<PhoneOutlined />}
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default Statistics;
