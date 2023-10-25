import React, { useEffect, useState } from "react";
import { Space, List, Tag, message, Tooltip, Popconfirm } from "antd";
import { useDrag, useDrop } from "react-dnd";
import {
    EditOutlined,
    DeleteOutlined,
    HolderOutlined,
    LockOutlined,
} from "@ant-design/icons";
import { useMutation } from "react-query";
import { TDealPipelineStage } from "../../../entities";
import {
    deleteDealPipelineStage,
    sortDealPipelineStageMutation,
} from "../../../api/mutation/useDealMutation";
import queryClient from "../../../queryClient";

const DraggableStageItemList = ({
    index,
    stage,
    stages,
    handleEditClick,
}: {
    index: number;
    stage: TDealPipelineStage;
    stages: TDealPipelineStage[];
    handleEditClick: (stage) => void;
}) => {
    const deleteCustomField = useMutation(
        (id: string) => deleteDealPipelineStage(id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("dealPipelines");
            },
            onError: (e: any) => {
                console.log(e.message || "An error occurred");
            },
        }
    );

    const [, ref] = useDrag({
        type: "CUSTOM_FIELD",
        item: { index },
    });

    const [, drop] = useDrop({
        accept: "CUSTOM_FIELD",
        drop: (draggedItem: { id: number; index: number }) => {
            if (draggedItem.index !== index) {
                moveCustomField(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    const sortStages = useMutation(sortDealPipelineStageMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("dealPipelines");
            message.success("Succesfully saved.");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const moveCustomField = (fromIndex, toIndex) => {
        const updatedCards = [...(stages || [])];
        const [moveCustomField] = updatedCards.splice(fromIndex, 1);
        updatedCards.splice(toIndex, 0, moveCustomField);
        sortStages.mutate(updatedCards);
    };

    return (
        <>
            <List.Item
                key={stage.id}
                style={{ cursor: "move", width: "100%" }}
                ref={(node) => ref(drop(node))}
            >
                <List.Item.Meta
                    title={
                        <Space>
                            <HolderOutlined className="p-t-xs" />
                            {stage.name}
                        </Space>
                    }
                />
                <Space>
                    <EditOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            handleEditClick(stage);
                        }}
                    />

                    <Popconfirm
                        title="Delete"
                        description="Are you sure to delete this stage?"
                        onConfirm={async () =>
                            await deleteCustomField.mutate(stage.id)
                        }
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteOutlined />
                    </Popconfirm>
                </Space>
            </List.Item>
        </>
    );
};

export default DraggableStageItemList;
