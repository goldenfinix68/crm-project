import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    Form,
    Input,
    List,
    Modal,
    Popconfirm,
    Radio,
    Row,
    Space,
    Table,
    Tabs,
    Typography,
    notification,
} from "antd";
import {
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    HolderOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import validateRules from "../../../providers/validateRules";

import { useMutation, useQueryClient } from "react-query";
import { mutateGet, mutatePost } from "../../../api/mutation/useSetupMutation";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
    DraggableLocation,
} from "react-beautiful-dnd";

interface DragEndResult {
    source: DraggableLocation;
    destination?: DraggableLocation | null;
}

interface ListItem {
    id: string;
    title: string;
}

const ComponentActivityType: React.FC = ({}) => {
    const queryClient = useQueryClient();
    const [modalTitle, setModalTitle] = useState("Add");
    const [activitiesSelectColumn, setActivitiesSelectColumn] = useState([
        { title: "Title", id: "1" },
        { title: "Start Date", id: "2" },
        { title: "Duration", id: "3" },
        { title: "Owner", id: "4" },
    ]);

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

    const onChangePageValues = (items: any) => {
        let resetID = selectResetID(items);
        setActivitiesSelectColumn(resetID);
        // localStorage.setItem(localStorageName, JSON.stringify(resetID));
    };

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

    const onChangeTabs = (key: any) => {
        console.log(key);
    };

    const itemTabs = [
        {
            key: "1",
            label: "ACTIVE",
            children: (
                <>
                    <Card
                        style={{
                            boxShadow: "none",
                        }}
                        bodyStyle={{ padding: "5px 19px 19px 19px" }}
                        bordered={false}
                        className="m-b-md"
                    >
                        <Alert
                            message="Customize types of activities you want in your company. You can rearrange them by dragging and dropping"
                            type="info"
                            showIcon
                        />
                    </Card>

                    <DragDropContext onDragEnd={handleDragEnd}>
                        <DroppableList
                            items={activitiesSelectColumn}
                            onChangeCheckbox={onChangeCheckbox}
                        />
                    </DragDropContext>
                </>
            ),
        },
        {
            key: "2",
            label: "INACTIVE",
            children: "Content of Tab Pane 2",
        },
    ];

    const [form] = Form.useForm();
    const [createModal, setCreateModal] = useState(true);

    const handleOpenCreateMdal = () => {
        setCreateModal(true);
    };

    const handleCloseCreateMdal = () => {
        setCreateModal(false);
        setModalTitle("Add");
        form.resetFields();
    };

    const handleOnFinish = () => {
        form.validateFields()
            .then((data) => {
                // let values: any = {
                //     data: data,
                //     url: "/api/tag_management",
                // };
                // handlePost.mutate(values);
                // notification.success({
                //     message: "Success",
                //     description: `Successfully ${
                //         modalTitle === "Edit" ? "edited" : "added"
                //     }.`,
                // });
            })
            .catch((error) => {
                notification.warning({
                    message: "Warning",
                    description: "Please fill-up required fields.",
                });
            });
    };

    const handlePost = useMutation(mutatePost, {
        onSuccess: (res) => {
            queryClient.invalidateQueries("tag_management");

            handleCloseCreateMdal();
        },
    });

    return (
        <>
            <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                className="m-b-md"
                onClick={handleOpenCreateMdal}
            >
                Add Activity Type
            </Button>

            <Card bodyStyle={{ padding: 0 }}>
                <Tabs
                    defaultActiveKey="1"
                    items={itemTabs}
                    onChange={onChangeTabs}
                />
            </Card>

            <Modal
                open={createModal}
                onCancel={handleCloseCreateMdal}
                title={
                    <Typography.Text>
                        {modalTitle} Activity Type
                    </Typography.Text>
                }
                className="manage-column-field"
                footer={[
                    <Space key={"footer"}>
                        <Button type="primary" onClick={handleOnFinish}>
                            {modalTitle}
                        </Button>

                        <Button onClick={handleCloseCreateMdal}> Cancel</Button>
                    </Space>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Typography.Text>Select Icon</Typography.Text>

                    <Form.Item name={"icon"} label="Select Icon">
                        <Radio.Group>{/* <Radin */}</Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name={"type"}
                        label="Name"
                        rules={[validateRules.required]}
                    >
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item
                        name={"id"}
                        label="id"
                        style={{ display: "none" }}
                    >
                        <Input size="large" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ComponentActivityType;

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
                <List className="list-activity-type">
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
                                span={6}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <HolderOutlined className="m-r-sm" />
                                {item.title}
                            </Col>
                            <Col
                                span={10}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <HolderOutlined className="m-r-sm" />
                                {item.title}
                            </Col>
                            <Col md={8} xs={2}>
                                <Space>
                                    <Button onClick={() => {}}>
                                        <EditOutlined />
                                    </Button>
                                    <Button onClick={() => {}}>
                                        Deactivate
                                    </Button>
                                    <Button onClick={() => {}}>
                                        Manage Outcomes
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </List.Item>
            </div>
        )}
    </Draggable>
);
