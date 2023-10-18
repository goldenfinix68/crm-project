import React, { useState } from "react";
import { Card, Space, Button, Typography, List, Tag, message } from "antd";
import { useDrag, useDrop } from "react-dnd";
import {
    DownOutlined,
    RightOutlined,
    EditOutlined,
    DeleteOutlined,
    HolderOutlined,
} from "@ant-design/icons";
import { TCustomField, TCustomFieldSection } from "../entities";
import { useMutation } from "react-query";
import {
    deleteCustomFieldMutation,
    deleteCustomFieldSectionMutation,
    sortCustomFieldsMutation,
} from "../api/mutation/useCustomFieldMutation";
import queryClient from "../queryClient";
import ConfirmModal from "./ConfirmModal";
import { FIELD_TYPE_LIST } from "../constants";
import CustomFieldAddUpdateModal from "./CustomFieldAddUpdateModal";

const DraggableCustomFieldList = ({
    id,
    index,
    moveCustomField,
    customField,
    type,
}: {
    id: number;
    index: number;
    moveCustomField: (fromIndex, toIndex) => void;
    customField: TCustomField;
    type: string;
}) => {
    const [selectedCustomField, setSelectedCustomField] = useState<
        TCustomField | undefined
    >();
    const [isCustomFieldAddUpdateOpen, setIsCustomFielAddUpdateOpen] =
        React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteBtnLoading, setIsDeleteBtnLoading] = useState(false);

    const deleteCustomField = useMutation(
        (id: string) => deleteCustomFieldMutation(id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("customFieldSections");
                queryClient.invalidateQueries("inactiveCustomFields");
                setIsDeleteModalOpen(false);
            },
            onError: (e: any) => {
                console.log(e.message || "An error occurred");
            },
        }
    );

    const [, ref] = useDrag({
        type: "CUSTOM_FIELD",
        item: { id, index },
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

    return (
        <>
            <List.Item
                key={customField.id}
                style={{ cursor: "move", width: "100%" }}
                ref={(node) => ref(drop(node))}
            >
                <List.Item.Meta
                    // avatar={<Avatar src={item.picture.large} />}
                    title={
                        <Space>
                            <HolderOutlined className="p-t-xs" />
                            {customField.label}
                        </Space>
                    }
                    // description={item.email}
                />
                <Space>
                    <Tag>
                        {
                            FIELD_TYPE_LIST.find(
                                (field) => field.type == customField.type
                            )?.label
                        }
                    </Tag>
                    {customField.isRequired && <Tag color="red">Required</Tag>}
                    <EditOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setSelectedCustomField(customField);
                            setIsCustomFielAddUpdateOpen(true);
                        }}
                    />
                    <DeleteOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setIsDeleteModalOpen(true);
                            setSelectedCustomField(customField);
                        }}
                    />
                </Space>
            </List.Item>

            {selectedCustomField && isCustomFieldAddUpdateOpen && (
                <CustomFieldAddUpdateModal
                    isModalOpen={isCustomFieldAddUpdateOpen}
                    closeModal={() => setIsCustomFielAddUpdateOpen(false)}
                    handleSubmit={() => {
                        console.log("qwe");
                    }}
                    type={type}
                    customField={selectedCustomField}
                />
            )}

            {selectedCustomField && isDeleteModalOpen && (
                <ConfirmModal
                    title="Confirm"
                    message={`Are you sure you want to mark as inactive ${selectedCustomField.label}?`}
                    handleNo={() => setIsDeleteModalOpen(false)}
                    handleYes={async () => {
                        setIsDeleteBtnLoading(true);
                        await deleteCustomField.mutate(selectedCustomField!.id);
                        setIsDeleteBtnLoading(false);
                    }}
                    isOpen={isDeleteModalOpen}
                    loading={isDeleteBtnLoading}
                />
            )}
        </>
    );
};

export default DraggableCustomFieldList;
