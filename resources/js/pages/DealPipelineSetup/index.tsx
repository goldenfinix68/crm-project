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

const DealPipelineSetup: React.FC = () => {
    const [isPipelineAddUpdateOpen, setIsPipelineAddUpdateOpen] =
        React.useState(false);
    const [selectedPipeline, setSelectedPipeline] = React.useState<
        TDealPipeline | undefined
    >();
    const { data: pipelines, isLoading, refetch } = dealPipelines();

    const deletePipeline = useMutation((id: string) => deleteDealPipeline(id), {
        onSuccess: () => {
            queryClient.invalidateQueries("dealPipelines");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    if (isLoading) {
        return <LoadingComponent />;
    }
    return (
        <>
            {pipelines?.length ? (
                <Space direction="vertical" style={{ width: "100%" }}>
                    {pipelines?.map((pipeline, index) => (
                        <Card
                            title={pipeline.name}
                            key={index}
                            extra={
                                <Space>
                                    <Button type="default" size="small">
                                        Add New Stage
                                    </Button>
                                    <EditOutlined
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            setSelectedPipeline(pipeline);
                                            setIsPipelineAddUpdateOpen(true);
                                        }}
                                    />

                                    <Popconfirm
                                        title="Delete"
                                        description="Are you sure to delete this pipeline?"
                                        onConfirm={async () =>
                                            await deletePipeline.mutate(
                                                pipeline.id
                                            )
                                        }
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <DeleteOutlined />
                                    </Popconfirm>
                                </Space>
                            }
                        ></Card>
                    ))}
                </Space>
            ) : (
                <Card>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </Card>
            )}

            <PipelineAddUpdateModal
                isModalOpen={isPipelineAddUpdateOpen}
                closeModal={() => setIsPipelineAddUpdateOpen(false)}
                handleSubmit={() => {
                    console.log("qwe");
                }}
                pipeline={selectedPipeline}
            />
        </>
    );
};

export default DealPipelineSetup;
