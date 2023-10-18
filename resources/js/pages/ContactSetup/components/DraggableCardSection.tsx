import React, { useState } from "react";
import { Card, Space, Button, Typography } from "antd";
import { useDrag, useDrop } from "react-dnd";
import {
    DownOutlined,
    RightOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { TCustomFieldSection } from "../../../entities";
import { useMutation } from "react-query";
import { deleteCustomFieldSectionMutation } from "../../../api/mutation/useCustomFieldMutation";
import queryClient from "../../../queryClient";
import ConfirmModal from "../../../components/ConfirmModal";

const DraggableCard = ({
    id,
    index,
    moveCard,
    card,
    handleEdit,
}: {
    id: number;
    index: number;
    moveCard: (fromIndex, toIndex) => void;
    card: TCustomFieldSection;
    handleEdit: (section) => void;
}) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteBtnLoading, setIsDeleteBtnLoading] = useState(false);

    const [, ref] = useDrag({
        type: "CARD",
        item: { id, index },
    });

    const [, drop] = useDrop({
        accept: "CARD",
        hover: (draggedItem: { id: number; index: number }) => {
            if (draggedItem.index !== index) {
                moveCard(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const deleteSection = useMutation(
        (id: string) => deleteCustomFieldSectionMutation(card.id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("customFieldSections");
                setIsDeleteModalOpen(false);
            },
            onError: (e: any) => {
                console.log(e.message || "An error occurred");
            },
        }
    );

    return (
        <>
            <Card
                title={
                    <div ref={(node) => ref(drop(node))}>
                        <Space style={{ cursor: "move", width: "100%" }}>
                            {card.name}
                            <Button
                                type="text"
                                icon={
                                    <div className="p-t-xs">
                                        {!isMinimized ? (
                                            <DownOutlined size={15} />
                                        ) : (
                                            <RightOutlined />
                                        )}
                                    </div>
                                }
                                onClick={toggleMinimize}
                            />
                        </Space>
                    </div>
                }
                extra={
                    <Space>
                        <Typography.Text>
                            {card.columnLayout == "one"
                                ? "One Column"
                                : "Two Column"}
                        </Typography.Text>
                        <EditOutlined
                            style={{ cursor: "pointer" }}
                            onClick={() => handleEdit(card)}
                        />
                        <DeleteOutlined
                            style={{ cursor: "pointer" }}
                            onClick={() => setIsDeleteModalOpen(true)}
                        />
                    </Space>
                }
                bodyStyle={{ padding: isMinimized ? 0 : 24 }}
            >
                {!isMinimized ? `content for card ${index}` : null}
            </Card>

            <ConfirmModal
                title="Confirm"
                message={`Are you sure you want to delete ${card?.name}? All associated custom fields will be moved to inactive fields`}
                handleNo={() => setIsDeleteModalOpen(false)}
                handleYes={async () => {
                    setIsDeleteBtnLoading(true);
                    await deleteSection.mutate(card.id);
                    setIsDeleteBtnLoading(false);
                }}
                isOpen={isDeleteModalOpen}
                loading={isDeleteBtnLoading}
            />
        </>
    );
};

export default DraggableCard;
