import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    Checkbox,
    Col,
    Collapse,
    Input,
    List,
    Modal,
    Popconfirm,
    Radio,
    Row,
    Space,
    Typography,
    notification,
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

    // after modal close
    const halderAfterClose = () => {
        setActivitiesSelectColumn(
            JSON.parse(localStorage.activitiesSelectColumn)
        );
    };

    // onChange checkbox
    const onChangeCheckbox = (value: any, type: boolean) => {
        let resetID = selectResetID(activitiesSelectColumn);
        if (type) {
            let items = [
                ...resetID,
                {
                    title: value,
                    id: Number(Number(resetID.length) + 1).toFixed(),
                },
            ];
            onChangePageValues(items);
        } else {
            let filterArray = activitiesSelectColumn.filter(
                (item: any) => item.title !== value
            );
            onChangePageValues(filterArray);
        }
    };

    // reset id count
    const selectResetID = (items: any) => {
        let array = items.map((item: any, key: Number) => {
            let dataKey = Number(key) + 1;
            return {
                title: item.title,
                id: Number(dataKey).toFixed(),
            };
        });

        return array;
    };

    // check if checkbox is selected
    const checkCheckBoxSetValue = (val: string) => {
        let result = false;
        if (activitiesSelectColumn.length > 0) {
            activitiesSelectColumn.map((item: any) => {
                if (item.title === val) {
                    result = true;
                }
            });
        }
        return result;
    };

    const onChangePageValues = (items: any) => {
        let resetID = selectResetID(items);
        setActivitiesSelectColumn(resetID);
        // localStorage.setItem(localStorageName, JSON.stringify(resetID));
    };

    // Resest selected column
    const resetSelectColumns = (type: boolean) => {
        let itmes = type
            ? [
                  { title: "Title", id: "1" },
                  { title: "Start Date", id: "2" },
                  { title: "Duration", id: "3" },
                  { title: "Owner", id: "4" },
                  { title: "Title (Deal)", id: "5" },
                  { title: "Name (Contact)", id: "6" },
                  { title: "Tags", id: "7" },
              ]
            : [];

        setActivitiesSelectColumn(itmes);
        // localStorage.setItem(localStorageName, JSON.stringify(itmes));
    };

    // Save all selected columns
    const handleSaveSelectedColumn = () => {
        localStorage.setItem(
            localStorageName,
            JSON.stringify(activitiesSelectColumn)
        );
        setIsModalManageColumnOpen(false);

        notification.success({
            message: "Activity",
            description: "Successfully updated columns.",
        });
    };

    const columnsList = [
        "Id",
        "Title",
        "Duration",
        "Owner",
        "Availability",
        "Start Date",
        "Location",
        "Type",
        "Video Conferencing",
        "Title (Deal)",
        "Name (Contact)",
        "Tags",
        "Created By",
        "Completed Date",
        "Last Modified By",
        "Created At",
        "Last Note Added At",
        "Last Modified Date",
        "Last Note Added",
        "Last Note Added By",
        "Created Longitude",
        "Created Latitude",
        "Created Address",
    ];
    const [checkboxList, setCheckboxList] = useState(columnsList);

    const handleCheckCheckboxList = (value: string) => {
        let checkList = checkboxList.filter((item) => item === value);
        return checkList.length > 0 ? "" : "hide";
    };

    const onSeachColumns = (value: string) => {
        if (value) {
            let filteredColumns = checkboxList.filter((str) =>
                str.toLowerCase().includes(value.toLowerCase())
            );
            setCheckboxList(filteredColumns);
        } else {
            setCheckboxList(columnsList);
        }
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
            afterClose={halderAfterClose}
            title={
                <>
                    <Typography.Text> Activity Manage Columns</Typography.Text>
                </>
            }
            footer={
                <Space key={"buttons"} className="w-100 footer-space">
                    <Button
                        type="link"
                        className="p-l-none"
                        onClick={() => resetSelectColumns(true)}
                    >
                        Reset to default columns
                    </Button>
                    <Space>
                        <Popconfirm
                            title="Warrning Alert"
                            description="Are you sure to save this changes?"
                            onConfirm={() => handleSaveSelectedColumn()}
                            // onCancel={cancel}
                            okText="Confirm"
                            cancelText="Cancel"
                        >
                            <Button type="primary">Save</Button>
                        </Popconfirm>
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

                        <Input
                            placeholder="Search Fields"
                            className="w-100"
                            onChange={(event: any) => {
                                onSeachColumns(
                                    event.target.value ? event.target.value : ""
                                );
                            }}
                            // onSearch={(event: string) => {
                            //     onSeachColumns(event);
                            // }}
                        />
                    </Space>

                    <div className="m-t-md custom-column-list">
                        <Row gutter={[12, 12]}>
                            <Col span={24}>
                                <Typography.Text strong>
                                    System Fields
                                </Typography.Text>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList("Id")}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue("Id")}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Id",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Id
                                </Checkbox>
                            </Col>
                        </Row>

                        <Row gutter={[12, 12]} className="m-t-md">
                            <Col span={24}>
                                <Typography.Text strong>
                                    Default
                                </Typography.Text>
                            </Col>

                            <Col
                                span={24}
                                className={handleCheckCheckboxList("Title")}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue("Title")}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Title",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Title
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList("Duration")}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue("Duration")}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Duration",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Duration
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList("Owner")}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue("Owner")}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Owner",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Owner
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList(
                                    "Availability"
                                )}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue(
                                        "Availability"
                                    )}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Availability",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Availability
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList(
                                    "Start Date"
                                )}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue(
                                        "Start Date"
                                    )}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Start Date",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Start Date
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList("Location")}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue("Location")}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Location",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Location
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList("Type")}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue("Type")}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Type",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Type
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList(
                                    "Video Conferencing"
                                )}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue(
                                        "Video Conferencing"
                                    )}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Video Conferencing",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Video Conferencing
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList(
                                    "Title (Deal)"
                                )}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue(
                                        "Title (Deal)"
                                    )}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Title (Deal)",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Title (Deal)
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList(
                                    "Name (Contact)"
                                )}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue(
                                        "Name (Contact)"
                                    )}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Name (Contact)",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Name (Contact)
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList("Tags")}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue("Tags")}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Tags",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Tags
                                </Checkbox>
                            </Col>

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
                            <Col
                                span={24}
                                className={handleCheckCheckboxList(
                                    "Created By"
                                )}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue(
                                        "Created By"
                                    )}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Created By",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Created By
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList(
                                    "Completed Date"
                                )}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue(
                                        "Completed Date"
                                    )}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Completed Date",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Completed Date
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList(
                                    "Last Modified By"
                                )}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue(
                                        "Last Modified By"
                                    )}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Last Modified By",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Last Modified By
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList(
                                    "Created At"
                                )}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue(
                                        "Created At"
                                    )}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Created At",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Created At
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList(
                                    "Last Note Added At"
                                )}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue(
                                        "Last Note Added At"
                                    )}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Last Note Added At",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Last Note Added At
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList(
                                    "Last Modified Date"
                                )}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue(
                                        "Last Modified Date"
                                    )}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Last Modified Date",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Last Modified Date
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList(
                                    "Last Note Added"
                                )}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue(
                                        "Last Note Added"
                                    )}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Last Note Added",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Last Note Added
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList(
                                    "Last Note Added By"
                                )}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue(
                                        "Last Note Added By"
                                    )}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Last Note Added By",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Last Note Added By
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList(
                                    "Created Longitude"
                                )}
                            >
                                <Checkbox
                                    value={"Created Longitude"}
                                    checked={checkCheckBoxSetValue(
                                        "Created Longitude"
                                    )}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Created Longitude",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Created Longitude
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList(
                                    "Created Latitude"
                                )}
                            >
                                <Checkbox
                                    value={"Created Latitude"}
                                    checked={checkCheckBoxSetValue(
                                        "Created Latitude"
                                    )}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Created Latitude",
                                            e.target.checked
                                        );
                                    }}
                                >
                                    Created Latitude
                                </Checkbox>
                            </Col>
                            <Col
                                span={24}
                                className={handleCheckCheckboxList(
                                    "Created Address"
                                )}
                            >
                                <Checkbox
                                    checked={checkCheckBoxSetValue(
                                        "Created Address"
                                    )}
                                    onChange={(e: any) => {
                                        onChangeCheckbox(
                                            "Created Address",
                                            e.target.checked
                                        );
                                    }}
                                >
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

                        <Button
                            type="link"
                            className="p-r-none"
                            onClick={() => resetSelectColumns(false)}
                        >
                            Clear All
                        </Button>
                    </Space>

                    <DragDropContext onDragEnd={handleDragEnd}>
                        <DroppableList
                            items={activitiesSelectColumn}
                            onChangeCheckbox={onChangeCheckbox}
                        />
                    </DragDropContext>
                </Col>
            </Row>
        </Modal>
    );
};

export default ModalManageColumn;

interface DroppableListProps {
    items: ListItem[];
    onChangeCheckbox: any;
}
const DroppableList: React.FC<DroppableListProps> = ({
    items,
    onChangeCheckbox,
}) => (
    <Droppable droppableId="list">
        {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
                <List className="select-column-list">
                    {items.map((item, index) => (
                        <DraggableItem
                            key={index}
                            item={item}
                            index={index}
                            onChangeCheckbox={onChangeCheckbox}
                        />
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
    onChangeCheckbox: any;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
    item,
    index,
    onChangeCheckbox,
}) => (
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
                                <Button
                                    type="link"
                                    onClick={() => {
                                        onChangeCheckbox(item.title, false);
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
