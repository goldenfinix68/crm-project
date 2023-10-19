import React, { useEffect, useState } from "react";
import { Card, Space, Button, Typography, List, message } from "antd";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import {
    DownOutlined,
    RightOutlined,
    EditOutlined,
    DeleteOutlined,
    HolderOutlined,
} from "@ant-design/icons";
import { TCustomFieldSection } from "../entities";
import { useMutation } from "react-query";
import {
    deleteCustomFieldSectionMutation,
    sortCustomFieldSectionsMutation,
} from "../api/mutation/useCustomFieldMutation";
import queryClient from "../queryClient";
import ConfirmModal from "./ConfirmModal";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableCustomFieldList from "./DraggableCustomFieldList";
import CustomFieldSectionAddUpdateModal from "./CustomFieldSectionAddUpdateModal";

const DraggableCard = ({
    id,
    index,
    card,
    type,
    sections,
}: {
    id: number;
    index: number;
    card: TCustomFieldSection;
    type: string;
    sections: TCustomFieldSection[];
}) => {
    const [
        isCustomFieldSectionAddUpdateOpen,
        setIsCustomFieldSectionAddUpdateOpen,
    ] = React.useState(false);
    const [selectedSection, setSelectedSection] = useState<
        TCustomFieldSection | undefined
    >();
    const [isMinimized, setIsMinimized] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteBtnLoading, setIsDeleteBtnLoading] = useState(false);
    const [cards, setCards] = useState<TCustomFieldSection[] | undefined>();

    const sortSections = useMutation(sortCustomFieldSectionsMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("customFieldSections");
            message.success("Succesfully saved.");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const [, ref] = useDrag({
        type: "CARD",
        canDrag: (monitor) => {
            // Check if it's not a DraggableCustomFieldList drag
            return monitor.getItemType() !== "CUSTOM_FIELD";
        },
        item: { id, index },
    });

    const [, drop] = useDrop({
        accept: "CARD",
        drop: (draggedItem: { id: number; index: number }) => {
            if (draggedItem.index !== index) {
                moveCard(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    const moveCard = (fromIndex, toIndex) => {
        const updatedCards = [...(cards || [])];
        const [movedCard] = updatedCards.splice(fromIndex, 1);
        updatedCards.splice(toIndex, 0, movedCard);
        setCards(updatedCards);
        sortSections.mutate(updatedCards);
    };

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

    useEffect(() => {
        setCards(sections);
    }, [sections]);

    return (
        <>
            <div ref={(node) => ref(drop(node))} style={{ width: "100%" }}>
                <Card
                    title={
                        <div ref={(node) => ref(drop(node))}>
                            <Space style={{ cursor: "move", width: "100%" }}>
                                <HolderOutlined className="p-t-xs" />
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
                                onClick={() => {
                                    setSelectedSection(card);
                                    setIsCustomFieldSectionAddUpdateOpen(true);
                                }}
                            />
                            <DeleteOutlined
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    if (card.isDefault) {
                                        message.error(
                                            "Cannot delete default section"
                                        );
                                    } else {
                                        setIsDeleteModalOpen(true);
                                    }
                                }}
                            />
                        </Space>
                    }
                    bodyStyle={{ padding: isMinimized ? 0 : 24 }}
                >
                    {!isMinimized ? (
                        <List
                            size="small"
                            header={false}
                            footer={false}
                            dataSource={card.fields}
                            renderItem={(customField, index) => (
                                <DraggableCustomFieldList
                                    customField={customField}
                                    customFields={card.fields ?? []}
                                    index={index}
                                    key={customField.id}
                                    id={card.id}
                                    type={type}
                                />
                            )}
                        />
                    ) : null}
                </Card>
            </div>
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
            {selectedSection && (
                <CustomFieldSectionAddUpdateModal
                    isModalOpen={isCustomFieldSectionAddUpdateOpen}
                    closeModal={() =>
                        setIsCustomFieldSectionAddUpdateOpen(false)
                    }
                    handleSubmit={() => {
                        console.log("qwe");
                    }}
                    type={type}
                    cutomFieldSection={selectedSection}
                />
            )}
        </>
    );
};

export default DraggableCard;
