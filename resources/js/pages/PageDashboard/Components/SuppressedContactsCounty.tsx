import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import { DollarCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/charts";
import { mutateGet } from "../../../api/mutation/useSetupMutation";

const SuppressedContactsCounty = ({ dateFilter }) => {
    const [isLoading, setIsLoading] = useState(true);

    const { data: data, refetch } = mutateGet(
        { dateFilter },
        "/api/dashboard/suppressed-contact-per-county",
        "suppressed-contact-per-county",
        () => {
            setIsLoading(false);
        }
    );

    const config = {
        data: data?.data,
        height: 400,
        xField: "county",
        yField: "Count",
    };

    useEffect(() => {
        setIsLoading(true);
        refetch();
    }, [dateFilter]);

    return (
        <Card title="Suppressed contacts per county" loading={isLoading}>
            <Column {...config} />
        </Card>
    );
};

export default SuppressedContactsCounty;
