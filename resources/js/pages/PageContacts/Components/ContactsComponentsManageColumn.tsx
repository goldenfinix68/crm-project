import { CaretDownFilled } from "@ant-design/icons";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
    DraggableLocation,
} from "react-beautiful-dnd";
import type { MenuProps } from "antd";
import {
    Button,
    Col,
    Dropdown,
    Modal,
    Row,
    Space,
    Input,
    Select,
    Typography,
    Checkbox,
    Divider,
    List,
    Card,
    Empty,
} from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    CheckCircleOutlined,
    FunnelPlotOutlined,
    PhoneOutlined,
    FileDoneOutlined,
    TeamOutlined,
    PlaySquareOutlined,
    TableOutlined,
    PlusCircleOutlined,
    DownOutlined,
    LockOutlined,
    CloseOutlined,
    HolderOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import ContactsComponentsAddCustomField from "./ContactsComponentsAddCustomField";
import { useContactsTableColumn } from "../../../api/query/contactsQuery";

import { useContactColumnSetting } from "../../../api/mutation/useContactMutation";
import { useDeleteContactColumn } from "../../../api/mutation/useContactMutation";
import { json } from "react-router-dom";
import { useCustomFields } from "../../../api/query/customFieldQuery";
import { sortTableCustomFieldsMutation } from "../../../api/mutation/useCustomFieldMutation";
import CustomFieldAddUpdateModal from "../../../components/CustomFieldAddUpdateModal";
import { useArray } from "../../../helpers";

interface ContactsComponentsManageColumnProps {
    isModalManageColumnOpen: boolean;
    closeModal: () => void;
    handleSubmit: () => void;
}

interface ListItem {
    id: string;
    title: string;
    key: string;
    isSelected: boolean;
    tableSort: number;
}

interface ListProps {
    listData: ListItem[];
    setListData: React.Dispatch<React.SetStateAction<ListItem[]>>;
}

interface DraggableItemProps {
    item: ListItem;
    index: number;
}

interface DroppableListProps {
    items: ListItem[];
}

interface DragEndResult {
    source: DraggableLocation;
    destination?: DraggableLocation | null;
}

// const handleChange = (value: string) => {
//     console.log(`selected ${value}`);
// };

// const handleChangeType = (value: string) => {
//     console.log(`selected ${value}`);
// };

const ContactsComponentsManageColumn: React.FC<
    ContactsComponentsManageColumnProps
