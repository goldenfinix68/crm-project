import React, { useEffect } from "react";
import { Card, Space } from "antd";

import LoadingComponent from "../../components/LoadingComponent";
import { Empty } from "antd/lib";
import { dealPipelines } from "../../api/query/dealQuery";
import PipelineCard from "./components/PipelineCard";

const DealPipelineSetup: React.FC = () => {
    const { data: pipelines, isLoading } = dealPipelines();
    useEffect(() => {
        document.title = "Deal Pipeline Setup - SpeedLead";
        return () => {};
    }, []);

    if (isLoading) {
        return <LoadingComponent />;
    }
    return (
        <>
            {pipelines?.length ? (
                <Space direction="vertical" style={{ width: "100%" }}>
                    {pipelines?.map((pipeline, index) => (
                        <PipelineCard pipeline={pipeline} />
                    ))}
                </Space>
            ) : (
                <Card>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </Card>
            )}
        </>
    );
};

export default DealPipelineSetup;
