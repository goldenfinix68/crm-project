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
import { useMutation, useQueryClient } from "react-query";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import ContactsComponentsAddCustomField from "./ContactsComponentsAddCustomField";
import { useContactColumnSetting } from "../../../api/mutation/useContactMutation";
import { json } from "react-router-dom";

interface ContactsComponentsManageColumnProps {
    isModalManageColumnOpen: boolean;
    setIsModalManageColumnOpen: any;
    listData: ListItem[];
    setListData: any;
}

interface ListItem {
    id: string;
    title: string;
    key: string;
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
> = ({
    isModalManageColumnOpen,
    setIsModalManageColumnOpen,
    listData,
    setListData,
}) => {
    const [isModalAddCustomField, setModalAddCustomField] = useState(false);

    const fieldColumns = {
        firstName: "First Name",
        lastName: "Last Name",
        mobile: "Mobile",
        countryLink: "Country Link",
        acres: "Acres",
        phone: "Phone",
        owner: "Owner",
        email2: "Email 2",
        typeId: "Type",
        mailingStreetAddress: "Mailing Street Address",
        emailOptOut: "Email Opt Out",
        mailingCity: "Mailing City",
        mailingState: "Mailing State",
        emailOptOutReason: "Email Opt Out Reason",
        mailingZip: "Mailing Zip",
        mailingCountry: "Mailing Country",
        subdivision: "Subdivision",
        APN: "APN",
        gMapLink: "Google Map Link",
        roadFrontage: "Road Frontage",
        redfinLink: "Redfin Quick Link",
        openingBid: "Opening Bid",
        assessedValue: "Assessed Value",
        assessedVsOpeningMargin: "Assessed vs. Opening Bid Margin (manual)",
        assessedVsOpeningMultiple: "Assessed vs. Opening Bid Multiple (manual)",
        wetlandsStatus: "Wetlands Status",
        legalDescription: "Legal Description",
        legalSubdivision: "Legal Subdivision",
        floodzone: "Flood Zone",
        topography: "Topography",
        wireless1: "Wireless 1",
        wireless2: "Wireless 2",
        wireless3: "Wireless 3",
        wireless4: "Wireless 4",
        landline1: "Landline 1",
        landline2: "Landline 2",
        landline3: "Landline 3",
        landline4: "Landline 4",
        marketAreaName: "MarketAreaName",
        "hoa/poa": "HOA/ POA?",
        skype: "Skype",
        linkedIn: "LinkedIn",
        instagram: "Instagram",
        detailsDescription: "Details Description",
        tags: "Tags",
        detailsLegalDescription: "Details Legal Description",
        addressLine1: "Address Line 1",
        city: "City",
        county: "County",
        state: "State",
        email: "Email",
        jobTitle: "Job Title",
        otherPhone: "Other Phone",
        smsOptOut: "SMS Opt Out",
        website: "Website",
        facebook: "Facebook",
        twitter: "Twitter",
        addressLine2: "Address Line 2",
        zipCode: "ZipCode",
        country: "Country",
    };

    const saveColumnSetting = useMutation(useContactColumnSetting, {
        onSuccess: () => {
            console.log("success");
            // queryClient.invalidateQueries("contacts");
            // //queryClient.invalidateQueries("contactTypesAll");
            // form.resetFields();
            // if (!saveAndAdd) {
            //     setIsModalOpen(false);
            // }
            // queryClient.invalidateQueries("contacts");
        },
    });

    const onChange = (
        id: Number,
        value: string,
        key: string,
        e: CheckboxChangeEvent
    ) => {
        console.log(`checked = ${e.target.checked}`, "id: " + id);

        let items = Array.from(listData);

        if (
            !items.find((item) => item.id === id.toString()) &&
            e.target.checked
        ) {
            items.push({ id: id.toString(), title: value, key: key });
        } else if (
            items.find((item) => item.id === id.toString()) &&
            !e.target.checked
        ) {
            items = items.filter((item) => item.id !== id.toString());
            console.log(items);
        }

        setListData(items);
    };

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

    const handleFinish = () => {
        console.log("asdasda", JSON.stringify(listData));
        // if (record) {
        saveColumnSetting.mutate({ table_columns: JSON.stringify(listData) });
        // } else {
        //     saveColumnSetting.mutate(values);
        // }
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
                        onClick={() => setIsModalManageColumnOpen(false)}
                        icon={<CloseOutlined style={{ color: "white" }} />}
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
                                    <Space direction="vertical">
                                        {Object.entries(fieldColumns).map(
                                            (value: any, index: number) => (
                                                <Checkbox
                                                    key={index} // Make sure to add a unique key when rendering a list of components.
                                                    onChange={(e) => {
                                                        console.log(e);
                                                        onChange(
                                                            index,
                                                            value[1],
                                                            value[0],
                                                            e
                                                        );
                                                    }}
                                                    className="m-t-sm"
                                                >
                                                    {value[1]}{" "}
                                                    {/* Display the value as the label for the Checkbox */}
                                                </Checkbox>
                                            )
                                        )}
                                    </Space>

                                    {/* <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(2, "lastName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Last Name
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(3, "mobile", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Mobile
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(4, "email", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Email
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(5, "countyLink", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        County Link
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(6, "jobTitle", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Job Title
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(7, "acres", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Acres
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(8, "otherPhone", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Other Phone
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(9, "phone", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Phone
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(10, "smsOptOut", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        SMS Opt Out
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(11, "owner", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Owner
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(12, "email2", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Email 2
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(13, "typeId", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Type
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(
                                                14,
                                                "mailingStreetAddress",
                                                e
                                            );
                                        }}
                                        className="m-t-sm"
                                    >
                                        Mailing Street Address
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(15, "emailOptOut", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Email Opt Out
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(16, "mailingCity", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Mailing City
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(17, "mailingState", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Mailing State
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(
                                                18,
                                                "emailOptOutReason",
                                                e
                                            );
                                        }}
                                        className="m-t-sm"
                                    >
                                        Email Opt Out Reason
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(
                                                19,
                                                "mailingStreetAddress",
                                                e
                                            );
                                        }}
                                        className="m-t-sm"
                                    >
                                        Mailing Street Address
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(20, "mailingZip", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Mailing Zip
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(21, "mailingCountry", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Mailing County
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(22, "subdivision", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Subdivision
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(23, "APN", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        APN
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(24, "gMapLink", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Google Map Link
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(25, "roadFrontage", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Road Frontage (ft)
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(26, "redfinLink", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Redfin Quick Link
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(27, "openingBid", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Opening Bid
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(
                                                28,
                                                "assessedVsOpeningMargin",
                                                e
                                            );
                                        }}
                                        className="m-t-sm"
                                    >
                                        Assessed vs Opening Bid Margin (manual)
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(
                                                29,
                                                "assessedVsOpeningMultiple",
                                                e
                                            );
                                        }}
                                        className="m-t-sm"
                                    >
                                        Assessed vs Opening Bid Multiple
                                        (manual)
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(30, "wetlandsStatus", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Wetlands Status
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(31, "legalDescription", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Legal Description
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(32, "legalSubdivision", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Subdivision
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(33, "floodzone", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Flood Zone
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(34, "topography", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Topography
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(35, "wireless1", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Wireless 1
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(36, "wireless2", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Wireless 2
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(37, "wireless3", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Wireless 3
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(38, "wireless4", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Wireless 4
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(39, "landline1", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Landline 1
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(40, "landline2", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Landline 2
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(41, "landline3", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Landline 3
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(42, "landline4", e);
                                        }}
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
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(43, "skype", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Skype
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(44, "website", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Website
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(45, "linkedIn", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        LinkedIn
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(46, "facebook", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Facebook
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(47, "instagram", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Instagram
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(48, "twitter", e);
                                        }}
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
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(
                                                49,
                                                "detailsDescription",
                                                e
                                            );
                                        }}
                                        className="m-t-sm"
                                    >
                                        Description
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(50, "tags", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Tags
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(
                                                51,
                                                "detailsLegalDescription",
                                                e
                                            );
                                        }}
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
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(52, "addressLine1", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Address Line 1
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(53, "addressLine2", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Address Line 2
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(54, "city", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        City
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(55, "zipCode", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Zip Code
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(56, "county", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        County
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(57, "country", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Country
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(58, "state", e);
                                        }}
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
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(59, "name", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Name
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(60, "created_at", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Created At
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Created By
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Last Modified Date
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Last Modified By
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Last Note Added By
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Latitude
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Salesmate Score
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Longitude
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Last Note Added At
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Last Note Added
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Create Longitude
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Create Latitude
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
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
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Last Communication Date
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Last Communication Mode
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Last Communication By
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Won Deals
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Won Deals Amount
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Lost Deals
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Open Deals
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Lost Deals Amount
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Open Deals Amount
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Total Activities
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Closed Activities
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Last Email Sent Date
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Last Email Received Date
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
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
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Device
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Search Engine
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        OS
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Browser
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Browser Version
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Current URL
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Host
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        IP Address
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Path Name
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Country Code
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Region
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        User ID
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Screen Width
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Screen Height
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Library
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Library Version
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Initial Referral URL
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Initial Referral Domain
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Referral URL
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Referral Domain
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Event Type
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        UTM Source
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        UTM Campaign
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        UTM Term
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        UTM Medium
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        UTM Content
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Total Sessions
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Last Seen
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Last Chat Date
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Last Chat Received Date
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Continent Code
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Browser Language
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        IOS App Version
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        IOS Device
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        IOS OS Version
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Android App Version
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Android Device
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange(1, "fistName", e);
                                        }}
                                        className="m-t-sm"
                                    >
                                        Android OS Version
                                    </Checkbox> */}
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
                    <Col
                        md={12}
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                        }}
                    >
                        <Button type="link">
                            {" "}
                            <u>Reset to default columns</u>
                        </Button>
                    </Col>
                    <Col md={12}>
                        <Button
                            className="m-r-xs"
                            type="primary"
                            onClick={() => handleFinish()}
                        >
                            Save
                        </Button>

                        <Button
                            onClick={() => setIsModalManageColumnOpen(false)}
                        >
                            Cancel
                        </Button>
                    </Col>
                </div>

                <ContactsComponentsAddCustomField
                    isModalAddCustomField={isModalAddCustomField}
                    setModalAddCustomField={setModalAddCustomField}
                />
            </Modal>
        </>
    );
};

export default ContactsComponentsManageColumn;
