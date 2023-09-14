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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBinoculars,
    faCalendarDays,
    faCamera,
    faCar,
    faChalkboardUser,
    faCirclePlay,
    faClipboardCheck,
    faEnvelope,
    faFlag,
    faGem,
    faGlobe,
    faImage,
    faKey,
    faKitMedical,
    faMedal,
    faMugHot,
    faPhoneVolume,
    faPlaneDeparture,
    faStar,
    faTag,
    faTrophy,
    faUsers,
    faUtensils,
    faWrench,
} from "@fortawesome/free-solid-svg-icons";
import ComponentActivityTypeIcon from "./ComponentActivityTypeIcon";

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
    const [activitiesSelectColumn, setActivitiesSelectColumn] = useState([]);

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
                icon: item.icon,
                cid: item.cid,
                id: Number(dataKey).toFixed(),
            };
        });

        return array;
    };

    const onChangeCheckbox = (value: any, type: boolean) => {
        let resetID = selectResetID(activitiesSelectColumn);

        let filterArray = activitiesSelectColumn.filter(
            (item: any) => item.title !== value
        );
        onChangePageValues(filterArray);
    };

    const [dataFilter, setDataFilter] = useState({
        status: 1,
        from: "setup-page",
    });

    const { data, isLoading, refetch, isFetching } = mutateGet(
        dataFilter,
        "/api/activity_type",
        "activity_type"
    );

    useEffect(() => {
        if (data?.data && data?.data.length > 0) {
            let row: any = [];
            data?.data.map((item: any, key: number) => {
                row.push({
                    title: item.type,
                    icon: item.icon,
                    cid: item.id,
                    id: item.index ? item.index : Number(key + 1).toString(),
                });
            });

            setActivitiesSelectColumn(row);
        } else {
            setActivitiesSelectColumn([]);
        }
    }, [data]);

    const onChangeTabs = (key: any) => {
        setDataFilter({
            ...dataFilter,
            status: key === "1" ? 1 : 0,
        });

        setTimeout(() => {
            refetch();
        }, 1000);
    };

    const itemTabs = [
        {
            key: "1",
            label: "ACTIVE",
        },
        {
            key: "2",
            label: "INACTIVE",
        },
    ];

    const [form] = Form.useForm();
    const [createModal, setCreateModal] = useState(false);
    const [selectedIconData, setSelectedIconData] = useState("A");

    const handleOpenCreateMdal = () => {
        setCreateModal(true);
    };

    const handleCloseCreateMdal = () => {
        setCreateModal(false);
        setSelectedIconData("A");
        setModalTitle("Add");
        form.resetFields();
    };

    const handleOnFinish = () => {
        form.validateFields()
            .then((data) => {
                let values: any = {
                    data: {
                        ...data,
                        icon: selectedIconData,
                    },
                    url: "/api/activity_type",
                };

                handlePost.mutate(values);
                notification.success({
                    message: "Success",
                    description: `Successfully ${
                        modalTitle === "Edit" ? "edited" : "added"
                    }.`,
                });
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
            queryClient.invalidateQueries("activity_type");

            handleCloseCreateMdal();
        },
    });

    const setActiveIcon = (value: string) => {
        if (value === selectedIconData) {
            return "selected-icon-active";
        }
    };

    const handleEditType = (values: any) => {
        setModalTitle("Edit");
        setCreateModal(true);
        form.setFieldsValue({
            type: values.title,
            id: values.cid,
        });
        setSelectedIconData(values.icon);
    };

    const handleArchive = (record: any) => {
        let values: any = {
            data: {
                id: record.cid,
            },
            url: "/api/activity_type/archive",
        };

        handlePost.mutate(values);
        notification.success({
            message: "Success",
            description: `Successfully archived.`,
        });
    };

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

                <Card
                    style={{
                        boxShadow: "none",
                    }}
                    bodyStyle={{ padding: "5px 19px 19px 19px" }}
                    bordered={false}
                    loading={isLoading}
                >
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <DroppableList
                            items={activitiesSelectColumn}
                            onChangeCheckbox={onChangeCheckbox}
                            ComponentActivityTypeIcon={
                                ComponentActivityTypeIcon
                            }
                            handleEditType={handleEditType}
                            handleArchive={handleArchive}
                        />
                    </DragDropContext>
                </Card>
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
                    <Space direction="vertical">
                        <Typography.Text>Select Icon</Typography.Text>

                        <Radio.Group>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "A"
                                )}`}
                                onClick={() => setSelectedIconData("A")}
                            >
                                <FontAwesomeIcon icon={faPhoneVolume} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "B"
                                )}`}
                                onClick={() => setSelectedIconData("B")}
                            >
                                <FontAwesomeIcon icon={faClipboardCheck} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "C"
                                )}`}
                                onClick={() => setSelectedIconData("C")}
                            >
                                <FontAwesomeIcon icon={faUsers} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "D"
                                )}`}
                                onClick={() => setSelectedIconData("D")}
                            >
                                <FontAwesomeIcon icon={faChalkboardUser} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "E"
                                )}`}
                                onClick={() => setSelectedIconData("E")}
                            >
                                <FontAwesomeIcon icon={faUtensils} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "F"
                                )}`}
                                onClick={() => setSelectedIconData("F")}
                            >
                                <FontAwesomeIcon icon={faCalendarDays} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "G"
                                )}`}
                                onClick={() => setSelectedIconData("G")}
                            >
                                <FontAwesomeIcon icon={faEnvelope} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "H"
                                )}`}
                                onClick={() => setSelectedIconData("H")}
                            >
                                <FontAwesomeIcon icon={faMugHot} />
                            </Radio.Button>
                        </Radio.Group>

                        <Radio.Group className="m-t-sm">
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "I"
                                )}`}
                                onClick={() => setSelectedIconData("I")}
                            >
                                <FontAwesomeIcon icon={faFlag} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "J"
                                )}`}
                                onClick={() => setSelectedIconData("J")}
                            >
                                <FontAwesomeIcon icon={faCamera} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "K"
                                )}`}
                                onClick={() => setSelectedIconData("K")}
                            >
                                <FontAwesomeIcon icon={faImage} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "L"
                                )}`}
                                onClick={() => setSelectedIconData("L")}
                            >
                                <FontAwesomeIcon icon={faCar} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "M"
                                )}`}
                                onClick={() => setSelectedIconData("M")}
                            >
                                <FontAwesomeIcon icon={faMedal} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "N"
                                )}`}
                                onClick={() => setSelectedIconData("N")}
                            >
                                <FontAwesomeIcon icon={faTrophy} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "O"
                                )}`}
                                onClick={() => setSelectedIconData("O")}
                            >
                                <FontAwesomeIcon icon={faStar} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "P"
                                )}`}
                                onClick={() => setSelectedIconData("P")}
                            >
                                <FontAwesomeIcon icon={faPlaneDeparture} />
                            </Radio.Button>
                        </Radio.Group>

                        <Radio.Group className="m-t-sm m-b-md">
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "Q"
                                )}`}
                                onClick={() => setSelectedIconData("Q")}
                            >
                                <FontAwesomeIcon icon={faGlobe} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "R"
                                )}`}
                                onClick={() => setSelectedIconData("R")}
                            >
                                <FontAwesomeIcon icon={faKey} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "S"
                                )}`}
                                onClick={() => setSelectedIconData("S")}
                            >
                                <FontAwesomeIcon icon={faTag} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "T"
                                )}`}
                                onClick={() => setSelectedIconData("T")}
                            >
                                <FontAwesomeIcon icon={faCirclePlay} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "W"
                                )}`}
                                onClick={() => setSelectedIconData("W")}
                            >
                                <FontAwesomeIcon icon={faBinoculars} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "X"
                                )}`}
                                onClick={() => setSelectedIconData("X")}
                            >
                                <FontAwesomeIcon icon={faGem} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "Y"
                                )}`}
                                onClick={() => setSelectedIconData("Y")}
                            >
                                <FontAwesomeIcon icon={faKitMedical} />
                            </Radio.Button>
                            <Radio.Button
                                className={`selected-icon ${setActiveIcon(
                                    "Z"
                                )}`}
                                onClick={() => setSelectedIconData("Z")}
                            >
                                <FontAwesomeIcon icon={faWrench} />
                            </Radio.Button>
                        </Radio.Group>
                    </Space>

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
    ComponentActivityTypeIcon: any;
    handleEditType: any;
    handleArchive: any;
}
const DroppableList: React.FC<DroppableListProps> = ({
    items,
    onChangeCheckbox,
    ComponentActivityTypeIcon,
    handleEditType,
    handleArchive,
}) => (
    <Droppable droppableId="list">
        {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
                <List className="list-activity-type">
                    {items.map((item: any, index: number) => (
                        <DraggableItem
                            key={index}
                            item={item}
                            index={index}
                            onChangeCheckbox={onChangeCheckbox}
                            ComponentActivityTypeIcon={
                                ComponentActivityTypeIcon
                            }
                            handleEditType={handleEditType}
                            handleArchive={handleArchive}
                        />
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
    onChangeCheckbox: any;
    ComponentActivityTypeIcon: any;
    handleEditType: any;
    handleArchive: any;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
    item,
    index,
    onChangeCheckbox,
    ComponentActivityTypeIcon,
    handleEditType,
    handleArchive,
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
                                {/* <HolderOutlined className="m-r-sm" /> */}
                                {ComponentActivityTypeIcon(item?.icon)}
                                <Typography.Text className="m-l-xs">
                                    {item.title}
                                </Typography.Text>
                            </Col>
                            <Col md={8} xs={2}>
                                <Space>
                                    <Button
                                        onClick={() => {
                                            handleEditType(item);
                                        }}
                                        disabled={
                                            item.title === "Call" ||
                                            item.title === "Task"
                                                ? true
                                                : false
                                        }
                                    >
                                        <EditOutlined />
                                    </Button>

                                    <Popconfirm
                                        title="Deactivate the type"
                                        description="Are you sure to deactivate this type?"
                                        onConfirm={() => {
                                            handleArchive(item);
                                        }}
                                        // onCancel={cancel}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            disabled={
                                                item.title === "Call" ||
                                                item.title === "Task"
                                                    ? true
                                                    : false
                                            }
                                        >
                                            Deactivate
                                        </Button>
                                    </Popconfirm>

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
