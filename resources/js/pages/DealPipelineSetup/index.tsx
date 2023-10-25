import React, { useEffect } from "react";
import { Card, Space, Row, Col, Button } from "antd";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableCardSection from "../../components/DraggableCardSection";
import {
    useCustomFieldSections,
    useInactiveCustomFields,
} from "../../api/query/customFieldQuery";
import LoadingComponent from "../../components/LoadingComponent";
import { Empty, Popconfirm } from "antd/lib";
import InactiveCustomFields from "../../components/InactiveCustomFields";
import { dealPipelines } from "../../api/query/dealQuery";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PipelineAddUpdateModal from "./components/PipelineAddUpdateModal";
import { TDealPipeline } from "../../entities";
import { useMutation } from "react-query";
import { deleteDealPipeline } from "../../api/mutation/useDealMutation";
import queryClient from "../../queryClient";
import PipelineCard from "./components/PipelineCard";

const DealPipelineSetup: React.FC = () => {
    const { data: pipelines, isLoading, refetch } = dealPipelines();

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
