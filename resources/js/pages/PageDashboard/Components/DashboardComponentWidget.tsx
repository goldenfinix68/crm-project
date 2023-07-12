import React, { useState } from "react";
import { CaretDownFilled } from "@ant-design/icons";
import { Button, Card, Col, Dropdown, Row, Space } from "antd";
import { faFilter, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

function Droppable() {
    const { setNodeRef } = useDroppable({
        id: "droppable",
        data: {
            type: "type1",
        },
    });

    /* ... */
}

function Draggable() {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: "draggable",
        data: {
            supports: ["type1", "type2"],
        },
    });

    /* ... */
}

export default function DashboardComponentWidget() {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: "unique-id",
    });

    function handleDragEnd(event) {
        const { active, over } = event;

        if (
            over &&
            active.data.current.supports.includes(over.data.current.type)
        ) {
            // do stuff
        }
    }

    return (
        <>
            <Row gutter={24} className="m-t-md">
                <Col span={24}>
                    <DndContext onDragEnd={handleDragEnd}>
                        {/* <Card title="Everything to get started with Salesmate"></Card> */}
                        <Button>asdas</Button>{" "}
                    </DndContext>
                </Col>
            </Row>
        </>
    );
}
