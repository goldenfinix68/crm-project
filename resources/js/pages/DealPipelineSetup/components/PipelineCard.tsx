import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Button,
    Col,
    Dropdown,
    Input,
    Modal,
    Radio,
    Row,
    Space,
    Table,
    Tooltip,
    Typography,
    Form,
    Select,
    DatePicker,
    List,
} from "antd";

import { CloseOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { useMutation } from "react-query";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { TDealPipeline, TDealPipelineStage } from "../../../entities";
import {
    createPipeline,
    deleteDealPipeline,
} from "../../../api/mutation/useDealMutation";
import queryClient from "../../../queryClient";
import { Card, Popconfirm } from "antd/lib";
import PipelineAddUpdateModal from "./PipelineAddUpdateModal";
import DealPipelineStageAddUpdateModal from "./DealPipelineStageAddUpdateModal";
import DraggableStageItemList from "./DraggableStageItemList";
interface Props {
    pipeline: TDealPipeline;
}
const PipelineCard = ({ pipeline }: Props) => {
    const [isPipelineAddUpdateOpen, setIsPipelineAddUpdateOpen] =
        React.useState(false);
    const [selectedPipeline, setSelectedPipeline] = React.useState<
        TDealPipeline | undefined
    >();

    const [isPipelineStageAddUpdateOpen, setIsPipelineStageAddUpdateOpen] =
        React.useState(false);
    const [selectedPipelineStage, setSelectedPipelineStage] = React.useState<
        TDealPipelineStage | undefined
    >();

    const deletePipeline = useMutation((id: string) => deleteDealPipeline(id), {
        onSuccess: () => {
            queryClient.invalidateQueries("dealPipelines");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });
    return (
        <>
            <Card
                title={pipeline.name}
                key={pipeline.id}
                extra={
                    <Space>
                        <Button
                            type="default"
                            size="small"
                            onClick={() =>
                                setIsPipelineStageAddUpdateOpen(true)
                            }
                        >
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
                                await deletePipeline.mutate(pipeline.id)
                            }
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteOutlined />
                        </Popconfirm>
                    </Space>
                }
            >
                <List
                    size="small"
                    header={false}
                    footer={false}
                    dataSource={pipeline?.stages}
                    renderItem={(stage, index) => (
                        <DraggableStageItemList
                            index={index}
                            stage={stage}
                            stages={pipeline?.stages ?? []}
                            handleEditClick={(stage) => {
                                setIsPipelineStageAddUpdateOpen(true);
                                setSelectedPipelineStage(stage);
                            }}
                        />
                    )}
                />
            </Card>

            <PipelineAddUpdateModal
                isModalOpen={isPipelineAddUpdateOpen}
                closeModal={() => setIsPipelineAddUpdateOpen(false)}
                handleSubmit={() => {
                    console.log("qwe");
                }}
                pipeline={selectedPipeline}
            />
            <DealPipelineStageAddUpdateModal
                isModalOpen={isPipelineStageAddUpdateOpen}
                closeModal={() => setIsPipelineStageAddUpdateOpen(false)}
                handleSubmit={() => {
                    console.log("qwe");
                }}
                pipelineId={pipeline.id}
                stage={selectedPipelineStage}
            />
        </>
    );
};

export default PipelineCard;
