import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    Checkbox,
    Col,
    Input,
    List,
    Modal,
    Radio,
    Row,
    Space,
    Typography,
} from "antd";
import type { MenuProps } from "antd";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
    DraggableLocation,
} from "react-beautiful-dnd";
import { CloseOutlined, HolderOutlined } from "@ant-design/icons";
import { json } from "react-router-dom";
import { CheckboxChangeEvent } from "antd/es/checkbox";

interface DragEndResult {
    source: DraggableLocation;
    destination?: DraggableLocation | null;
}

interface ListItem {
    id: string;
    title: string;
}

interface ModalManageColumnProps {
    isModalManageColumnOpen: boolean;
    setIsModalManageColumnOpen: any;
    activitiesSelectColumn: [];
    setActivitiesSelectColumn: any;
    localStorageName: string;
}

const ModalManageColumn: React.FC<ModalManageColumnProps> = ({
    isModalManageColumnOpen,
    setIsModalManageColumnOpen,
    activitiesSelectColumn,
    setActivitiesSelectColumn,
    localStorageName,
}) => {
    const [currentTabs, setCurrentTabs] = useState("active");

    const handleDragEnd = (result: DragEndResult) => {
        if (!result.destination) {
            return;
        }
        const items = Array.from(activitiesSelectColumn);
        const [reorderedItem] = items.splice(result.source.index, 1);
        if (result.destination.index !== undefined) {
            items.splice(result.destination.index, 0, reorderedItem);
        }

        onChangePageValues(items);
    };

    const handleCancel = () => {
        setIsModalManageColumnOpen(false);
    };

    useEffect(() => {
        let filter = activitiesSelectColumn.map((item: any) => item.title);
        console.log("activitiesSelectColumn", activitiesSelectColumn);
    }, [activitiesSelectColumn]);

    const [checkboxDefault, setCheckboxDefault] = useState([
        { label: "Title", value: "Title" },
        { label: "Duration", value: "Duration" },
        { label: "Owner", value: "Owner" },
        { label: "Availability", value: "Availability" },
        { label: "Start Date", value: "Start Date" },
        { label: "Location", value: "Location" },
        { label: "Type", value: "Type" },
        { label: "Video Conferencing", value: "Video Conferencing" },
        { label: "Tags", value: "Tags" },
        { label: "Name", value: "Name" },
    ]);

    const onChangeDefault = (checkedValues: CheckboxValueType[]) => {
        // let array = checkedValues.map((item: any, key: Number) => {
        //     let newID = Number(key) + 1;
        //     return {
        //         title: item,
        //         id: newID.toFixed(),
        //     };
        // });
        // onChangePageValues(array);

        let defaultArray = activitiesSelectColumn.map(
            (item: any) => item.title
        );

        let filterArray = defaultArray.filter(
            (item) => !checkedValues.includes(item)
        );

        console.log("onChangeDefault", checkedValues);
        console.log("onChangeDefault", defaultArray);
        // console.log("onChangeDefault", filterArray);
    };

    const onChangePageValues = (items: any) => {
        setActivitiesSelectColumn(items);
        localStorage.setItem(localStorageName, JSON.stringify(items));
    };

    return (
        <Modal
            className="modal-activity-manage-column"
            // open={true}
            open={isModalManageColumnOpen}
            // onOk={handleOkAdd}
            onCancel={() => {
                handleCancel();
            }}
            width={980}
            // afterClose={halderAfterClose}
            title={
                <>
                    <Typography.Text> Manage Columns</Typography.Text>
                </>
            }
            footer={
                <Space key={"buttons"} className="w-100 footer-space">
                    <Button type="link" className="p-l-none">
                        Reset to default columns
                    </Button>
                    <Space>
                        <Button type="primary">Save</Button>
                        <Button
                            onClick={() => {
                                handleCancel();
                            }}
                        >
                            Cancel
                        </Button>
                    </Space>
                </Space>
            }
        >
            <Row gutter={12} style={{ maxHeight: 645 }}>
                <Col span={12} className="columns-list">
                    <Space direction="vertical" size={15} className="w-100">
                        <Radio.Group
                            value={currentTabs}
                            onChange={(e) => setCurrentTabs(e.target.value)}
                        >
                            <Radio.Button value="active">
                                Active Columns
                            </Radio.Button>
                            <Radio.Button value="archive">
                                Archived Columns
                            </Radio.Button>
                        </Radio.Group>

                        <Input placeholder="Search Fields" className="w-100" />
                    </Space>

                    <div className="m-t-md custom-column-list">
                        <Row gutter={[12, 12]}>
                            <Col span={24}>
                                <Typography.Text strong>
                                    System Fields
                                </Typography.Text>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Id"}>Id</Checkbox>
                            </Col>
                        </Row>

                        <Row gutter={[12, 12]} className="m-t-md">
                            <Col span={24}>
                                <Typography.Text strong>
                                    Default
                                </Typography.Text>
                            </Col>

                            <Checkbox.Group
                                className="checkbox-group w-100"
                                options={checkboxDefault}
                                defaultValue={
                                    activitiesSelectColumn.length > 0
                                        ? activitiesSelectColumn.map(
                                              (item: any) => item.title
                                          )
                                        : []
                                }
                                onChange={onChangeDefault}
                            />

                            {/* custom fields start */}
                            {/* <Col span={24}>
                                <Space className="w-100 custom-column-field">
                                    <Checkbox value={"Owner"}>Owner</Checkbox>
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </Space>
                            </Col> */}
                        </Row>

                        <Row gutter={[12, 12]} className="m-t-md">
                            <Col span={24}>
                                <Typography.Text strong>
                                    Internal
                                </Typography.Text>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Created By"}>
                                    Created By
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Completed Date"}>
                                    Completed Date
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Last Modified By"}>
                                    Last Modified By
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Created At"}>
                                    Created At
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Last Note Added At"}>
                                    Last Note Added At
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Last Modified Date"}>
                                    Last Modified Date
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Last Note Added"}>
                                    Last Note Added
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Last Note Added By"}>
                                    Last Note Added By
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Created Longitude"}>
                                    Created Longitude
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Created Latitude"}>
                                    Created Latitude
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Created Address"}>
                                    Created Address
                                </Checkbox>
                            </Col>
                        </Row>
                    </div>
                </Col>

                <Col span={12} className="selected-fields">
                    <Space
                        size={15}
                        className="w-100"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography.Text strong>
                            Selected fields
                        </Typography.Text>

                        <Button type="link" className="p-r-none">
                            Clear All
                        </Button>
                    </Space>

                    <DragDropContext onDragEnd={handleDragEnd}>
                        <DroppableList items={activitiesSelectColumn} />
                    </DragDropContext>
                </Col>
            </Row>
        </Modal>
    );
};

export default ModalManageColumn;

interface DroppableListProps {
    items: ListItem[];
}
const DroppableList: React.FC<DroppableListProps> = ({ items }) => (
    <Droppable droppableId="list">
        {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
                <List>
                    {items.map((item, index) => (
                        <DraggableItem key={index} item={item} index={index} />
                    ))}
                    {provided.placeholder}
                </List>
            </div>
        )}
    </Droppable>
);

interface DraggableItemProps {
    item: ListItem;
    index: number;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, index }) => (
    <Draggable draggableId={item.id} index={index}>
        {(provided) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
            >
                <List.Item className="listSize">
                    <Card
                        className="card-fields"
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
                                <Button type="link">
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
