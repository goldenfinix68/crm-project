import React, { useEffect, useState } from "react";
import { Space, List, Tag, message, Tooltip } from "antd";
import { useDrag, useDrop } from "react-dnd";
import {
    EditOutlined,
    DeleteOutlined,
    HolderOutlined,
    LockOutlined,
} from "@ant-design/icons";
import { TCustomField } from "../entities";
import { useMutation } from "react-query";
import {
    deleteCustomFieldMutation,
    sortCustomFieldsMutation,
} from "../api/mutation/useCustomFieldMutation";
import queryClient from "../queryClient";
import ConfirmModal from "./ConfirmModal";
import { FIELD_TYPE_LIST } from "../constants";
import CustomFieldAddUpdateModal from "./CustomFieldAddUpdateModal";

const DraggableCustomFieldList = ({
    id,
    index,
    customField,
    customFields,
    type,
}: {
    id: number;
    index: number;
    customField: TCustomField;
    customFields: TCustomField[];
    type: string;
}) => {
    const [selectedCustomField, setSelectedCustomField] = useState<
        TCustomField | undefined
    >();
    const [isCustomFieldAddUpdateOpen, setIsCustomFielAddUpdateOpen] =
        React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteBtnLoading, setIsDeleteBtnLoading] = useState(false);
    const [customFieldsArr, setCustomFieldsArr] = useState<
        TCustomField[] | undefined
    >(customFields);

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
        setCustomFieldsArr(updatedCards);
        console.log(updatedCards);
        sortCustomFields.mutate(updatedCards);
    };

    useEffect(() => {
        setCustomFieldsArr(customFields);
    }, [customFields]);
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
                            {customField.isDefault ? (
                                <Tooltip title="You can not edit or delete default field. However, you can still move it within its section.">
                                    <LockOutlined style={{ color: "gray" }} />
                                </Tooltip>
                            ) : null}
                        </Space>
                    }
                    // description={item.email}
                />
                <Space>
                    {!customField.isDefault ? (
                        <Tag color="orange">Custom Field</Tag>
                    ) : null}
                    <Tag>
                        {
                            FIELD_TYPE_LIST.find(
                                (field) => field.type == customField.type
                            )?.label
                        }
                    </Tag>
                    {customField.isRequired ? (
                        <Tag color="red">Required</Tag>
                    ) : null}
                    <EditOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            if (customField.isDefault) {
                                message.error("Cannot edit default section");
                            } else {
                                setIsCustomFielAddUpdateOpen(true);
                                setSelectedCustomField(customField);
                            }
                        }}
                    />
                    <DeleteOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            if (customField.isDefault) {
                                message.error("Cannot delete default section");
                            } else {
                                setIsDeleteModalOpen(true);
                                setSelectedCustomField(customField);
                            }
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