> = ({ isModalManageColumnOpen, closeModal, handleSubmit }) => {
    const [listData, setListData] = useState<ListItem[] | undefined>();

    const {
        array: selectedFields,
        add,
        removeById,
        updateByKey,
        setInitialArray,
    } = useArray<ListItem>();

    const [isModalAddCustomField, setModalAddCustomField] = useState(false);
    const {
        data: contactFields,
        isLoading: isContactFieldsLoading,
        refetch: refetchContactFields,
    } = useCustomFields("contact");

    const saveColumnSetting = useMutation(sortTableCustomFieldsMutation, {
        onSuccess: (res) => {
            closeModal();
            handleSubmit();
        },
    });

    const handleDragEnd = (result: DragEndResult) => {
        console.log(result);
        if (!result.destination) {
            return;
        }

        const items = Array.from(selectedFields ?? []);
        const [reorderedItem] = items.splice(result.source.index, 1);

        if (result.destination.index !== undefined) {
            items.splice(result.destination.index, 0, reorderedItem);
        }

        setInitialArray(items);
    };

    const handleFinish = () => {
        // if (record) {
        saveColumnSetting.mutate({
            selected: selectedFields,
        });

        // } else {
        //     saveColumnSetting.mutate(values);
        // }
    };

    useEffect(() => {
        if (contactFields) {
            const fields = contactFields
                ?.filter(
                    (field) =>
                        !["firstName", "lastName"].includes(field.fieldName)
                )
                .sort((a, b) => (a.label || "").localeCompare(b.label || ""))
                .map((field) => {
                    return {
                        id: field.id!,
                        key: field.id!,
                        title: field.label,
                        isSelected: field.isDisplayTable ?? false,
                        tableSort: field.tableSort ?? 0,
                    };
                });

            setListData(fields);

            setInitialArray(
                fields
                    ?.filter((data) => data.isSelected)
                    .sort((a, b) => a?.tableSort - b?.tableSort)
            );
        }
    }, [contactFields]);

    const handleReset = () => {
        // deleteContactColumn.mutate({});
    };

    const DraggableItem: React.FC<DraggableItemProps> = ({ item, index }) => (
        <Draggable draggableId={item.id.toString()} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <List.Item className="listSize">
                        <Card
                            className="cardSize"
                            style={{
                                display: "block",
                                width: "100%",
                            }}
                        >
                            <Row>
                                <Col
                                    md={22}
                                    xs={22}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <HolderOutlined className="m-r-sm" />
                                    {item.title}
                                </Col>
                                <Col md={2} xs={2}>
                                    <Button
                                        type="text"
                                        onClick={() => {
                                            removeById(item.id);
                                        }}
                                    >
                                        <CloseOutlined />
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    </List.Item>
                </div>
            )}
        </Draggable>
    );

    const DroppableList: React.FC<DroppableListProps> = ({ items }) => (
        <Droppable droppableId="list">
            {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                    <List>
                        {items.map((item, index) => (
                            <DraggableItem
                                key={item.id}
                                item={item}
                                index={index}
                            />
                        ))}
                        {provided.placeholder}
                    </List>
                </div>
            )}
        </Droppable>
    );
    return (
        <>
            <Modal
                closable={false}
                className="your-modal"
                width={1000}
                title={null}
                open={isModalManageColumnOpen}
                onCancel={closeModal}
                footer={null}
                // footer={[
                //     <Button type="primary">Save</Button>,
                //     <Button type="primary">Save and add other</Button>,
                //     <Button onClick={() => setIsModalOpen(false)}>
                //         Cancel
                //     </Button>,
                // ]}
            >
                <div className="modal-header">
                    <Typography.Title level={5} style={{ color: "white" }}>
                        Manage Columns
                    </Typography.Title>
                    <Button
                        type="link"
                        style={{ marginRight: "-640px", color: "white" }}
                        onClick={() => setModalAddCustomField(true)}
                    >
                        {" "}
                        <u>Add Custom Field</u>
                    </Button>
                    <Button
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            border: "0px",
                        }}
                        onClick={closeModal}
                        icon={<CloseOutlined style={{ color: "white" }} />}
                    />
                </div>
                <div className="modal-content">
                    <Row gutter={24} className="m-b-md m-t-md">
                        <Col md={12} xs={12}>
                            {/* <Row>
                                <Button type="primary">Contact</Button>
                                <Input
                                    className="m-t-sm m-b-lg"
                                    placeholder="Search Fields"
                                />
                            </Row> */}
                            <Row>
                                <Col
                                    md={24}
                                    xs={24}
                                    style={{
                                        height: "600px",
                                        overflowY: "auto",
                                    }}
                                >
                                    <Typography.Title level={5}>
                                        System Fields
                                    </Typography.Title>
                                    <Space direction="vertical">
                                        {listData?.map(
                                            (
                                                value: ListItem,
                                                index: number
                                            ) => {
                                                if (
                                                    selectedFields.some(
                                                        (field) =>
                                                            field.id == value.id
                                                    )
                                                ) {
                                                    return (
                                                        <Checkbox
                                                            key={index} // Make sure to add a unique key when rendering a list of components.
                                                            checked={selectedFields.some(
                                                                (field) =>
                                                                    field.id ==
                                                                    value.id
                                                            )}
                                                            onChange={(e) => {
                                                                if (
                                                                    e.target
                                                                        .checked
                                                                ) {
                                                                    add(value);
                                                                } else {
                                                                    removeById(
                                                                        value.id
                                                                    );
                                                                }
                                                            }}
                                                            className="m-t-sm"
                                                        >
                                                            {value.title}
                                                            {/* Display the value as the label for the Checkbox */}
                                                        </Checkbox>
                                                    );
                                                } else {
                                                    return null;
                                                }
                                            }
                                        )}

                                        {listData?.map(
                                            (
                                                value: ListItem,
                                                index: number
                                            ) => {
                                                if (
                                                    !selectedFields.some(
                                                        (field) =>
                                                            field.id == value.id
                                                    )
                                                ) {
                                                    return (
                                                        <Checkbox
                                                            key={index} // Make sure to add a unique key when rendering a list of components.
                                                            checked={selectedFields.some(
                                                                (field) =>
                                                                    field.id ==
                                                                    value.id
                                                            )}
                                                            onChange={(e) => {
                                                                if (
                                                                    e.target
                                                                        .checked
                                                                ) {
                                                                    add(value);
                                                                } else {
                                                                    removeById(
                                                                        value.id
                                                                    );
                                                                }
                                                            }}
                                                            className="m-t-sm"
                                                        >
                                                            {value.title}
                                                            {/* Display the value as the label for the Checkbox */}
                                                        </Checkbox>
                                                    );
                                                } else {
                                                    return null;
                                                }
                                            }
                                        )}
                                    </Space>
                                </Col>
                            </Row>
                        </Col>

                        <Col md={12} xs={12}>
                            <Row
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography.Title level={5}>
                                    Selected fields
                                </Typography.Title>
                                <Button
                                    type="link"
                                    onClick={() => setInitialArray([])}
                                >
                                    Clear all
                                </Button>
                            </Row>
                            <Row>
                                <Col md={24}>
                                    {selectedFields.length ? (
                                        <DragDropContext
                                            onDragEnd={handleDragEnd}
                                        >
                                            <DroppableList
                                                items={selectedFields}
                                            />
                                        </DragDropContext>
                                    ) : (
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        />
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <div className="modal-footer">
                    <Button
                        type="link"
                        onClick={() => {
                            handleReset();
                        }}
                    >
                        {" "}
                        <u>Reset to default columns</u>
                    </Button>
                    <Button
                        className="m-r-xs"
                        type="primary"
                        loading={saveColumnSetting.isLoading}
                        onClick={() => {
                            handleFinish();
                        }}
                    >
                        Save
                    </Button>

                    <Button onClick={closeModal}>Cancel</Button>
                </div>

                <CustomFieldAddUpdateModal
                    isModalOpen={isModalAddCustomField}
                    closeModal={() => setModalAddCustomField(false)}
                    handleSubmit={() => {
                        refetchContactFields();
                    }}
                    type={"contact"}
                />
            </Modal>
        </>
    );
};

export default ContactsComponentsManageColumn;
