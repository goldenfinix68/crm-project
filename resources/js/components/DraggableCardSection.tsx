import React, { useEffect, useState } from "react";
import { Card, Space, Button, Typography, List, Divider, message } from "antd";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import {
    DownOutlined,
    RightOutlined,
    EditOutlined,
    DeleteOutlined,
    ColumnHeightOutlined,
    HolderOutlined,
} from "@ant-design/icons";
import { TCustomField, TCustomFieldSection } from "../entities";
import { useMutation } from "react-query";
import {
    deleteCustomFieldSectionMutation,
    sortCustomFieldsMutation,
} from "../api/mutation/useCustomFieldMutation";
import queryClient from "../queryClient";
import ConfirmModal from "./ConfirmModal";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableCustomFieldList from "./DraggableCustomFieldList";
import CustomFieldAddUpdateModal from "./CustomFieldAddUpdateModal";
import CustomFieldSectionAddUpdateModal from "./CustomFieldSectionAddUpdateModal";

const DraggableCard = ({
    id,
    index,
    moveCard,
    card,
    type,
}: {
    id: number;
    index: number;
    moveCard: (fromIndex, toIndex) => void;
    card: TCustomFieldSection;
    type: string;
}) => {
    const [
        isCustomFieldSectionAddUpdateOpen,
        setIsCustomFieldSectionAddUpdateOpen,
    ] = React.useState(false);
    const [selectedSection, setSelectedSection] = useState<
        TCustomFieldSection | undefined
    >();
    const [isMinimized, setIsMinimized] = useState(false);
    const [customFields, setCustomFields] = useState<
        TCustomField[] | undefined
    >(card.fields);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteBtnLoading, setIsDeleteBtnLoading] = useState(false);

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

    const sortCustomFields = useMutation(sortCustomFieldsMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("customFieldSections");
            message.success("Succesfully saved.");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const moveCustomField = (fromIndex, toIndex) => {
        const updatedCards = [...(customFields || [])];
        const [moveCustomField] = updatedCards.splice(fromIndex, 1);
        updatedCards.splice(toIndex, 0, moveCustomField);
        setCustomFields(updatedCards);
        console.log(updatedCards);
        sortCustomFields.mutate(updatedCards);
    };

    useEffect(() => {
        setCustomFields(card.fields);
    }, [card.fields]);

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
                                onClick={() => setIsDeleteModalOpen(true)}
                            />
                        </Space>
                    }
                    bodyStyle={{ padding: isMinimized ? 0 : 24 }}
                >
                    {!isMinimized ? (
                        <DndProvider backend={HTML5Backend}>
                            <List
                                size="small"
                                header={false}
                                footer={false}
                                dataSource={customFields}
                                renderItem={(customField, index) => (
                                    <DraggableCustomFieldList
                                        customField={customField}
                                        index={index}
                                        moveCustomField={moveCustomField}
                                        key={customField.id}
                                        id={card.id}
                                        type={type}
                                        // handleEdit={(customField) => {
                                        //     setSelectedCustomField(customField);
                                        //     setIsCustomFielAddUpdateOpen(true);
                                        // }}
                                    />
                                )}
                            />
                        </DndProvider>
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
