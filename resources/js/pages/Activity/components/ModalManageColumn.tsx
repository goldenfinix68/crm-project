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
import React, { useState } from "react";
import type { CheckboxChangeEvent } from "antd/es/checkbox";

interface ActivityComponentsManageColumnProps {
    isModalManageColumnOpen: boolean;
    setIsModalManageColumnOpen: any;
}

interface ListItem {
    id: string;
    title: string;
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

const onChange = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`);
};

const ActivityComponentsManageColumn: React.FC<
    ActivityComponentsManageColumnProps
> = ({ isModalManageColumnOpen, setIsModalManageColumnOpen }) => {
    const initialListData: ListItem[] = [
        { id: "1", title: "Name" },
        { id: "2", title: "Email" },
        { id: "3", title: "Mobile" },
        { id: "4", title: "Country Link" },
        { id: "5", title: "Acres" },
        { id: "6", title: "Tags" },
        { id: "7", title: "Owner" },
        { id: "8", title: "First Name" },
        { id: "9", title: "Last Name" },
    ];

    const [listData, setListData] = useState<ListItem[]>(initialListData);

    const [isModalAddCustomField, setModalAddCustomField] = useState(false);

    const handleDragEnd = (result: DragEndResult) => {
        if (!result.destination) {
            return;
        }

        const items = Array.from(listData);
        const [reorderedItem] = items.splice(result.source.index, 1);

        if (result.destination.index !== undefined) {
            items.splice(result.destination.index, 0, reorderedItem);
        }

        setListData(items);
    };

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
                                    <Button type="text">
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
                onCancel={() => setIsModalManageColumnOpen(false)}
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
                    <Typography.Title level={5}>
                        Manage Columns
                    </Typography.Title>
                    <Button
                        type="link"
                        style={{ marginRight: "-640px" }}
                        onClick={() => setModalAddCustomField(true)}
                    >
                        {" "}
                        <u>Add Custom Field</u>
                    </Button>
                    <Button
                        onClick={() => setIsModalManageColumnOpen(false)}
                        icon={<CloseOutlined />}
                    />
                </div>
                <div className="modal-content">
                    <Row gutter={24} className="m-b-md m-t-md">
                        <Col md={12} xs={12}>
                            <Row>
                                <Button type="primary">Contact</Button>
                                <Input
                                    className="m-t-sm m-b-lg"
                                    placeholder="Search Fields"
                                />
                            </Row>
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
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        First Name
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Name
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Mobile
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Email
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        County Link
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Job Title
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Acres
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Other Phone
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Phone
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        SMS Opt Out
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Owner
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Email 2
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Type
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Mailing Street Address
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Email Opt Out
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Mailing City
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Mailing State
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Email Opt Out Reason
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Mailing Street Address
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Mailing Zip
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Mailing County
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Subdivision
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        APN
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Google Map Link
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Road Frontage (ft)
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Redfin Quick Link
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Opening Bid
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Assessed vs Opening Bid Margin (manual)
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Assessed vs Opening Bid Multiple
                                        (manual)
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Wetlands Status
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Legal Description
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Subdivision
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Flood Zone
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Topography
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Wireless 1
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Wireless 2
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Wireless 3
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Wireless 4
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Landline 1
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Landline 2
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Landline 3
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Landline 4
                                    </Checkbox>
                                    <br />
                                    <Typography.Title
                                        className="m-t-md"
                                        level={5}
                                    >
                                        Social
                                    </Typography.Title>
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Skype
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Website
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        LinkedIn
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Facebook
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Instagram
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Twitter
                                    </Checkbox>
                                    <br />
                                    <Typography.Title
                                        className="m-t-md"
                                        level={5}
                                    >
                                        Details
                                    </Typography.Title>
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Description
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Tags
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Legal Description
                                    </Checkbox>
                                    <br />
                                    <Typography.Title
                                        className="m-t-md"
                                        level={5}
                                    >
                                        Address
                                    </Typography.Title>

                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Address Line 1
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Address Line 2
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        City
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Zip Code
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        County
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Country
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        State
                                    </Checkbox>
                                    <br />
                                    <Typography.Title
                                        className="m-t-md"
                                        level={5}
                                    >
                                        Internal
                                    </Typography.Title>

                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Name
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Created At
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Created By
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Modified Date
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Modified By
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Note Added By
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Latitude
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Salesmate Score
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Longitude
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Note Added At
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Note Added
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Create Longitude
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Create Latitude
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Create Address
                                    </Checkbox>
                                    <br />
                                    <Typography.Title
                                        className="m-t-md"
                                        level={5}
                                    >
                                        Smart Fields
                                    </Typography.Title>
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Communication Date
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Communication Mode
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Communication By
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Won Deals
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Won Deals Amount
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Lost Deals
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Open Deals
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Lost Deals Amount
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Open Deals Amount
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Total Activities
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Closed Activities
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Email Sent Date
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Email Received Date
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Open Activities
                                    </Checkbox>
                                    <br />
                                    <Typography.Title
                                        className="m-t-md"
                                        level={5}
                                    >
                                        Analytics
                                    </Typography.Title>
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Device
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Search Engine
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        OS
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Browser
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Browser Version
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Current URL
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Host
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        IP Address
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Path Name
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Country Code
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Region
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        User ID
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Screen Width
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Screen Height
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Library
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Library Version
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Initial Referral URL
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Initial Referral Domain
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Referral URL
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Referral Domain
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Event Type
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        UTM Source
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        UTM Campaign
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        UTM Term
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        UTM Medium
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        UTM Content
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Total Sessions
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Seen
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Chat Date
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Chat Received Date
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Continent Code
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Browser Language
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        IOS App Version
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        IOS Device
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        IOS OS Version
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Android App Version
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Android Device
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Android OS Version
                                    </Checkbox>
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
                                <Button type="link">Clear all</Button>
                            </Row>
                            <Row>
                                <Col md={24}>
                                    <DragDropContext onDragEnd={handleDragEnd}>
                                        <DroppableList items={listData} />
                                    </DragDropContext>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <div className="modal-footer">
                    <Button type="link" style={{ marginRight: "646px" }}>
                        {" "}
                        <u>Reset to default columns</u>
                    </Button>
                    <Button className="m-r-xs" type="primary">
                        Save
                    </Button>

                    <Button onClick={() => setIsModalManageColumnOpen(false)}>
                        Cancel
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default ActivityComponentsManageColumn;
