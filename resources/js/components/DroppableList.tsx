import React from "react";
import { Card, Col, List, Row } from "antd";
import { HolderOutlined } from "@ant-design/icons";

import { Draggable, Droppable } from "react-beautiful-dnd";
import { TUser } from "../entities";

interface DroppableListProps {
    items?: TUser[];
}
const DroppableList: React.FC<DroppableListProps> = ({ items }) => (
    <Droppable droppableId="list">
        {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
                <List className="list-activity-type">
                    {items?.map((item: any, index: number) => (
                        <DraggableItem key={index} item={item} index={index} />
                    ))}
                    {provided.placeholder}
                </List>
            </div>
        )}
    </Droppable>
);

interface DraggableItemProps {
    item: any;
    index: number;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, index }) => (
    <Draggable draggableId={item.sortCallForwarding.toString()} index={index}>
        {(provided) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
            >
                <List.Item className="list-item-activity-type">
                    <Card
                        className="list-item-card-activity-type"
                        style={{
                            display: "block",
                            width: "100%",
                        }}
                    >
                        <Row>
                            <Col
                                span={12}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <HolderOutlined className="m-r-sm" />
                                {item.firstName + " " + item.lastName}
                            </Col>
                            <Col span={12}>
                                {item.numbers?.length
                                    ? item.numbers
                                          .map((number) => number.mobileNumber)
                                          .join(", ")
                                    : "Not Set"}
                            </Col>
                        </Row>
                    </Card>
                </List.Item>
            </div>
        )}
    </Draggable>
);

export default DroppableList;
